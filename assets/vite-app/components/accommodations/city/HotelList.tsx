
import React from 'react';
import { Hotel } from '@/types/quote';
import HotelCard from '../HotelCard';

interface HotelListProps {
  hotels: Hotel[];
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
}

const HotelList = ({
  hotels,
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
}: HotelListProps) => {
  return (
    <div className="space-y-6">
      {hotels.map(hotel => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          onUpdateHotel={onUpdateHotel}
          onRemoveHotel={onRemoveHotel}
          onTogglePrimary={onTogglePrimaryHotel}
          onAddRoomCategory={onAddRoomCategory}
          onUpdateRoomCategory={onUpdateRoomCategory}
          onRemoveRoomCategory={onRemoveRoomCategory}
          onAddRoomExtra={onAddRoomExtra}
          onUpdateRoomExtra={onUpdateRoomExtra}
          onRemoveRoomExtra={onRemoveRoomExtra}
          calculateHotelCost={calculateHotelCost}
        />
      ))}
    </div>
  );
};

export default HotelList;
