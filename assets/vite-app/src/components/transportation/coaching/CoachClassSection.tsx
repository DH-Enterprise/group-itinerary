
import React, { useEffect } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Transportation, CoachClass, Currency } from '@/types/quote';

interface CoachClassSectionProps {
  transport: Transportation;
  onUpdate: (id: string, field: string, value: any) => void;
}

const defaultCoachClasses: CoachClass[] = [
  { id: '1', type: 'D', maxCapacity: 14, dailyRate: 540, currency: 'EUR', enabled: true, luxuryEdition: false },
  { id: '2', type: 'F', maxCapacity: 30, dailyRate: 500, currency: 'EUR', enabled: false, luxuryEdition: false },
  { id: '3', type: 'G', maxCapacity: 45, dailyRate: 400, currency: 'EUR', enabled: false, luxuryEdition: false },
];

const CoachClassSection: React.FC<CoachClassSectionProps> = ({
  transport,
  onUpdate,
}) => {
  const { exchangeRates } = useQuote();
  const defaultCurrency = 'EUR' as Currency;
  const defaultExchangeRate = exchangeRates.find(rate => rate.code === defaultCurrency)?.rate || 1.25;

  // Create a default coaching details object if not present
  const coachingDetails = transport.coachingDetails || {
    driverDays: 7,
    selectedCurrency: defaultCurrency,
    exchangeRate: defaultExchangeRate,
    markupRate: 1.45,
    coachClasses: defaultCoachClasses.map(cls => ({
      ...cls,
      currency: defaultCurrency,
    })),
    extras: [], 
  };

  // Safely access coach classes or use defaults
  const coachClasses = coachingDetails.coachClasses || defaultCoachClasses;

  const updateCoachClass = (classId: string, field: string, value: any) => {
    const newClasses = coachClasses.map(cc => 
      cc.id === classId ? { ...cc, [field]: value } : cc
    );
    
    updateCoachingDetails('coachClasses', newClasses);
  };

  const updateCoachingDetails = (field: string, value: any) => {
    // Create a complete new details object preserving ALL existing properties
    const newDetails = {
      ...coachingDetails,
      [field]: value,
    };
    
    onUpdate(transport.id, 'coachingDetails', newDetails);
  };

  const calculateTotals = (coachClass: CoachClass) => {
    const { driverDays, exchangeRate, markupRate } = coachingDetails;
    const dailyRate = coachClass.dailyRate || 0;
    const baseNetForeign = dailyRate * driverDays;
    const baseUSDNet = baseNetForeign * exchangeRate;
    const baseUSDSell = baseUSDNet * markupRate;

    // Get extras if they exist, otherwise use an empty array
    const extrasArray = coachingDetails.extras || [];
    
    // Calculate extras total only if extras exist
    const extrasTotal = extrasArray
      .filter(extra => extra.enabled)
      .reduce((sum, extra) => sum + ((extra.rate || 0) * (extra.days || 0)), 0);

    return {
      netForeign: baseNetForeign,
      usdNet: baseUSDNet,
      usdSell: baseUSDSell + extrasTotal
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coach Classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {coachClasses.map((coachClass) => (
          <div key={coachClass.id} className="space-y-4 border-b pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Class {coachClass.type}</Label>
              <Checkbox
                checked={coachClass.enabled}
                onCheckedChange={(checked) => 
                  updateCoachClass(coachClass.id, 'enabled', checked)
                }
              />
            </div>
            
            {coachClass.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={coachClass.type}
                    onValueChange={(value) => updateCoachClass(coachClass.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D">Class D (14 seats)</SelectItem>
                      <SelectItem value="F">Class F (30 seats)</SelectItem>
                      <SelectItem value="G">Class G (45 seats)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="invisible">Luxury</Label>
                  <div className="flex items-center h-10">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`luxury-${coachClass.id}`}
                        checked={coachClass.luxuryEdition}
                        onCheckedChange={(checked) => 
                          updateCoachClass(coachClass.id, 'luxuryEdition', checked)
                        }
                        className="mt-0"
                      />
                      <Label htmlFor={`luxury-${coachClass.id}`} className="text-sm font-medium leading-none">
                        Luxury Edition (+)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Max Capacity</Label>
                  <Input
                    type="number"
                    readOnly={true}
                    value={coachClass.maxCapacity}
                    onChange={(e) => updateCoachClass(coachClass.id, 'maxCapacity', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Daily Rate ({coachingDetails.selectedCurrency})</Label>
                  <Input
                    type="number"
                    value={coachClass.dailyRate}
                    onChange={(e) => updateCoachClass(coachClass.id, 'dailyRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
            
            {coachClass.enabled && (
              <div className="grid grid-cols-3 gap-4 mt-4 bg-muted p-4 rounded-lg">
                <div>
                  <Label>Net {coachingDetails.selectedCurrency}</Label>
                  <p className="text-xl font-bold">
                    {coachingDetails.selectedCurrency === 'EUR' ? '€' : '£'}
                    {calculateTotals(coachClass).netForeign.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label>USD Net</Label>
                  <p className="text-xl font-bold">${calculateTotals(coachClass).usdNet.toFixed(2)}</p>
                </div>
                <div>
                  <Label>USD Sell</Label>
                  <p className="text-xl font-bold text-travel-blue">${calculateTotals(coachClass).usdSell.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CoachClassSection;
