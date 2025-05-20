
import React from 'react';
import { City, Hotel } from '@/types/quote';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { calculateNightsInCity } from '@/utils/quoteUtils';
import CityTabContent from './CityTabContent';

interface AccommodationCityTabsProps {
  cities: City[];
  activeCity: string;
  setActiveCity: (cityId: string) => void;
  getHotelsForCity: (cityId: string) => Hotel[];
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

const AccommodationCityTabs = ({
  cities,
  activeCity,
  setActiveCity,
  getHotelsForCity,
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
}: AccommodationCityTabsProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs 
        defaultValue={activeCity || cities[0]?.id} 
        onValueChange={setActiveCity}
        className="w-full"
      >
        <div className="border-b px-6 py-2">
          <TabsList className="grid grid-flow-col auto-cols-max gap-4">
            {cities.map(city => (
              <TabsTrigger key={city.id} value={city.id} className="px-4 py-2">
                <span className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {city.name}
                  <Badge variant="outline" className="ml-1">
                    {calculateNightsInCity(city.checkIn, city.checkOut)} nights
                  </Badge>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {cities.map(city => (
          <TabsContent key={city.id} value={city.id}>
            <CityTabContent
              city={city}
              hotels={getHotelsForCity(city.id)}
              onAddHotel={onAddHotel}
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
              remainingBudget={remainingBudget}
              totalCost={totalCost}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AccommodationCityTabs;
