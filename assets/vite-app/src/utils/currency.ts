/**
 * Calculates the cost in USD based on the original cost and exchange rate
 * @param cost - The original cost in the local currency
 * @param exchangeRate - The exchange rate to convert to USD
 * @returns The cost in USD
 */
export const calculateCostUSD = (cost: number, exchangeRate: number): number => {
  return parseFloat((cost * exchangeRate).toFixed(2));
};

/**
 * Updates the cost and costUSD fields in an activity when either changes
 * @param currentCost - The current cost in local currency
 * @param currentCostUSD - The current cost in USD
 * @param exchangeRate - The current exchange rate
 * @param field - Which field was updated ('cost' or 'costUSD')
 * @returns An object with updated cost and costUSD values
 */
export const updateActivityCosts = (
  currentCost: number,
  currentCostUSD: number,
  exchangeRate: number,
  field: 'cost' | 'costUSD' | 'exchangeRate'
): { cost: number; costUSD: number } => {
  if (field === 'cost') {
    return {
      cost: currentCost,
      costUSD: calculateCostUSD(currentCost, exchangeRate)
    };
  } else if (field === 'costUSD') {
    return {
      cost: parseFloat((currentCostUSD / (exchangeRate || 1)).toFixed(2)),
      costUSD: currentCostUSD
    };
  } else {
    // field === 'exchangeRate'
    return {
      cost: currentCost,
      costUSD: calculateCostUSD(currentCost, exchangeRate)
    };
  }
};
