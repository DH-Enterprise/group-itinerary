import { RoomCategory } from '@/types/quote';

// Map room type names to person counts
const ROOM_TYPE_PERSON_COUNT: Record<string, number> = {
  'single': 1,
  'double': 2,
  'twin': 2,
  'triple': 3,
  'quad': 4,
  'king': 2,
  'queen': 2,
  'standard': 2,
  'deluxe': 2,
  'suite': 2
};

// Calculate person count from room type name
export const getPersonCount = (roomType: string): number => {
  if (!roomType) return 0;
  const lowerType = roomType.toLowerCase();
  
  // First try exact matches
  for (const [key, count] of Object.entries(ROOM_TYPE_PERSON_COUNT)) {
    if (lowerType === key || lowerType === `${key} room`) {
      return count;
    }
  }
  
  // Then try partial matches
  for (const [key, count] of Object.entries(ROOM_TYPE_PERSON_COUNT)) {
    if (lowerType.includes(key)) {
      return count;
    }
  }
  
  // Try to extract number from parentheses if present (e.g., "Double Room (2 people)")
  const match = lowerType.match(/\((\d+)\s*(?:person|people)\)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  // Default to 2 if no match found
  return 2;
};

// Calculate total capacity of all room categories
export const calculateTotalRoomCapacity = (roomCategories: RoomCategory[]): number => {
  return roomCategories.reduce((total, category) => {
    const personCount = getPersonCount(category.name);
    return total + (personCount * (category.quantity || 0));
  }, 0);
};
