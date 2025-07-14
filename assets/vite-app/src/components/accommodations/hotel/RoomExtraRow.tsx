
import React from 'react';
import { RoomExtra } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import { formatCurrency } from '@/utils/quoteUtils';
import { getCurrencySymbol } from '@/utils/currencyUtils';

interface RoomExtraRowProps {
  extra: RoomExtra;
  onUpdate: (extraId: string, field: string, value: any) => void;
  onRemove: (extraId: string) => void;
  currency?: string;
  exchangeRate?: number;
}

const RoomExtraRow = ({ 
  extra, 
  onUpdate, 
  onRemove, 
  currency = 'USD',
  exchangeRate = 1
}: RoomExtraRowProps) => {
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
      <div className="w-full md:w-28">
        <Label htmlFor={`extra-rate-${extra.id}`} className="text-xs">Rate ({currency})</Label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">
              {getCurrencySymbol(currency)}
            </span>
          </div>
          <Input
            id={`extra-rate-${extra.id}`}
            type="number"
            value={extra.rate}
            onChange={(e) => onUpdate(extra.id, 'rate', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="pl-6"
          />
        </div>
        {currency !== 'USD' && exchangeRate && (
          <p className="text-xs text-gray-500 mt-1">
            ≈ {getCurrencySymbol('USD')}{(extra.rate * exchangeRate).toFixed(2)}
          </p>
        )}
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
      <div className="w-full md:w-40 flex flex-col items-end">
        <p className="text-sm font-medium">
          {getCurrencySymbol(currency)}{formatCurrency(extra.rate * extra.quantity)}
        </p>
        {currency !== 'USD' && exchangeRate && (
          <p className="text-xs text-gray-500">
            ≈ {getCurrencySymbol('USD')}{formatCurrency(extra.rate * extra.quantity * exchangeRate)}
          </p>
        )}
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
