
import React, { useEffect } from 'react';
import { Hotel } from '@/types/quote';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/utils/quoteUtils';
import { useQuote } from '@/context/QuoteContext';
import CurrencySelector from '../common/CurrencySelector';
import { getCurrencySymbol } from '@/utils/currencyUtils';
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
  travelerCount: number;
  groupType: 'known' | 'speculative';
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
  travelerCount,
  groupType,
}: HotelCardProps) => {
  const { exchangeRates } = useQuote();
  
  // Set default currency and exchange rate if not set
  useEffect(() => {
    if (!hotel.currency && exchangeRates && exchangeRates.length > 0) {
      const usdRate = exchangeRates.find(rate => rate.code === 'USD');
      if (usdRate) {
        onUpdateHotel(hotel.id, 'currency', 'USD');
        onUpdateHotel(hotel.id, 'exchangeRate', 1);
      }
    }
  }, [hotel.id, hotel.currency, exchangeRates, onUpdateHotel]);
  
  const handleCurrencyChange = (newCurrency: string) => {
    const selectedRate = exchangeRates?.find(rate => rate.code === newCurrency);
    if (selectedRate) {
      onUpdateHotel(hotel.id, 'currency', newCurrency);
      onUpdateHotel(hotel.id, 'exchangeRate', selectedRate.rate);
    }
  };
  
  // Calculate total cost in local currency
  const totalCost = calculateHotelCost(hotel.id);
  
  // Get the current exchange rate for the hotel's currency
  const currentRate = exchangeRates?.find(rate => rate.code === hotel.currency)?.rate || 1;
  
  // Calculate USD equivalent - if currency is not USD, multiply by the exchange rate
  const totalCostUSD = hotel.currency === 'USD' 
    ? totalCost 
    : totalCost * currentRate;
  return (
    <Card className={hotel.isPrimary ? "border-2 border-travel-green" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <HotelHeader 
              hotel={hotel}
              onRemoveHotel={onRemoveHotel}
              onTogglePrimary={onTogglePrimary}
              calculateHotelCost={calculateHotelCost}
            />
            <div className="mt-2">
              <span className="text-sm font-medium">
                {getCurrencySymbol(hotel.currency || 'USD')}{formatCurrency(totalCost)}
              </span>
              {hotel.currency !== 'USD' && (
                <span className="text-xs text-gray-500 ml-2">
                  (≈ {getCurrencySymbol('USD')}{formatCurrency(totalCostUSD)})
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-40">
              <CurrencySelector
                value={hotel.currency || 'USD'}
                onChange={handleCurrencyChange}
                exchangeRates={exchangeRates || []}
              />
            </div>
            {hotel.currency && (
              <div className="text-xs text-gray-500 whitespace-nowrap">
                <span>exchange rate </span>
                <span className="font-medium">
                  {exchangeRates?.find(rate => rate.code === hotel.currency)?.rate.toFixed(2) || '1.00'}
                </span>
              </div>
            )}
          </div>
        </div>
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
          travelerCount={travelerCount}
          groupType={groupType}
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
