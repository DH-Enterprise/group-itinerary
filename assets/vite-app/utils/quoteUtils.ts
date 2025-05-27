
import { City, Quote, Hotel, Activity, Transportation } from "@/types/quote";

export const calculateTripDuration = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateNightsInCity = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calculateTotalAccommodationCost = (hotels: Hotel[]): number => {
  return hotels
    .filter(hotel => hotel.isPrimary) // Only include primary hotels
    .reduce((total, hotel) => {
      const roomCategoriesCost = hotel.roomCategories.reduce(
        (sum, category) => sum + category.rate * category.quantity,
        0
      );
      
      const extrasCost = hotel.extras.reduce(
        (sum, extra) => sum + extra.rate * extra.quantity,
        0
      );
      
      return total + roomCategoriesCost + extrasCost;
    }, 0);
};

export const calculateTotalActivityCost = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => {
    if (activity.perPerson) {
      // Use activity-specific traveler count if available, otherwise use default (shouldn't happen)
      const travelerCount = activity.travelerCount !== undefined ? activity.travelerCount : 1;
      return total + activity.cost * travelerCount;
    }
    return total + activity.cost;
  }, 0);
};

export const calculateTotalTransportationCost = (transportation: Transportation[]): number => {
  return transportation.reduce((total, transport) => {
    return total + transport.cost;
  }, 0);
};

export const calculateRemainingBudget = (quote: Quote): number => {
  const accommodationCost = calculateTotalAccommodationCost(quote.hotels);
  const activityCost = calculateTotalActivityCost(quote.activities);
  const transportationCost = calculateTotalTransportationCost(quote.transportation);
  
  return quote.budget - (accommodationCost + activityCost + transportationCost);
};

export const calculatePerPersonCost = (quote: Quote): number => {
  const accommodationCost = calculateTotalAccommodationCost(quote.hotels);
  const activityCost = calculateTotalActivityCost(quote.activities);
  const transportationCost = calculateTotalTransportationCost(quote.transportation);
  
  const totalCost = accommodationCost + activityCost + transportationCost;
  
  return totalCost / quote.travelerCount;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
