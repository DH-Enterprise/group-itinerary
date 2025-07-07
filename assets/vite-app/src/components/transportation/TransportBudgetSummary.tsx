
import React from 'react';
import { formatCurrency, calculateTotalAccommodationCost, calculateTotalActivityCost, calculateTotalTransportationCost } from '@/utils/quoteUtils';
import { Quote } from '@/types/quote';

interface TransportBudgetSummaryProps {
  quote: Quote;
}

const TransportBudgetSummary: React.FC<TransportBudgetSummaryProps> = ({ quote }) => {
  const accommodationCost = calculateTotalAccommodationCost(quote.hotels);
  const activityCost = calculateTotalActivityCost(quote.activities);
  const transportationCost = calculateTotalTransportationCost(quote.transportation);
  const totalCost = accommodationCost + activityCost + transportationCost;
  const remainingBudget = quote.budget - totalCost;

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
        <p className="text-sm text-gray-500">Total Transportation Cost</p>
        <p className="text-xl font-bold text-travel-blue-dark">{formatCurrency(transportationCost)}</p>
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

export default TransportBudgetSummary;
