import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getCurrencySymbol } from '@/utils/currencyUtils';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  exchangeRates: Array<{ code: string; rate: number }>;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  exchangeRates,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>Currency</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {exchangeRates.map((rate) => (
            <SelectItem key={rate.code} value={rate.code}>
              {rate.code} ({getCurrencySymbol(rate.code)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
