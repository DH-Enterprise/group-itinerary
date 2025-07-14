
import React from 'react';
import { Hotel, RoomCategory } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Plus, Star, AlertCircle } from 'lucide-react';
import RoomCategoryRow from './RoomCategoryRow';
import { calculateTotalRoomCapacity } from '@/utils/roomUtils';
import { cn } from '@/lib/utils';

interface RoomCategoriesProps {
  hotel: Hotel;
  onAddCategory: () => void;
  onUpdateCategory: (categoryId: string, field: string, value: any) => void;
  onRemoveCategory: (categoryId: string) => void;
  travelerCount: number;
  groupType: 'known' | 'speculative';
}

const RoomCategories = ({
  hotel,
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory,
  travelerCount,
  groupType,
}: RoomCategoriesProps) => {
  const totalCapacity = calculateTotalRoomCapacity(hotel.roomCategories);
  const showCapacityWarning = groupType === 'known' && hotel.roomCategories.length > 0 && totalCapacity !== travelerCount;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium flex items-center">
          <Star className="h-4 w-4 mr-2 text-travel-orange" />
          Room Categories
        </h4>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onAddCategory}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>
      
      {showCapacityWarning && (
        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
          <div className="flex items-center text-yellow-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">Room capacity doesn't match traveler count</p>
              <p className="text-sm">
                Total room capacity: {totalCapacity} traveler{totalCapacity !== 1 ? 's' : ''} | 
                Expected: {travelerCount} traveler{travelerCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {hotel.roomCategories.length === 0 ? (
        <div className="text-sm text-gray-500 italic p-2">
          No room categories added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {hotel.roomCategories.map(category => (
            <RoomCategoryRow
              key={category.id}
              category={category}
              onUpdate={onUpdateCategory}
              onRemove={onRemoveCategory}
              currency={hotel.currency || 'USD'}
              exchangeRate={hotel.exchangeRate || 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomCategories;
