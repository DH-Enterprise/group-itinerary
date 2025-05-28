
import React from 'react';
import { format } from 'date-fns';
import { City } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { calculateNightsInCity, formatCurrency } from '@/utils/quoteUtils';

interface CityHeaderProps {
  city: City;
  onAddHotel: (cityId: string) => void;
  remainingBudget: number;
}

const formatDateRange = (city: City) => {
  if (city.checkIn && city.checkOut) {
    return `(${format(city.checkIn, 'M/d/yy')}-${format(city.checkOut, 'M/d/yy')})`;
  }
  return '';
};

const CityHeader = ({ city, onAddHotel, remainingBudget }: CityHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {city.name}, {city.country}
          </h3>
          <p className="text-sm text-gray-500">
            {calculateNightsInCity(city.checkIn, city.checkOut)} nights {formatDateRange(city)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm text-gray-500">Available Budget</div>
          <div className={`font-semibold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatCurrency(remainingBudget)}
          </div>
          <Button onClick={() => onAddHotel(city.id)} size="sm" className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Hotel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CityHeader;
