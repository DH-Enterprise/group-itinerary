// Helper function to get currency symbol
export const getCurrencySymbol = (currencyCode: string) => {
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

// Format amount with currency symbol
export const formatWithCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
};
