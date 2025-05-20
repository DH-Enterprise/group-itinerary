
import React from 'react';
import { RoomCategory } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import { formatCurrency } from '@/utils/quoteUtils';

interface RoomCategoryRowProps {
  category: RoomCategory;
  onUpdate: (categoryId: string, field: string, value: any) => void;
  onRemove: (categoryId: string) => void;
}

const RoomCategoryRow = ({ category, onUpdate, onRemove }: RoomCategoryRowProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-md">
      <div className="flex-1">
        <Label htmlFor={`category-name-${category.id}`} className="text-xs">Category Name</Label>
        <Input
          id={`category-name-${category.id}`}
          value={category.name}
          onChange={(e) => onUpdate(category.id, 'name', e.target.value)}
          placeholder="e.g., Standard Double"
          className="mt-1"
        />
      </div>
      <div className="w-full md:w-24">
        <Label htmlFor={`category-rate-${category.id}`} className="text-xs">Rate (USD)</Label>
        <Input
          id={`category-rate-${category.id}`}
          type="number"
          value={category.rate}
          onChange={(e) => onUpdate(category.id, 'rate', e.target.value)}
          placeholder="0.00"
          className="mt-1"
        />
      </div>
      <div className="w-full md:w-24">
        <Label htmlFor={`category-qty-${category.id}`} className="text-xs">Quantity</Label>
        <Input
          id={`category-qty-${category.id}`}
          type="number"
          value={category.quantity}
          onChange={(e) => onUpdate(category.id, 'quantity', e.target.value)}
          placeholder="0"
          min="1"
          className="mt-1"
        />
      </div>
      <div className="w-full md:w-32 flex items-end justify-end">
        <p className="text-sm font-medium mb-2">
          {formatCurrency(category.rate * category.quantity)}
        </p>
      </div>
      <div className="flex items-end">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onRemove(category.id)}
          className="mb-1 hover:bg-red-50 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RoomCategoryRow;
