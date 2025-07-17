
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
  // Calculate the total in the local currency
  const calculateTotal = () => {
    const nights = extra.nights || 1; // Default to 1 if not set
    return extra.rate * extra.quantity * nights;
  };

  // Calculate the total in USD
  const calculateUsdTotal = () => {
    const nights = extra.nights || 1; // Default to 1 if not set
    const total = extra.rate * extra.quantity * nights;
    return currency === 'USD' ? total : (exchangeRate ? total * exchangeRate : 0);
  };
  
  const total = calculateTotal();
  const usdTotal = calculateUsdTotal();
  const showUsdTotal = currency !== 'USD' && usdTotal > 0;

  return (
    <div className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-md">
      <div className="flex flex-col">
        <Label htmlFor={`extra-name-${extra.id}`} className="text-xs">Extra Name</Label>
        <div className="w-full md:w-36 mt-1">
          <Input
            id={`extra-name-${extra.id}`}
            value={extra.name}
            onChange={(e) => onUpdate(extra.id, 'name', e.target.value)}
            placeholder="e.g., Breakfast"
          />
        </div>
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor={`extra-rate-${extra.id}`} className="text-xs">Daily Rate ({currency})</Label>
        <div className="w-full md:w-28 mt-1">
          <div className="relative">
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
        </div>
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor={`extra-nights-${extra.id}`} className="text-xs">Nights</Label>
        <div className="w-full md:w-24 mt-1">
          <Input
            id={`extra-nights-${extra.id}`}
            type="number"
            value={extra.nights || ''}
            onChange={(e) => onUpdate(extra.id, 'nights', parseInt(e.target.value) || 1)}
            placeholder="0"
            min="1"
          />
        </div>
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor={`extra-qty-${extra.id}`} className="text-xs">Quantity (travelers)</Label>
        <div className="w-full md:w-28 mt-1">
          <Input
            id={`extra-qty-${extra.id}`}
            type="number"
            value={extra.quantity}
            onChange={(e) => onUpdate(extra.id, 'quantity', parseInt(e.target.value) || 1)}
            placeholder="0"
            min="1"
          />
        </div>
      </div>
      
      <div className="flex flex-col">
        <Label htmlFor={`extra-total-${extra.id}`} className="text-xs">Total (USD)</Label>
        <div className="w-full md:w-36 mt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">
                {getCurrencySymbol('USD')}
              </span>
            </div>
            <Input
              id={`extra-total-${extra.id}`}
              type="text"
              value={formatCurrency(usdTotal)}
              readOnly
              className="pl-6 bg-gray-50"
            />
          </div>
          {showUsdTotal && (
            <div className="h-5">
              <p className="text-xs text-gray-500">
                {getCurrencySymbol(currency)}{formatCurrency(total)}
              </p>
            </div>
          )}
        </div>
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
