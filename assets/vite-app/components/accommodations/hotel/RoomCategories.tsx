
import React from 'react';
import { Hotel, RoomCategory } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Plus, Star } from 'lucide-react';
import RoomCategoryRow from './RoomCategoryRow';

interface RoomCategoriesProps {
  hotel: Hotel;
  onAddCategory: () => void;
  onUpdateCategory: (categoryId: string, field: string, value: any) => void;
  onRemoveCategory: (categoryId: string) => void;
}

const RoomCategories = ({
  hotel,
  onAddCategory,
  onUpdateCategory,
  onRemoveCategory,
}: RoomCategoriesProps) => {
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomCategories;
