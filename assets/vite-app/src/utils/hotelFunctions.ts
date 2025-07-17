
import { Hotel, RoomCategory, RoomExtra } from '@/types/quote';
import { generateUniqueId } from './quoteUtils';

export const addHotel = (cityId: string, hotels: Hotel[]): Hotel => {
  return {
    id: generateUniqueId(),
    name: '',
    city: cityId,
    isPrimary: hotels.filter(h => h.city === cityId).length === 0, // Make primary if first hotel
    roomCategories: [],
    extras: [],
    notes: ''
  };
};

export const updateHotel = (hotels: Hotel[], hotelId: string, field: string, value: any): Hotel[] => {
  return hotels.map(hotel =>
    hotel.id === hotelId ? { ...hotel, [field]: value } : hotel
  );
};

export const removeHotel = (hotels: Hotel[], hotelId: string): Hotel[] => {
  return hotels.filter(hotel => hotel.id !== hotelId);
};

export const togglePrimaryHotel = (hotels: Hotel[], hotelId: string, cityId: string): Hotel[] => {
  return hotels.map(hotel => {
    if (hotel.city === cityId) {
      // If this is the hotel to make primary, set to true; otherwise set to false
      return { ...hotel, isPrimary: hotel.id === hotelId };
    }
    return hotel;
  });
};

export const addRoomCategory = (hotels: Hotel[], hotelId: string): Hotel[] => {
  const defaultRoomName = 'Standard';
  const newCategory: RoomCategory = {
    id: generateUniqueId(),
    name: defaultRoomName,
    type: 'Double', // Default type
    category: defaultRoomName, // Initialize category with the same value as name
    rate: 0,
    quantity: 1
  };

  return hotels.map(hotel =>
    hotel.id === hotelId
      ? { ...hotel, roomCategories: [...hotel.roomCategories, newCategory] }
      : hotel
  );
};

export const updateRoomCategory = (
  hotels: Hotel[], 
  hotelId: string, 
  categoryId: string, 
  field: string, 
  value: any
): Hotel[] => {
  return hotels.map(hotel =>
    hotel.id === hotelId
      ? {
          ...hotel,
          roomCategories: hotel.roomCategories.map(category =>
            category.id === categoryId
              ? { 
                  ...category, 
                  // When updating the name, also update the category field if it's empty
                  ...(field === 'name' && !category.category ? { category: value } : {}),
                  // When updating the category, also update the type if it's empty
                  ...(field === 'category' && !category.type ? { type: value.toLowerCase() } : {}),
                  [field]: field === 'rate' || field === 'quantity' ? Number(value) : value 
                }
              : category
          )
        }
      : hotel
  );
};

export const removeRoomCategory = (hotels: Hotel[], hotelId: string, categoryId: string): Hotel[] => {
  return hotels.map(hotel =>
    hotel.id === hotelId
      ? {
          ...hotel,
          roomCategories: hotel.roomCategories.filter(
            category => category.id !== categoryId
          )
        }
      : hotel
  );
};

export const addRoomExtra = (hotels: Hotel[], hotelId: string, cities: any[] = []): Hotel[] => {
  // Find the hotel
  const hotel = hotels.find(h => h.id === hotelId);
  let nights = 1;
  
  // If hotel and cities are available, calculate the number of nights
  if (hotel && cities.length > 0) {
    const city = cities.find(c => c.id === hotel.city);
    if (city && city.checkIn && city.checkOut) {
      const checkIn = new Date(city.checkIn);
      const checkOut = new Date(city.checkOut);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }
  
  const newExtra: RoomExtra = {
    id: generateUniqueId(),
    name: '',
    rate: 0,
    quantity: 1,
    nights: nights
  };

  return hotels.map(hotel =>
    hotel.id === hotelId
      ? { ...hotel, extras: [...hotel.extras, newExtra] }
      : hotel
  );
};

export const updateRoomExtra = (
  hotels: Hotel[], 
  hotelId: string, 
  extraId: string, 
  field: string, 
  value: any
): Hotel[] => {
  return hotels.map(hotel =>
    hotel.id === hotelId
      ? {
          ...hotel,
          extras: hotel.extras.map(extra =>
            extra.id === extraId
              ? { ...extra, [field]: field === 'rate' || field === 'quantity' ? Number(value) : value }
              : extra
          )
        }
      : hotel
  );
};

export const removeRoomExtra = (hotels: Hotel[], hotelId: string, extraId: string): Hotel[] => {
  return hotels.map(hotel =>
    hotel.id === hotelId
      ? {
          ...hotel,
          extras: hotel.extras.filter(extra => extra.id !== extraId)
        }
      : hotel
  );
};

export const calculateHotelCost = (hotel: Hotel): number => {
  if (!hotel) return 0;

  const roomCost = hotel.roomCategories.reduce(
    (sum, category) => sum + category.rate * category.quantity,
    0
  );

  const extrasCost = hotel.extras.reduce(
    (sum, extra) => sum + extra.rate * extra.quantity,
    0
  );

  return roomCost + extrasCost;
};
