
import React from 'react';
import { RoomCategory } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import { formatCurrency } from '@/utils/quoteUtils';

// Map room type names to person counts
const ROOM_TYPE_PERSON_COUNT: Record<string, number> = {
  'single': 1,
  'double': 2,
  'twin': 2,
  'triple': 3,
  'quad': 4,
  'king': 2,
  'queen': 2,
  'standard': 2,
  'deluxe': 2,
  'suite': 2
};

// Extract person count from room type name
const getPersonCount = (roomType: string): number => {
  const lowerType = roomType.toLowerCase();
  for (const [key, count] of Object.entries(ROOM_TYPE_PERSON_COUNT)) {
    if (lowerType.includes(key)) {
      return count;
    }
  }
  return 2; // Default to 2 persons if type not recognized
};

interface RoomCategoryRowProps {
  category: RoomCategory;
  onUpdate: (categoryId: string, field: string, value: any) => void;
  onRemove: (categoryId: string) => void;
}

const RoomCategoryRow = ({ category, onUpdate, onRemove }: RoomCategoryRowProps) => {
  const personCount = getPersonCount(category.name);
  const perPersonRate = category.rate / personCount;
  const totalCost = category.rate * category.quantity;

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3 p-3 bg-gray-50 rounded-md">
      <div>
        <div className="flex items-center">
          <Label htmlFor={`category-name-${category.id}`} className="text-xs">Room Type *</Label>
        </div>
          <select
              id={`category-name-${category.id}`}
          value={category.name}
          required
          className={`mt-1 flex h-10 w-full rounded-md border ${!category.name ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          onChange={(e) => {
            // Update both name and type when room type changes
            const selectedName = e.target.value;
            const selectedType = selectedName.split(' ')[0]; // e.g., 'Single Room' -> 'Single'
            onUpdate(category.id, 'name', selectedName);
            onUpdate(category.id, 'type', selectedType);
          }}
        >
          <option value="">Select room type</option>
          <option value="Single Room">Single Room (1 person)</option>
          <option value="Double Room">Double Room (2 people)</option>
          <option value="Triple Room">Triple Room (3 people)</option>
          <option value="Quad Room">Quad Room (4 people)</option>
        </select>
        {!category.name && (
          <p className="mt-1 text-xs text-red-500">Room type is required</p>
        )}
      </div>
      
      <div>
        <Label htmlFor={`category-category-${category.id}`} className="text-xs">Category</Label>
        <Input
          id={`category-category-${category.id}`}
          value={category.category || ''}
          onChange={(e) => onUpdate(category.id, 'category', e.target.value)}
          placeholder="e.g., Oceanview"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor={`category-rate-${category.id}`} className="text-xs">Room Rate (USD)</Label>
        <Input
          id={`category-rate-${category.id}`}
          type="number"
          value={category.rate}
          onChange={(e) => onUpdate(category.id, 'rate', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor={`category-qty-${category.id}`} className="text-xs">Room Quantity</Label>
        <Input
          id={`category-qty-${category.id}`}
          type="number"
          value={category.quantity}
          onChange={(e) => onUpdate(category.id, 'quantity', parseInt(e.target.value) || 0)}
          placeholder="0"
          min="0"
          className="mt-1"
        />
      </div>
      
      <div className="flex flex-col">
        <Label className="text-xs">Per Person (USD)</Label>
        <div className="mt-1 p-2 bg-white border rounded-md text-sm">
          {formatCurrency(perPersonRate)}
        </div>
      </div>
      
      <div className="flex flex-col">
        <Label className="text-xs">Total Cost (USD)</Label>
        <div className="mt-1 p-2 bg-white border rounded-md text-sm font-medium">
          {formatCurrency(totalCost)}
        </div>
      </div>
      
      <div className="flex items-end justify-end">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onRemove(category.id)}
          className="hover:bg-red-50 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RoomCategoryRow;
