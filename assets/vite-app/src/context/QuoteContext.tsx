import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Quote, PhaseStatus } from '@/types/quote';
import { emptyQuote, sampleQuote } from '@/data/mockData';
import { formatLocalDate } from '@/utils/dateUtils';
import { toast } from '@/components/ui/use-toast';

type ExchangeRate = {
  code: string;
  rate: number;
};

interface QuoteContextType {
  quote: Quote;
  setQuote: React.Dispatch<React.SetStateAction<Quote>>;
  phaseStatuses: Record<string, PhaseStatus>;
  setPhaseStatus: (phase: string, status: PhaseStatus) => void;
  currentPhase: string;
  setCurrentPhase: (phase: string) => void;
  saveQuote: () => void;
  loadSampleQuote: () => void;
  createNewQuote: () => void;
  exchangeRates: ExchangeRate[];
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

interface QuoteProviderProps {
  children: ReactNode;
  exchangeRates?: ExchangeRate[];
}

// Get exchange rates from window.exchangeRates or use default values
const getExchangeRates = (): ExchangeRate[] => {
  // Try to get rates from window.exchangeRates first
  if (typeof window !== 'undefined' && (window as any).exchangeRates) {
    return (window as any).exchangeRates;
  }
  
  // Fallback to default rates if not available
  return [
    { code: 'USD', rate: 1.0 },
    { code: 'EUR', rate: 0.85 },
    { code: 'GBP', rate: 0.75 }
  ];
};

export const QuoteProvider = ({ children, exchangeRates = getExchangeRates() }: QuoteProviderProps) => {
  const [quote, setQuote] = useState<Quote>(emptyQuote);
  const [currentPhase, setCurrentPhase] = useState<string>('initialization');
  const [phaseStatuses, setPhaseStatuses] = useState<Record<string, PhaseStatus>>({
    initialization: PhaseStatus.ACTIVE,
    accommodations: PhaseStatus.PENDING,
    activities: PhaseStatus.PENDING,
    transportation: PhaseStatus.PENDING,
    itinerary: PhaseStatus.PENDING,
    finalization: PhaseStatus.PENDING,
  });

  const setPhaseStatus = (phase: string, status: PhaseStatus) => {
    setPhaseStatuses(prev => ({
      ...prev,
      [phase]: status,
    }));
  };

  const saveQuote = async () => {
    try {
      // Format city dates as Y-m-d strings in local timezone
      const formattedCities = quote.cities.map(city => ({
        ...city,
        checkIn: city.checkIn ? formatLocalDate(city.checkIn) : city.checkIn,
        checkOut: city.checkOut ? formatLocalDate(city.checkOut) : city.checkOut,
      }));

      // Transform activities to use cityName instead of city, format date as Y-m-d, and costUSD to costUsd
      const transformedActivities = quote.activities.map(activity => {
        const city = quote.cities.find(c => c.id === activity.city);
        const date = activity.date ? new Date(activity.date) : null;
        return {
          ...activity,
          cityName: city ? city.name : activity.city,
          dateString: date ? formatLocalDate(date) : '',
          costUsd: activity.costUSD,
        };
      });

      // Transform transportation dates to Y-m-d strings in local timezone
      const transformedTransportation = quote.transportation.map(transport => ({
        ...transport,
        date: transport.date ? formatLocalDate(transport.date) : transport.date,
      }));

      // Transform hotels to include rateUsd for room categories and extras
      const transformedHotels = quote.hotels.map(hotel => {
        const city = quote.cities.find(c => c.id === hotel.city);
        const exchangeRate = hotel.exchangeRate || 1;
        
        // Transform room categories to include rateUsd
        const transformedRoomCategories = hotel.roomCategories.map(room => ({
          ...room,
          rateUsd: room.rate * exchangeRate,
        }));
        
        // Transform extras to include rateUsd
        const transformedExtras = hotel.extras.map(extra => ({
          ...extra,
          rateUsd: extra.rate * exchangeRate,
        }));
        
        return {
          ...hotel,
          cityName: city ? city.name : hotel.city,
          roomCategories: transformedRoomCategories,
          extras: transformedExtras,
        };
      });

      // Format startDate and endDate as Y-m-d strings in local timezone
      const formattedStartDate = quote.startDate ? formatLocalDate(quote.startDate) : '';
      const formattedEndDate = quote.endDate ? formatLocalDate(quote.endDate) : '';

      // Create payload with all formatted dates
      const payload = {
        ...quote,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        cities: formattedCities,
        activities: transformedActivities,
        transportation: transformedTransportation,
        hotels: transformedHotels,
        agentId: quote.agentId || null,
      };

      // Debug: Log the transformed hotels to verify rateUsd is included
      console.log('Transformed Hotels:', JSON.stringify(transformedHotels, null, 2));

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save quote');
      }

      const data = await response.json();
      toast({
        title: "Quote Saved",
        description: "Your quote has been saved successfully.",
      });

      // Optionally, you could update the quote with the ID from the server
      setQuote(prev => ({
        ...prev,
        id: data.id,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive",
      });
      console.error('Error saving quote:', error);
    }
  };

  const loadSampleQuote = () => {
    // Clone the sample quote to avoid mutating the original
    const quoteWithTravelerCounts = {
      ...sampleQuote,
      activities: sampleQuote.activities.map(activity => ({
        ...activity,
        // Initialize travelerCount if it's a per-person activity and not already set
        ...(activity.perPerson && !activity.travelerCount && {
          travelerCount: sampleQuote.travelerCount || 1
        })
      }))
    };
    
    setQuote(quoteWithTravelerCounts);
    setPhaseStatuses({
      initialization: PhaseStatus.COMPLETED,
      accommodations: PhaseStatus.COMPLETED,
      activities: PhaseStatus.COMPLETED,
      transportation: PhaseStatus.COMPLETED,
      itinerary: PhaseStatus.ACTIVE,
      finalization: PhaseStatus.PENDING,
    });
    setCurrentPhase('itinerary');
    toast({
      title: "Sample Quote Loaded",
      description: "A sample quote has been loaded for demonstration.",
    });
  };

  const createNewQuote = () => {
    setQuote(emptyQuote);
    setPhaseStatuses({
      initialization: PhaseStatus.ACTIVE,
      accommodations: PhaseStatus.PENDING,
      activities: PhaseStatus.PENDING,
      transportation: PhaseStatus.PENDING,
      itinerary: PhaseStatus.PENDING,
      finalization: PhaseStatus.PENDING,
    });
    setCurrentPhase('initialization');
    toast({
      title: "New Quote Created",
      description: "You can now start building your quote.",
    });
  };

  // Update quote phase when currentPhase changes
  useEffect(() => {
    setQuote(prev => ({
      ...prev,
      phase: currentPhase as any
    }));
  }, [currentPhase]);

  return (
    <QuoteContext.Provider
      value={{
        quote,
        setQuote,
        phaseStatuses,
        setPhaseStatus,
        currentPhase,
        setCurrentPhase,
        saveQuote,
        loadSampleQuote,
        createNewQuote,
        exchangeRates,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
