import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Trash, Users, CalendarIcon, Check, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuote } from '@/context/QuoteContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Activity } from '@/types/quote';
import { formatCurrency } from '@/utils/quoteUtils';
import { getCurrencySymbol } from '@/utils/currencyUtils';
import { useActivityCosts } from '@/hooks/useActivityCosts';

interface BaseTravelerCost {
  count: number;
  cost: number;
  label: string;
}

interface KnownGroupTravelerCost extends BaseTravelerCost {
  // No additional fields for known groups
}

interface SpeculativeGroupTravelerCost extends BaseTravelerCost {
  rangeId: string;
}

type TravelerCostBreakdown = KnownGroupTravelerCost | SpeculativeGroupTravelerCost;

interface ActivityCardProps {
  activity: Activity;
  updateActivity: (id: string, field: string, value: any) => void;
  removeActivity: (id: string) => void;
  travelerCount: number; // Default traveler count from quote
  exchangeRates: Array<{
    code: string;
    rate: number;
  }>;
}

const ActivityCard = ({ activity, updateActivity, removeActivity, travelerCount, exchangeRates = [] }: ActivityCardProps) => {
  const [travelerCountError, setTravelerCountError] = useState('');
  const activityTypes = [
    { value: 'tour', label: 'Tour/Excursion' },
    { value: 'restaurant', label: 'Restaurant/Dining' },
    { value: 'golf', label: 'Golf' },
    { value: 'other', label: 'Other' }
  ];

  // Use the useActivityCosts hook to manage cost calculations
  const { activity: updatedActivity, handleCostChange } = useActivityCosts(activity);

  // Update parent component when local activity changes
  useEffect(() => {
    // Check each field for changes and update parent one by one
    (Object.keys(updatedActivity) as Array<keyof Activity>).forEach((key) => {
      const fieldName = String(key); // Ensure field name is a string
      if (JSON.stringify(activity[key]) !== JSON.stringify(updatedActivity[key])) {
        updateActivity(activity.id, fieldName, updatedActivity[key]);
      }
    });
  }, [updatedActivity]);

  // Handle cost changes with immediate parent update
  const handleCostUpdate = (field: 'cost' | 'costUSD' | 'exchangeRate', value: number) => {
    // First update the local state
    handleCostChange(field, value);

    // Get the updated values from the hook's state
    const updatedCosts = {
      cost: field === 'cost' ? value : updatedActivity.cost,
      costUSD: field === 'costUSD' ? value : updatedActivity.costUSD,
      exchangeRate: field === 'exchangeRate' ? value : (updatedActivity.exchangeRate || 1)
    };

    // Update the parent with each cost-related field
    updateActivity(activity.id, 'cost', updatedCosts.cost);
    updateActivity(activity.id, 'costUSD', updatedCosts.costUSD);
    updateActivity(activity.id, 'exchangeRate', updatedCosts.exchangeRate);
  };

  // Use activity-specific traveler count if available, otherwise use the default
  // Get the quote context to access groupRanges
  const { quote } = useQuote();

  // Get only the selected group ranges from quote context
  const selectedRanges = quote.groupRanges
    .filter(range => range.selected)
    .reduce((previousStepValue, range) => ({
      ...previousStepValue,
      [range.id]: true
    }), {});
    
  // Handle currency change - update both currency and exchange rate
  const handleCurrencyChange = (value: string) => {
    const newCurrency = value;
    const selectedRate = exchangeRates.find(rate => rate.code === newCurrency);
    
    if (selectedRate) {
      updateActivity(activity.id, 'currency', newCurrency);
      // Update exchange rate to the selected currency's rate
      updateActivity(activity.id, 'exchangeRate', selectedRate.rate);
    }
  };
  
  // Handle exchange rate change - should be read-only but keeping as a fallback
  const handleExchangeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateActivity(activity.id, 'exchangeRate', value);
  };

  // Get only the selected group ranges for display
  const selectedGroupRanges = quote.groupRanges.filter(range => range.selected);

  // Calculate the base cost based on perPerson setting
  const getTotalCostUsd = () => {
    const baseCost = activity.costUSD || 0;
    if (!activity.perPerson) return baseCost;
    
    if (quote.groupType === 'known') {
      const count = activity.travelerCount !== undefined ? activity.travelerCount : travelerCount;
      return baseCost * count;
    } else {
      // For speculative groups, use the minimum of the selected ranges
      const selectedRange = quote.groupRanges.find(range => range.selected);
      return selectedRange ? baseCost * selectedRange.min : baseCost;
    }
  };

  // Calculate traveler counts and costs for each selected group range
  const getTravelerCostBreakdown = (): TravelerCostBreakdown[] => {
    const baseCost = activity.costUSD || 0;
    
    if (quote.groupType === 'known') {
      const count = activity.travelerCount !== undefined ? activity.travelerCount : travelerCount;
      const result: KnownGroupTravelerCost = {
        count,
        cost: activity.perPerson ? baseCost * count : baseCost,
        label: `${count} travelers`
      };
      return [result];
    } else {
      return Object.entries(selectedRanges)
        .filter(([_, selected]) => selected)
        .map(([rangeId]) => {
          const range = quote.groupRanges.find(r => r.id === rangeId);
          if (!range) return null;
          const count = range.min; // Use the minimum value of the range
          const result: SpeculativeGroupTravelerCost = {
            rangeId,
            label: `${range.min}-${range.max} travelers`,
            count,
            cost: activity.perPerson ? baseCost * count : baseCost
          };
          return result;
        })
        .filter((item): item is SpeculativeGroupTravelerCost => item !== null);
    }
  };

  // Calculate the base total cost
  const totalCostUsd = getTotalCostUsd();
  
  // Only calculate detailed traveler counts if there are selected group ranges
  const travelerCounts = quote.groupType === 'speculative' && selectedGroupRanges.length === 0
    ? []
    : getTravelerCostBreakdown();
  
  // Use the base total cost if we're not showing detailed traveler counts
  const totalCost = travelerCounts.length > 0 
    ? travelerCounts.reduce((sum, item) => sum + (item?.cost || 0), 0)
    : totalCostUsd;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{activity.name || 'New Activity'}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeActivity(activity.id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {format(activity.date, 'EEEE, MMMM d, yyyy')} • {formatCurrency(totalCost)}
          {activity.perPerson && (
            quote.groupType === 'known' 
              ? ` • ${activity.travelerCount || travelerCount} travelers`
              : selectedGroupRanges.map(range => ` • ${range.min}-${range.max} travelers`).join(', ')
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`activity-name-${activity.id}`}>Activity Name</Label>
            <Input
                id={`activity-name-${activity.id}`}
                value={activity.name}
                onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                placeholder="Enter activity name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`activity-type-${activity.id}`}>Activity Type</Label>
            <Select
                value={activity.type}
                onValueChange={(value) => updateActivity(activity.id, 'type', value)}
            >
              <SelectTrigger id={`activity-type-${activity.id}`}>
                <SelectValue placeholder="Select type"/>
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !activity.date && "text-muted-foreground"
                    )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                  {activity.date ? format(activity.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={activity.date}
                    onSelect={(date) => date && updateActivity(activity.id, 'date', date)}
                    initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`activity-currency-${activity.id}`}>Currency</Label>
            <Select 
              onValueChange={handleCurrencyChange} 
              value={updatedActivity.currency}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {exchangeRates.length > 0 ? (
                  exchangeRates.map((rate) => (
                    <SelectItem key={rate.code} value={rate.code}>
                      {rate.code} ({getCurrencySymbol(rate.code)})
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Loading currencies...
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`activity-exchange-rate-${activity.id}`}>
              <div className="flex items-center justify-between">
                <span>Exchange Rate to USD</span>
                <span className="text-xs text-gray-500">
                  {activity.currency || 'USD'} to USD
                </span>
              </div>
            </Label>
            <Input
                id={`activity-exchange-rate-${activity.id}`}
                type="number"
                min="0"
                step="0.0001"
                value={updatedActivity.exchangeRate || ''}
                onChange={handleExchangeRateChange}
                className="w-[100px] bg-gray-100"
                placeholder="1.0"
                readOnly
                title="Exchange rate is automatically set based on selected currency"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`activity-cost-${activity.id}`}>
              Cost ({activity.currency || 'USD'})
            </Label>
            <Input
                id={`activity-cost-${activity.id}`}
                type="number"
                step="0.01"
                value={activity.cost || ''}
                onChange={(e) => handleCostChange('cost', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`activity-cost-usd-${activity.id}`}>
              Cost (USD)
            </Label>
            <div className="relative">
              <Input
                  id={`activity-cost-usd-${activity.id}`}
                  type="number"
                  step="0.01"
                  value={activity.costUSD?.toFixed(2) || '0.00'}
                  readOnly
                  placeholder="0.00"
                  className="pr-10 bg-gray-100"
              />
              <span className="absolute right-2 top-2.5 text-sm text-muted-foreground">
                = {activity.costUSD?.toFixed(2)} USD
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                  id={`activity-per-person-${activity.id}`}
                  checked={activity.perPerson}
                  onCheckedChange={(checked) => {
                    // Update the perPerson flag
                    updateActivity(activity.id, 'perPerson', checked);
                    
                    // If enabling per-person, ensure we have a traveler count
                    if (checked && activity.travelerCount === undefined) {
                      updateActivity(activity.id, 'travelerCount', travelerCount);
                    }
                  }}
              />
              <Label htmlFor={`activity-per-person-${activity.id}`} className="text-sm">
                Price is per person
              </Label>
            </div>
          </div>
        </div>

        {/* Traveler count section - only show when perPerson is true */}
        {activity.perPerson && (
            <div className="space-y-4">
              {quote.groupType === 'known' ? (
                  <div className="space-y-2">
                <Label htmlFor={`activity-travelers-${activity.id}`} className="flex items-center">
                  <Users className="h-4 w-4 mr-1"/> Number of Travelers
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                      id={`activity-travelers-${activity.id}`}
                      type="number"
                      min="1"
                      value={activity.travelerCount || travelerCount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        
                        if (quote.groupType === 'known' && value > travelerCount) {
                          setTravelerCountError(`The number of travelers for this activity (${value}) cannot exceed the total number of travelers in the quote (${travelerCount}).`);
                        } else {
                          setTravelerCountError('');
                        }
                        
                        updateActivity(activity.id, 'travelerCount', Math.max(1, value));
                      }}
                      className="max-w-24"
                  />
                  <span className="text-sm text-gray-500">of {travelerCount} total travelers</span>
                </div>
                {travelerCountError && (
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                    <div className="flex items-center text-yellow-700">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <div>
                        <p className="text-sm">{travelerCountError}</p>
                      </div>
                    </div>
                  </div>
                )}
                  </div>
              ) : (
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Users className="h-4 w-4 mr-1"/> Group Sizes
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedGroupRanges.map((range) => (
                          <div
                              key={range.id}
                              className="flex items-center p-3 border rounded-lg bg-blue-50 border-blue-200"
                          >
                            <div
                                className="w-5 h-5 border rounded flex items-center justify-center mr-3 bg-blue-600 border-blue-600">
                              <Check className="h-4 w-4 text-white"/>
                            </div>
                            <div>
                              <div className="font-medium">
                                {activity.perPerson
                                    ? `${formatCurrency(activity.costUSD)} × ${range.min} travelers (${range.label})`
                                    : range.label}
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`activity-notes-${activity.id}`}>Remarks</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="focus:outline-none">
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This will be shown on blue page</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id={`activity-remarks-${activity.id}`}
            value={activity.remarks}
            onChange={(e) => updateActivity(activity.id, 'remarks', e.target.value)}
            placeholder="Add any necessary inclusions, exclusions or other important info here"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`activity-internal-notes-${activity.id}`}>Internal Notes</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="focus:outline-none">
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This will not be shown on blue page</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id={`activity-internal-notes-${activity.id}`}
            value={activity.internalNotes || ''}
            onChange={(e) => updateActivity(activity.id, 'internalNotes', e.target.value)}
            placeholder="Add internal notes that won't be visible to clients"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`meeting-address-${activity.id}`}>Meeting Address</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="focus:outline-none">
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This will be shown on blue page</p>
              </TooltipContent>
            </Tooltip>
            <Input
              id={`meeting-address-${activity.id}`}
              value={activity.meetingAddress || ''}
              onChange={(e) => updateActivity(activity.id, 'meetingAddress', e.target.value)}
              placeholder="123 Main St, City, Country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`meeting-time-${activity.id}`}>Meeting Time</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="focus:outline-none">
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This will be shown on blue page</p>
              </TooltipContent>
            </Tooltip>
            <Input
              id={`meeting-time-${activity.id}`}
              type="text"
              value={activity.meetingTime || ''}
              onChange={(e) => updateActivity(activity.id, 'meetingTime', e.target.value)}
              placeholder="e.g., 2:00 PM, 14:00, or TBD"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h4 className="font-medium">Company Information</h4>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`company-name-${activity.id}`}>Company Name</Label>
              <Input
                id={`company-name-${activity.id}`}
                value={activity.companyName || ''}
                onChange={(e) => updateActivity(activity.id, 'companyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor={`company-email-${activity.id}`}>Contact Email</Label>
              <Input
                id={`company-email-${activity.id}`}
                type="email"
                value={activity.companyContactEmail || ''}
                onChange={(e) => updateActivity(activity.id, 'companyContactEmail', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor={`company-phone-${activity.id}`}>Contact Phone</Label>
              <Input
                id={`company-phone-${activity.id}`}
                type="tel"
                value={activity.companyContactPhone || ''}
                onChange={(e) => updateActivity(activity.id, 'companyContactPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full">
          <div className="space-y-2">
            {quote.groupType === 'known' ? (
                <div className="flex justify-between items-center">
                  <div className="text-gray-500">
                    {activity.perPerson
                        ? `${formatCurrency(activity.costUSD)} × ${activity.travelerCount || travelerCount} travelers`
                        : 'Group rate'}
                </div>
                <div className="font-medium">
                  Total: {formatCurrency(totalCost)}
                </div>
              </div>
            ) : (
              travelerCounts.length > 0 ? (
                travelerCounts.map((item, index) => (
                  <div 
                    key={'rangeId' in item ? `row-${item.rangeId}` : `row-${index}`} 
                    className="flex justify-between items-center"
                  >
                    <div className="text-gray-500">
                      {activity.perPerson
                        ? `${formatCurrency(activity.costUSD)} × ${item.count} travelers` + 
                          ('rangeId' in item ? ` (${item.label})` : '')
                        : item.label}
                    </div>
                    <div className="font-medium">
                      Total: {formatCurrency(item.cost || 0)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Select group sizes</div>
              )
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
