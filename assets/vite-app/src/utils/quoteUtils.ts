
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
        (sum, extra) => {
          // Calculate cost for each extra: rate * quantity * nights (default to 1 if not specified)
          const nights = extra.nights > 0 ? extra.nights : 1;
          return sum + (extra.rate * extra.quantity * nights);
        },
        0
      );
      
      // Calculate total in local currency
      const totalInLocal = roomCategoriesCost + extrasCost;
      
      // If currency is USD or no exchange rate is set, use the amount as is
      // Otherwise, multiply by exchange rate to convert to USD
      const exchangeRate = hotel.exchangeRate || 1;
      const totalInUSD = hotel.currency === 'USD' || !hotel.exchangeRate
        ? totalInLocal 
        : totalInLocal * exchangeRate;
      
      return total + totalInUSD;
    }, 0);
};

export const calculateTotalActivityCost = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => {
    // Calculate base cost (in activity's currency)
    let baseCost = activity.perPerson 
      ? activity.cost * (activity.travelerCount || 1)
      : activity.cost;
      
    // Convert to USD using the exchange rate if available, otherwise use the cost as is
    const costInUSD = activity.exchangeRate 
      ? baseCost * activity.exchangeRate 
      : baseCost;
      
    return total + costInUSD;
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

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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
