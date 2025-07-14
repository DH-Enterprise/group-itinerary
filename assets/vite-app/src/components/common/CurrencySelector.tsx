import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  exchangeRates: Array<{ code: string; rate: number }>;
  className?: string;
}

// Helper function to get currency symbol
const getCurrencySymbol = (currencyCode: string) => {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'CNY': '¥',
    'INR': '₹',
    'BRL': 'R$',
    'MXN': 'MX$',
    'KRW': '₩',
    'RUB': '₽',
    'TRY': '₺',
    'IDR': 'Rp',
    'THB': '฿',
    'VND': '₫',
    'MYR': 'RM',
    'SGD': 'S$',
    'NZD': 'NZ$',
    'PHP': '₱',
    'HKD': 'HK$',
    'SEK': 'kr',
    'CHF': 'CHF',
    'NOK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'HUF': 'Ft',
    'CZK': 'Kč',
    'ILS': '₪'
  };
  return symbols[currencyCode] || currencyCode;
};

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
