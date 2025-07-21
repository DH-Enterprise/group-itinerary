
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash, Bus, Plane, Train, Ship, Plus, Calendar } from 'lucide-react';
import { Transportation } from '@/types/quote';
import CoachingForm from './CoachingForm';
import AirTransportForm from './AirTransportForm';

interface TransportCardProps {
  transport: Transportation;
  updateTransport: (id: string, field: string, value: any) => void;
  removeTransport: (id: string) => void;
  defaultTravelerCount: number;
}

const TransportCard: React.FC<TransportCardProps> = ({ 
  transport, 
  updateTransport, 
  removeTransport,
  defaultTravelerCount
}) => {
  const transportTypes = [
    { value: 'coaching', label: 'Ground Transportation', icon: Bus },
    { value: 'air', label: 'Air Transportation', icon: Plane },
    { value: 'train', label: 'Train', icon: Train },
    { value: 'ferry', label: 'Ferry/Ship', icon: Ship },
    { value: 'other', label: 'Other', icon: Plus }
  ];
  
  const Icon = transportTypes.find(t => t.value === transport.type)?.icon || Plus;
  const typeLabel = transportTypes.find(t => t.value === transport.type)?.label || 'Transportation';
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      updateTransport(transport.id, 'date', date);
    }
  };
  
  // Calculate readable summary info
  const getCostSummary = () => {
    if (transport.type === 'air' && transport.airDetails) {
      if (transport.airDetails.groupRate) {
        return `Group Rate: $${transport.airDetails.groupRate}`;
      } else {
        const travelers = transport.airDetails.travelerCount || defaultTravelerCount;
        return `${travelers} × $${transport.airDetails.ratePerPerson} = $${transport.cost}`;
      }
    }
    return `$${transport.cost}`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <CardTitle className="text-lg">{typeLabel}: {transport.from} to {transport.to}</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => removeTransport(transport.id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        {transport.type === 'air' && transport.airDetails && (
          <CardDescription>
            {transport.airDetails.airline} {transport.airDetails.flightNumber} | Cost: {getCostSummary()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <div className="space-y-2">
            <Label htmlFor={`transport-from-${transport.id}`}>From</Label>
            <Input
              id={`transport-from-${transport.id}`}
              value={transport.from}
              onChange={(e) => updateTransport(transport.id, 'from', e.target.value)}
              placeholder="Departure location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`transport-to-${transport.id}`}>To</Label>
            <Input
              id={`transport-to-${transport.id}`}
              value={transport.to}
              onChange={(e) => updateTransport(transport.id, 'to', e.target.value)}
              placeholder="Arrival location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`transport-date-${transport.id}`}>Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id={`transport-date-${transport.id}`}
                type="date"
                value={transport.date instanceof Date ? transport.date.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        
        {transport.type === 'coaching' && (
          <CoachingForm 
            transport={transport}
            onUpdate={updateTransport}
          />
        )}
        
        {transport.type === 'air' && (
          <AirTransportForm 
            transport={transport}
            onUpdate={updateTransport}
            defaultTravelerCount={defaultTravelerCount}
          />
        )}
        
        <div className="space-y-2">
          <Label htmlFor={`transport-details-${transport.id}`}>Additional Details</Label>
          <Input
            id={`transport-details-${transport.id}`}
            value={transport.details}
            onChange={(e) => updateTransport(transport.id, 'details', e.target.value)}
            placeholder="Flight numbers, departure times, etc."
          />
        </div>
        
        {/* Only show the cost field for non-coaching and non-air transportation types */}
        {transport.type !== 'air' && transport.type !== 'coaching' && (
          <div className="space-y-2">
            <Label htmlFor={`transport-cost-${transport.id}`}>Cost ($)</Label>
            <Input
              id={`transport-cost-${transport.id}`}
              type="number"
              min="0"
              step="0.01"
              value={transport.cost}
              onChange={(e) => updateTransport(transport.id, 'cost', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor={`transport-notes-${transport.id}`}>Notes</Label>
          <Textarea
            id={`transport-notes-${transport.id}`}
            value={transport.notes}
            onChange={(e) => updateTransport(transport.id, 'notes', e.target.value)}
            placeholder="Add any notes about this transportation..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportCard;
