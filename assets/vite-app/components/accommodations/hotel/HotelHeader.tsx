
import React from 'react';
import { Hotel } from '@/types/quote';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import { formatCurrency } from '@/utils/quoteUtils';

interface HotelHeaderProps {
  hotel: Hotel;
  onRemoveHotel: (hotelId: string) => void;
  onTogglePrimary: (hotelId: string, cityId: string) => void;
  calculateHotelCost: (hotelId: string) => number;
}

const HotelHeader = ({
  hotel,
  onRemoveHotel,
  onTogglePrimary,
  calculateHotelCost
}: HotelHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <CardTitle className="text-lg">{hotel.name || 'New Hotel'}</CardTitle>
        {hotel.isPrimary && <Badge className="bg-travel-green">Primary</Badge>}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={hotel.isPrimary}
            onCheckedChange={() => onTogglePrimary(hotel.id, hotel.city)}
            disabled={hotel.isPrimary}
          />
          <Label className="text-sm">Set as primary</Label>
        </div>
        <Button 
          variant="destructive" 
          size="icon"
          onClick={() => onRemoveHotel(hotel.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HotelHeader;
