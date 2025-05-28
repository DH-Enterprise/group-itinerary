
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyCityHotelsProps {
  onAddHotel: (cityId: string) => void;
  cityId: string;
}

const EmptyCityHotels = ({ onAddHotel, cityId }: EmptyCityHotelsProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-10 text-center">
      <p className="text-gray-500">No hotels added yet for this city.</p>
      <Button className="mt-4" onClick={() => onAddHotel(cityId)}>
        <Plus className="mr-2 h-4 w-4" />
        Add First Hotel
      </Button>
    </div>
  );
};

export default EmptyCityHotels;
