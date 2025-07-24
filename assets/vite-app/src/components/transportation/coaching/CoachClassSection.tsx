
import React, { useEffect } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Transportation, CoachClass, Currency } from '@/types/quote';

interface CoachClassSectionProps {
  transport: Transportation;
  onUpdate: (id: string, field: string, value: any) => void;
}

const defaultCoachClasses: CoachClass[] = [
  { id: '1', type: 'D', minTravelers: 10, maxTravelers: 14, maxCapacity: 14, dailyRate: 540, currency: 'EUR', enabled: true, luxuryEdition: false, entireRate: false },
  { id: '2', type: 'F', minTravelers: 15, maxTravelers: 30, maxCapacity: 30, dailyRate: 500, currency: 'EUR', enabled: false, luxuryEdition: false, entireRate: false },
  { id: '3', type: 'G', minTravelers: 31, maxTravelers: 45, maxCapacity: 45, dailyRate: 400, currency: 'EUR', enabled: false, luxuryEdition: false, entireRate: false },
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
    coachClasses: defaultCoachClasses.map(cls => ({
      ...cls,
      currency: defaultCurrency,
    })),
    extras: [], 
  };

  // Helper function to format traveler range text
  const formatTravelerRange = (min: number | undefined, max: number | undefined): string => {
    console.log('Formatting range with min:', min, 'max:', max);
    if (min === undefined || max === undefined) {
      return 'Traveler range not specified';
    }
    return `${min}-${max} travelers`;
  };

  // Safely access coach classes or use defaults
  const coachClasses = (coachingDetails.coachClasses && coachingDetails.coachClasses.length > 0) 
    ? coachingDetails.coachClasses 
    : defaultCoachClasses;
  
  // Ensure all coach classes have the required fields
  const normalizedCoachClasses = coachClasses.map(cls => ({
    ...cls,
    minTravelers: cls.minTravelers ?? (() => {
      switch(cls.type) {
        case 'D': return 10;
        case 'F': return 15;
        case 'G': return 31;
        default: return 0;
      }
    })(),
    maxTravelers: cls.maxTravelers ?? (() => {
      switch(cls.type) {
        case 'D': return 14;
        case 'F': return 30;
        case 'G': return 45;
        default: return 0;
      }
    })()
  }));
  
  console.log('Normalized coach classes:', JSON.stringify(normalizedCoachClasses, null, 2));

  const updateCoachClass = (classId: string, field: string, value: any) => {
    const newClasses = normalizedCoachClasses.map(cc => 
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
    const { driverDays, exchangeRate } = coachingDetails;
    const dailyRate = coachClass.dailyRate || 0;
    
    // If entireRate is true, don't multiply by driverDays
    const baseNetForeign = coachClass.entireRate ? dailyRate : dailyRate * driverDays;
    const usdNet = baseNetForeign * exchangeRate;

    // Get extras if they exist, otherwise use an empty array
    const extrasArray = coachingDetails.extras || [];
    
    // Calculate extras total only if extras exist and additionalServicesIncluded is false
    const extrasTotal = coachClass.additionalServicesIncluded ? 0 : 
      extrasArray
        .filter(extra => extra.enabled)
        .reduce((sum, extra) => sum + ((extra.rate || 0) * (extra.days || 0)), 0);

    return {
      netForeign: baseNetForeign,
      usdNet: usdNet,
      usdSell: usdNet + extrasTotal
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coach Classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {normalizedCoachClasses.map((coachClass) => (
          <div key={coachClass.id} className="space-y-4 border-b pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label className="text-lg font-semibold">
                  Class {coachClass.type}{coachClass.luxuryEdition ? '+' : ''}
                </Label>
                <span className="text-sm text-muted-foreground">
                  {formatTravelerRange(coachClass.minTravelers, coachClass.maxTravelers)}
                </span>
              </div>
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
                  <Label>{coachClass.entireRate ? 'Entire Rate' : 'Daily Rate'} ({coachingDetails.selectedCurrency})</Label>
                  <Input
                    type="number"
                    value={coachClass.dailyRate}
                    onChange={(e) => updateCoachClass(coachClass.id, 'dailyRate', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="invisible">Rate Type</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`entire-rate-${coachClass.id}`}
                        checked={coachClass.entireRate}
                        onCheckedChange={(checked) => 
                          updateCoachClass(coachClass.id, 'entireRate', checked)
                        }
                      />
                      <Label htmlFor={`entire-rate-${coachClass.id}`} className="text-sm">
                        Entire Rate
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`additional-services-included-${coachClass.id}`}
                        checked={coachClass.additionalServicesIncluded || false}
                        onCheckedChange={(checked) => 
                          updateCoachClass(coachClass.id, 'additionalServicesIncluded', checked)
                        }
                      />
                      <Label htmlFor={`additional-services-included-${coachClass.id}`} className="text-sm">
                        Services included
                      </Label>
                    </div>
                  </div>
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
