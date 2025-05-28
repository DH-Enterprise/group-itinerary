
import { Activity } from '@/types/quote';

// Calculate activity total cost considering the activity-specific traveler count
export const calculateActivityTotalCost = (activity: Activity, defaultTravelerCount: number): number => {
  const activityTravelerCount = activity.travelerCount !== undefined ? activity.travelerCount : defaultTravelerCount;
  return activity.perPerson ? activity.cost * activityTravelerCount : activity.cost;
};
