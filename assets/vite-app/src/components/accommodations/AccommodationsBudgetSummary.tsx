
import React from 'react';
import { formatCurrency } from '@/utils/quoteUtils';
import { Quote } from '@/types/quote';

interface AccommodationsBudgetSummaryProps {
  totalAccommodationCost: number;
  remainingBudget: number;
  quote: Quote;
}

const AccommodationsBudgetSummary = ({ 
  totalAccommodationCost, 
  remainingBudget,
  quote,
}: AccommodationsBudgetSummaryProps) => {
  if (quote.groupType === 'speculative') {
    return (
      <div className="text-right">
        <p className="text-sm text-gray-500">Total Budget</p>
        <p className="text-xl font-bold text-travel-blue-dark">
          {formatCurrency(quote.budget)}
        </p>
      </div>
    );
  }

  return (
    <div className="text-right space-y-1">
      <div>
        <p className="text-sm text-gray-500">Total Accommodation Cost</p>
        <p className="text-xl font-bold text-travel-blue-dark">{formatCurrency(totalAccommodationCost)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Client's Remaining Budget</p>
        <p className={`text-xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {formatCurrency(remainingBudget)}
        </p>
      </div>
    </div>
  );
};

export default AccommodationsBudgetSummary;
