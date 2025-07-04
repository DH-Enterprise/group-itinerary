import { useState, useEffect } from 'react';
import { Activity } from '@/types/quote';
import { updateActivityCosts } from '@/utils/currency';

/**
 * Custom hook to manage activity costs and currency conversions
 * @param initialActivity - The initial activity data
 * @returns An object containing activity state and update functions
 */
export const useActivityCosts = (initialActivity: Activity) => {
  const [activity, setActivity] = useState<Activity>(initialActivity);
  const { cost, costUSD, exchangeRate } = activity;

  // Update local state when initialActivity changes
  useEffect(() => {
    setActivity(initialActivity);
  }, [initialActivity]);

  // Update costUSD when cost or exchangeRate changes
  useEffect(() => {
    if (cost !== undefined && exchangeRate !== undefined) {
      const newCosts = updateActivityCosts(cost, costUSD, exchangeRate, 'cost');
      setActivity(prev => ({
        ...prev,
        costUSD: newCosts.costUSD
      }));
    }
  }, [cost, exchangeRate]);

  /**
   * Handle changes to cost fields
   * @param field - The field that changed ('cost' or 'costUSD' or 'exchangeRate')
   * @param value - The new value
   */
  const handleCostChange = (field: 'cost' | 'costUSD' | 'exchangeRate', value: number) => {
    const newCosts = updateActivityCosts(
      field === 'cost' ? value : cost,
      field === 'costUSD' ? value : costUSD,
      field === 'exchangeRate' ? value : (exchangeRate || 1),
      field
    );
    
    setActivity(prev => ({
      ...prev,
      cost: newCosts.cost,
      costUSD: newCosts.costUSD,
      ...(field === 'exchangeRate' ? { exchangeRate: value } : {})
    }));
  };

  /**
   * Update any field in the activity
   * @param field - The field to update
   * @param value - The new value
   */
  const updateActivity = <K extends keyof Activity>(field: K, value: Activity[K]) => {
    setActivity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    activity,
    setActivity,
    updateActivity,
    handleCostChange
  };
};
