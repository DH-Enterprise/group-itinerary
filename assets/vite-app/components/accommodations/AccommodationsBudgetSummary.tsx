
import React from 'react';
import { formatCurrency } from '@/utils/quoteUtils';

interface AccommodationsBudgetSummaryProps {
  totalAccommodationCost: number;
  remainingBudget: number;
}

const AccommodationsBudgetSummary = ({ 
  totalAccommodationCost, 
  remainingBudget 
}: AccommodationsBudgetSummaryProps) => {
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
