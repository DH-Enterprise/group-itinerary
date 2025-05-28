import React from 'react';
import { Transportation } from '@/types/quote';
import DateAndCurrencySection from './coaching/DateAndCurrencySection';
import CoachClassSection from './coaching/CoachClassSection';
import AdditionalServicesSection from './coaching/AdditionalServicesSection';
import CoachSummarySection from './coaching/CoachSummarySection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CoachingFormProps {
  transport: Transportation;
  onUpdate: (id: string, field: string, value: any) => void;
}

const CoachingForm: React.FC<CoachingFormProps> = ({ transport, onUpdate }) => {
  // Initialize coachingDetails if it doesn't exist
  if (!transport.coachingDetails) {
    const defaultCoachClasses = [
      { id: '1', type: 'D', maxCapacity: 14, dailyRate: 540, currency: 'EUR', enabled: true },
      { id: '2', type: 'F', maxCapacity: 30, dailyRate: 500, currency: 'EUR', enabled: false },
      { id: '3', type: 'G', maxCapacity: 45, dailyRate: 400, currency: 'EUR', enabled: false },
    ];
    
    const defaultExtras = [
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
    
    onUpdate(transport.id, 'coachingDetails', {
      driverDays: 7,
      selectedCurrency: 'EUR',
      exchangeRate: 1.25,
      markupRate: 1.45,
      coachClasses: defaultCoachClasses,
      extras: defaultExtras,
    });
  }

  return (
    <div className="space-y-6">
      <DateAndCurrencySection transport={transport} onUpdate={onUpdate} />
      <CoachClassSection transport={transport} onUpdate={onUpdate} />
      <AdditionalServicesSection transport={transport} onUpdate={onUpdate} />
      <Card>
        <CardHeader>
          <CardTitle>Summary Review</CardTitle>
        </CardHeader>
        <CardContent>
          <CoachSummarySection transport={transport} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachingForm;
