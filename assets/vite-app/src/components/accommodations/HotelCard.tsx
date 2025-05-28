
import React from 'react';
import { Hotel } from '@/types/quote';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/utils/quoteUtils';
import HotelHeader from './hotel/HotelHeader';
import RoomCategories from './hotel/RoomCategories';
import RoomExtras from './hotel/RoomExtras';

interface HotelCardProps {
  hotel: Hotel;
  onUpdateHotel: (hotelId: string, field: string, value: any) => void;
  onRemoveHotel: (hotelId: string) => void;
  onTogglePrimary: (hotelId: string, cityId: string) => void;
  onAddRoomCategory: (hotelId: string) => void;
  onUpdateRoomCategory: (hotelId: string, categoryId: string, field: string, value: any) => void;
  onRemoveRoomCategory: (hotelId: string, categoryId: string) => void;
  onAddRoomExtra: (hotelId: string) => void;
  onUpdateRoomExtra: (hotelId: string, extraId: string, field: string, value: any) => void;
  onRemoveRoomExtra: (hotelId: string, extraId: string) => void;
  calculateHotelCost: (hotelId: string) => number;
}

const HotelCard = ({
  hotel,
  onUpdateHotel,
  onRemoveHotel,
  onTogglePrimary,
  onAddRoomCategory,
  onUpdateRoomCategory,
  onRemoveRoomCategory,
  onAddRoomExtra,
  onUpdateRoomExtra,
  onRemoveRoomExtra,
  calculateHotelCost,
}: HotelCardProps) => {
  return (
    <Card className={hotel.isPrimary ? "border-2 border-travel-green" : ""}>
      <CardHeader className="pb-2">
        <HotelHeader 
          hotel={hotel}
          onRemoveHotel={onRemoveHotel}
          onTogglePrimary={onTogglePrimary}
          calculateHotelCost={calculateHotelCost}
        />
        <CardDescription>{formatCurrency(calculateHotelCost(hotel.id))}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor={`hotel-name-${hotel.id}`}>Hotel Name</Label>
          <Input
            id={`hotel-name-${hotel.id}`}
            value={hotel.name}
            onChange={(e) => onUpdateHotel(hotel.id, 'name', e.target.value)}
            placeholder="Enter hotel name"
          />
        </div>
        
        <RoomCategories
          hotel={hotel}
          onAddCategory={() => onAddRoomCategory(hotel.id)}
          onUpdateCategory={(categoryId, field, value) => 
            onUpdateRoomCategory(hotel.id, categoryId, field, value)
          }
          onRemoveCategory={(categoryId) => onRemoveRoomCategory(hotel.id, categoryId)}
        />
        
        <RoomExtras
          hotel={hotel}
          onAddExtra={() => onAddRoomExtra(hotel.id)}
          onUpdateExtra={(extraId, field, value) => 
            onUpdateRoomExtra(hotel.id, extraId, field, value)
          }
          onRemoveExtra={(extraId) => onRemoveRoomExtra(hotel.id, extraId)}
        />
        
        <div className="space-y-2">
          <Label htmlFor={`hotel-notes-${hotel.id}`}>Notes</Label>
          <Textarea
            id={`hotel-notes-${hotel.id}`}
            value={hotel.notes}
            onChange={(e) => onUpdateHotel(hotel.id, 'notes', e.target.value)}
            placeholder="Add any notes about this hotel..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
