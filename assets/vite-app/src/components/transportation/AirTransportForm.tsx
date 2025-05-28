import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transportation } from '@/types/quote';
import { Users } from 'lucide-react';

interface AirTransportFormProps {
  transport: Transportation;
  onUpdate: (id: string, field: string, value: any) => void;
  defaultTravelerCount: number;
}

const AirTransportForm: React.FC<AirTransportFormProps> = ({ transport, onUpdate, defaultTravelerCount }) => {
  // Initialize airDetails if it doesn't exist
  if (!transport.airDetails) {
    onUpdate(transport.id, 'airDetails', {
      airline: '',
      flightNumber: '',
      departureTime: '',
      arrivalTime: '',
      ticketClass: 'economy',
      ratePerPerson: 0,
      travelerCount: defaultTravelerCount
    });
  }

  const handleAirDetailsChange = (field: string, value: any) => {
    const updatedAirDetails = {
      ...transport.airDetails,
      [field]: value
    };
    onUpdate(transport.id, 'airDetails', updatedAirDetails);
    
    // Update the total cost calculation
    updateTotalCost(updatedAirDetails);
  };

  // Helper function to calculate and update total cost
  const updateTotalCost = (airDetails: any) => {
    if (!airDetails) return;
    
    // If group rate is provided, use it directly
    if (airDetails.groupRate !== undefined && airDetails.groupRate !== '') {
      onUpdate(transport.id, 'cost', parseFloat(airDetails.groupRate) || 0);
    } else {
      // Otherwise calculate based on per-person rate and traveler count
      const rate = parseFloat(airDetails.ratePerPerson) || 0;
      const count = parseInt(airDetails.travelerCount) || defaultTravelerCount;
      onUpdate(transport.id, 'cost', rate * count);
    }
  };

  return (
    <Card className="border-dashed border-gray-300 mb-4">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor={`airline-${transport.id}`}>Airline</Label>
            <Input
              id={`airline-${transport.id}`}
              value={transport.airDetails?.airline || ''}
              onChange={(e) => handleAirDetailsChange('airline', e.target.value)}
              placeholder="e.g., British Airways, Delta"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`flight-number-${transport.id}`}>Flight Number</Label>
            <Input
              id={`flight-number-${transport.id}`}
              value={transport.airDetails?.flightNumber || ''}
              onChange={(e) => handleAirDetailsChange('flightNumber', e.target.value)}
              placeholder="e.g., BA1234, DL5678"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor={`departure-time-${transport.id}`}>Departure Time</Label>
            <Input
              id={`departure-time-${transport.id}`}
              type="time"
              value={transport.airDetails?.departureTime || ''}
              onChange={(e) => handleAirDetailsChange('departureTime', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`arrival-time-${transport.id}`}>Arrival Time</Label>
            <Input
              id={`arrival-time-${transport.id}`}
              type="time"
              value={transport.airDetails?.arrivalTime || ''}
              onChange={(e) => handleAirDetailsChange('arrivalTime', e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor={`ticket-class-${transport.id}`}>Ticket Class</Label>
            <Select
              value={transport.airDetails?.ticketClass || 'economy'}
              onValueChange={(value) => handleAirDetailsChange('ticketClass', value)}
            >
              <SelectTrigger id={`ticket-class-${transport.id}`}>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`traveler-count-${transport.id}`}>Number of Travelers</Label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id={`traveler-count-${transport.id}`}
                type="number"
                min="1"
                value={transport.airDetails?.travelerCount || defaultTravelerCount}
                onChange={(e) => handleAirDetailsChange('travelerCount', parseInt(e.target.value) || defaultTravelerCount)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`rate-per-person-${transport.id}`}>Rate Per Person ($)</Label>
            <Input
              id={`rate-per-person-${transport.id}`}
              type="number"
              min="0"
              step="0.01"
              value={transport.airDetails?.ratePerPerson || 0}
              onChange={(e) => handleAirDetailsChange('ratePerPerson', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`group-rate-${transport.id}`}>Group Rate ($) (Optional)</Label>
            <Input
              id={`group-rate-${transport.id}`}
              type="number"
              min="0"
              step="0.01"
              value={transport.airDetails?.groupRate || ''}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                handleAirDetailsChange('groupRate', value);
              }}
              placeholder="Leave blank for per-person pricing"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirTransportForm;
