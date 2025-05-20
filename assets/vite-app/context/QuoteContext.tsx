
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Quote, PhaseStatus } from '@/types/quote';
import { emptyQuote, sampleQuote } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

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
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

interface QuoteProviderProps {
  children: ReactNode;
}

export const QuoteProvider = ({ children }: QuoteProviderProps) => {
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

  const saveQuote = () => {
    // In a real app, this would save to a database
    console.log('Saving quote:', quote);
    toast({
      title: "Quote Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const loadSampleQuote = () => {
    setQuote(sampleQuote);
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
