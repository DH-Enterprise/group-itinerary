
import React from 'react';
import { City, Hotel } from '@/types/quote';
import CityHeader from './city/CityHeader';
import EmptyCityHotels from './city/EmptyCityHotels';
import HotelList from './city/HotelList';

interface CityTabContentProps {
  city: City;
  hotels: Hotel[];
  onAddHotel: (cityId: string) => void;
  onUpdateHotel: (hotelId: string, field: string, value: any) => void;
  onRemoveHotel: (hotelId: string) => void;
  onTogglePrimaryHotel: (hotelId: string, cityId: string) => void;
  onAddRoomCategory: (hotelId: string) => void;
  onUpdateRoomCategory: (hotelId: string, categoryId: string, field: string, value: any) => void;
  onRemoveRoomCategory: (hotelId: string, categoryId: string) => void;
  onAddRoomExtra: (hotelId: string) => void;
  onUpdateRoomExtra: (hotelId: string, extraId: string, field: string, value: any) => void;
  onRemoveRoomExtra: (hotelId: string, extraId: string) => void;
  calculateHotelCost: (hotelId: string) => number;
  remainingBudget: number;
  totalCost: number;
}

const CityTabContent = ({
  city,
  hotels,
  onAddHotel,
  onUpdateHotel,
  onRemoveHotel,
  onTogglePrimaryHotel,
  onAddRoomCategory,
  onUpdateRoomCategory,
  onRemoveRoomCategory,
  onAddRoomExtra,
  onUpdateRoomExtra,
  onRemoveRoomExtra,
  calculateHotelCost,
  remainingBudget,
  totalCost,
}: CityTabContentProps) => {
  return (
    <div className="p-6">
      <CityHeader 
        city={city} 
        onAddHotel={onAddHotel} 
        remainingBudget={remainingBudget} 
      />
      
      {hotels.length === 0 ? (
        <EmptyCityHotels onAddHotel={onAddHotel} cityId={city.id} />
      ) : (
        <HotelList 
          hotels={hotels}
          onUpdateHotel={onUpdateHotel}
          onRemoveHotel={onRemoveHotel}
          onTogglePrimaryHotel={onTogglePrimaryHotel}
          onAddRoomCategory={onAddRoomCategory}
          onUpdateRoomCategory={onUpdateRoomCategory}
          onRemoveRoomCategory={onRemoveRoomCategory}
          onAddRoomExtra={onAddRoomExtra}
          onUpdateRoomExtra={onUpdateRoomExtra}
          onRemoveRoomExtra={onRemoveRoomExtra}
          calculateHotelCost={calculateHotelCost}
        />
      )}
    </div>
  );
};

export default CityTabContent;
