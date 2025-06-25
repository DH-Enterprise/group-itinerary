
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Trash, Users, CalendarIcon, RefreshCw } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useActivityCosts } from '@/hooks/useActivityCosts';

interface ActivityCardProps {
  activity: Activity;
  updateActivity: (id: string, field: string, value: any) => void;
  removeActivity: (id: string) => void;
  travelerCount: number; // Default traveler count from quote
}

const ActivityCard = ({ activity, updateActivity, removeActivity, travelerCount }: ActivityCardProps) => {
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
  const activityTravelerCount = activity.travelerCount !== undefined ? activity.travelerCount : travelerCount;
  const totalCost = activity.perPerson ? activity.cost * activityTravelerCount : activity.costUSD || 0;
  
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
          {activity.perPerson && activityTravelerCount !== travelerCount && 
            ` • ${activityTravelerCount}/${travelerCount} travelers`}
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
                <SelectValue placeholder="Select type" />
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
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
              value={activity.currency || 'USD'}
              onValueChange={(value) => {
                updateActivity(activity.id, 'currency', value as 'USD' | 'EUR' | 'GBP');
              }}
            >
              <SelectTrigger id={`activity-currency-${activity.id}`}>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`activity-exchange-rate-${activity.id}`}>
              <div className="flex items-center justify-between">
                <span>Exchange Rate to USD</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs text-muted-foreground"
                  onClick={() => updateActivity(activity.id, 'exchangeRate', 1)}
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Reset
                </Button>
              </div>
            </Label>
            <Input
              id={`activity-exchange-rate-${activity.id}`}
              type="number"
              step="0.0001"
              min="0"
              value={activity.exchangeRate || 1}
              onChange={(e) => handleCostChange('exchangeRate', parseFloat(e.target.value) || 1)}
              placeholder="1.0"
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
                onChange={(e) => handleCostUpdate('costUSD', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="pr-10"
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
                onCheckedChange={(checked) => updateActivity(activity.id, 'perPerson', checked)}
              />
              <Label htmlFor={`activity-per-person-${activity.id}`} className="text-sm">
                Price is per person
              </Label>
            </div>
          </div>
        </div>

        {/* Traveler count section - only show when perPerson is true */}
        {activity.perPerson && (
          <div className="space-y-2">
            <Label htmlFor={`activity-travelers-${activity.id}`} className="flex items-center">
              <Users className="h-4 w-4 mr-1" /> Number of Travelers
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id={`activity-travelers-${activity.id}`}
                type="number"
                min="1"
                max={travelerCount}
                value={activityTravelerCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  const clampedValue = Math.min(Math.max(value, 1), travelerCount);
                  updateActivity(activity.id, 'travelerCount', clampedValue);
                }}
                className="max-w-24"
              />
              <span className="text-sm text-gray-500">of {travelerCount} total travelers</span>
              {activityTravelerCount !== travelerCount && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateActivity(activity.id, 'travelerCount', travelerCount)}
                  className="ml-auto text-xs"
                >
                  Reset to All
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor={`activity-notes-${activity.id}`}>Notes</Label>
          <Textarea
            id={`activity-notes-${activity.id}`}
            value={activity.notes}
            onChange={(e) => updateActivity(activity.id, 'notes', e.target.value)}
            placeholder="Add any notes about this activity..."
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between text-sm">
          <div className="text-gray-500">
            {activity.perPerson ? 
              `${formatCurrency(activity.costUSD)} × ${activityTravelerCount} travelers` : 
              'Group rate'}
          </div>
          <div className="font-medium">
            Total: {formatCurrency(totalCost)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
