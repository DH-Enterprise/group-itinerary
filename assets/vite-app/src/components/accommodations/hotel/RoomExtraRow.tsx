
import React from 'react';
import { RoomExtra } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import { formatCurrency } from '@/utils/quoteUtils';

interface RoomExtraRowProps {
  extra: RoomExtra;
  onUpdate: (extraId: string, field: string, value: any) => void;
  onRemove: (extraId: string) => void;
}

const RoomExtraRow = ({ extra, onUpdate, onRemove }: RoomExtraRowProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-md">
      <div className="flex-1">
        <Label htmlFor={`extra-name-${extra.id}`} className="text-xs">Extra Name</Label>
        <Input
          id={`extra-name-${extra.id}`}
          value={extra.name}
          onChange={(e) => onUpdate(extra.id, 'name', e.target.value)}
          placeholder="e.g., Breakfast"
          className="mt-1"
        />
      </div>
      <div className="w-full md:w-24">
        <Label htmlFor={`extra-rate-${extra.id}`} className="text-xs">Rate (USD)</Label>
        <Input
          id={`extra-rate-${extra.id}`}
          type="number"
          value={extra.rate}
          onChange={(e) => onUpdate(extra.id, 'rate', e.target.value)}
          placeholder="0.00"
          className="mt-1"
        />
      </div>
      <div className="w-full md:w-24">
        <Label htmlFor={`extra-qty-${extra.id}`} className="text-xs">Quantity</Label>
        <Input
          id={`extra-qty-${extra.id}`}
          type="number"
          value={extra.quantity}
          onChange={(e) => onUpdate(extra.id, 'quantity', e.target.value)}
          placeholder="0"
          min="1"
          className="mt-1"
        />
      </div>
      <div className="w-full md:w-32 flex items-end justify-end">
        <p className="text-sm font-medium mb-2">
          {formatCurrency(extra.rate * extra.quantity)}
        </p>
      </div>
      <div className="flex items-end">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onRemove(extra.id)}
          className="mb-1 hover:bg-red-50 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RoomExtraRow;
