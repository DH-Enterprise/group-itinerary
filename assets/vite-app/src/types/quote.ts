export interface City {
  id: string;
  name: string;
  country: string;
  checkIn: Date;
  checkOut: Date;
}

export interface RoomCategory {
  id: string;
  name: string;
  type: string;
  category?: string;
  rate: number;
  rateUsd: number;
  quantity: number;
}

export interface RoomExtra {
  id: string;
  name: string;
  rate: number;
  rateUsd: number;
  quantity: number;
  nights: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  isPrimary: boolean;
  roomCategories: RoomCategory[];
  extras: RoomExtra[];
  notes: string;
  currency: string;
  exchangeRate: number;
}

export interface Activity {
  id: string;
  name: string;
  date: Date;
  city: string;
  type: 'tour' | 'restaurant' | 'golf' | 'other';
  cost: number;
  costUSD: number; // Calculated field: cost * exchangeRate
  currency: 'EUR' | 'GBP' | 'USD';
  exchangeRate: number; // Rate to convert to USD
  perPerson: boolean;
  remarks: string;
  internalNotes?: string;
  travelerCount?: number; // New optional property
  companyName?: string;
  companyContactEmail?: string;
  companyContactPhone?: string;
  meetingAddress?: string;
  meetingTime?: string;
}

export interface CoachExtra {
  id: string;
  name: string;
  days: number;
  rate: number;
  enabled: boolean;
}

export type Currency = 'EUR' | 'GBP';

export interface CoachClass {
  id: string;
  type: 'D' | 'F' | 'G';
  maxCapacity: number;
  dailyRate: number;
  currency: Currency;
  enabled: boolean;
}

export interface AirTransportDetails {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  ticketClass: 'economy' | 'premium' | 'business' | 'first';
  ratePerPerson: number;
  groupRate?: number;
  travelerCount: number; // Add traveler count to track per-flight passengers
}

export interface Transportation {
  id: string;
  type: 'coaching' | 'air' | 'train' | 'ferry' | 'other';
  from: string;
  to: string;
  date: Date;
  cost: number;
  notes: string;
  details: string;
  coachingDetails?: {
    driverDays: number;
    selectedCurrency: Currency;
    exchangeRate: number;
    markupRate: number;
    extras: CoachExtra[];
    coachClasses: CoachClass[];
  };
  airDetails?: AirTransportDetails;
}

export interface DailyItinerary {
  id: string;
  date: Date;
  description: string;
  activities: string[]; // IDs of activities
}

export type GroupType = 'known' | 'speculative';

export interface GroupRange {
  id: string;
  label: string;
  min: number;
  max: number;
  selected: boolean;
}

export interface Quote {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  agentId?: number;
  agentName?: string;
  agencyName: string;
  groupType: GroupType;
  travelerCount: number;
  groupRanges: GroupRange[];
  budget: number;
  cities: City[];
  hotels: Hotel[];
  activities: Activity[];
  transportation: Transportation[];
  itinerary: DailyItinerary[];
  inclusions: string[];
  exclusions: string[];
  termsAndConditions: string;
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'accepted' | 'rejected';
  phase: 'initialization' | 'accommodations' | 'activities' | 'transportation' | 'itinerary' | 'finalization';
  // Exchange rates are provided by the backend via window.exchangeRates
  exchangeRates?: Array<{
    code: string;
    rate: number;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'travel_specialist' | 'quote_administrator' | 'team_manager' | 'qa_reviewer';
}

export interface QuoteHistory {
  id: string;
  quoteId: string;
  userId: string;
  timestamp: Date;
  field: string;
  oldValue: string;
  newValue: string;
  action: 'create' | 'update' | 'delete';
}

export enum PhaseStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}
