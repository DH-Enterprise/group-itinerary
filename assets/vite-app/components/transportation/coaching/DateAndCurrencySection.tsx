
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Transportation, Currency } from '@/types/quote';

interface DateAndCurrencySectionProps {
  transport: Transportation;
  onUpdate: (id: string, field: string, value: any) => void;
}

const DateAndCurrencySection: React.FC<DateAndCurrencySectionProps> = ({
  transport,
  onUpdate,
}) => {
  const coachingDetails = transport.coachingDetails || {
    driverDays: 7,
    selectedCurrency: 'EUR' as Currency,
    exchangeRate: 1.25,
    markupRate: 1.45,
    coachClasses: [],
    extras: [],
  };

  const updateCoachingDetails = (field: string, value: any) => {
    const newDetails = {
      ...coachingDetails,
      [field]: value,
    };
    onUpdate(transport.id, 'coachingDetails', newDetails);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Trip Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-sm font-medium">Date & Duration</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !transport.date && "text-muted-foreground"
                    )}
                  >
                    {transport.date ? format(transport.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={transport.date}
                    onSelect={(date) => date && onUpdate(transport.id, 'date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Driver Days</Label>
              <Input 
                type="number"
                value={coachingDetails.driverDays}
                onChange={(e) => updateCoachingDetails('driverDays', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="text-sm font-medium">Currency & Rates</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select 
                value={coachingDetails.selectedCurrency}
                onValueChange={(value: Currency) => updateCoachingDetails('selectedCurrency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Exchange Rate</Label>
              <Input 
                type="number"
                step="0.01"
                value={coachingDetails.exchangeRate}
                onChange={(e) => updateCoachingDetails('exchangeRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Markup Rate</Label>
              <Input 
                type="number"
                step="0.01"
                value={coachingDetails.markupRate}
                onChange={(e) => updateCoachingDetails('markupRate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateAndCurrencySection;
