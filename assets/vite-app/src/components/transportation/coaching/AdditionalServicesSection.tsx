
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Transportation, CoachExtra, Currency } from '@/types/quote';

interface AdditionalServicesSectionProps {
  transport: Transportation;
  onUpdate: (id: string, field: string, value: any) => void;
}

const defaultExtras: CoachExtra[] = [
  { id: '1', name: 'Driver Guide Supplement', days: 0, rate: 0, enabled: true },
  { id: '2', name: 'Meal Expenses', days: 0, rate: 0, enabled: true },
  { id: '3', name: 'Phone Expenses', days: 0, rate: 0, enabled: true },
  { id: '4', name: 'WiFi Cost', days: 0, rate: 0, enabled: true },
  { id: '5', name: 'Drivers Accommodations', days: 0, rate: 0, enabled: false },
  { id: '6', name: 'Evening Transfer', days: 0, rate: 0, enabled: true },
  { id: '7', name: 'Airport Parking', days: 0, rate: 0, enabled: false },
  { id: '8', name: 'Overnight Parking', days: 0, rate: 0, enabled: false },
  { id: '9', name: 'Long Day Supplement', days: 0, rate: 0, enabled: false },
];

const AdditionalServicesSection: React.FC<AdditionalServicesSectionProps> = ({
  transport,
  onUpdate,
}) => {
  // Create a default coaching details object if not present
  const coachingDetails = transport.coachingDetails || {
    selectedCurrency: 'EUR' as Currency,
    driverDays: 7,
    exchangeRate: 1.25,
    markupRate: 1.45,
    coachClasses: [],
    extras: defaultExtras,
  };

  // Always ensure extras exists, either from coachingDetails or use defaults
  const extras = coachingDetails.extras || defaultExtras;

  const updateCoachingDetails = (field: string, value: any) => {
    // Create a complete new details object preserving ALL existing properties
    const newDetails = {
      ...coachingDetails,
      [field]: value,
    };
    
    // This is critical: send the ENTIRE updated object to maintain all properties
    onUpdate(transport.id, 'coachingDetails', newDetails);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b">
            <Label className="font-semibold">Service</Label>
            <Label className="font-semibold">Days</Label>
            <Label className="font-semibold">Rate ({coachingDetails.selectedCurrency})</Label>
            <Label className="font-semibold text-right">Total</Label>
          </div>
          
          {extras.map((extra, index) => (
            <div key={extra.id} className="flex items-center gap-4">
              <Checkbox
                checked={extra.enabled}
                onCheckedChange={(checked) => {
                  const newExtras = [...extras];
                  newExtras[index] = { ...extra, enabled: checked as boolean };
                  updateCoachingDetails('extras', newExtras);
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                <Label className="flex items-center">{extra.name}</Label>
                <Input
                  type="number"
                  placeholder="Days"
                  value={extra.days}
                  onChange={(e) => {
                    const newExtras = [...extras];
                    newExtras[index] = { ...extra, days: parseInt(e.target.value) || 0 };
                    updateCoachingDetails('extras', newExtras);
                  }}
                  disabled={!extra.enabled}
                />
                <Input
                  type="number"
                  placeholder="Rate"
                  value={extra.rate}
                  onChange={(e) => {
                    const newExtras = [...extras];
                    newExtras[index] = { ...extra, rate: parseFloat(e.target.value) || 0 };
                    updateCoachingDetails('extras', newExtras);
                  }}
                  disabled={!extra.enabled}
                />
                <div className="text-right">
                  <span className="font-medium">
                    {extra.enabled ? `${coachingDetails.selectedCurrency === 'EUR' ? '€' : '£'}${(extra.rate * extra.days).toFixed(2)}` : '-'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalServicesSection;
