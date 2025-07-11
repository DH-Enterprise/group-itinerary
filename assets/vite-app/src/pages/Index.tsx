
import React from 'react';
import { QuoteProvider } from '@/context/QuoteContext';
import MainLayout from '@/components/layout/MainLayout';
import InitializationPhase from '@/components/phases/InitializationPhase';
import AccommodationsPhase from '@/components/phases/AccommodationsPhase';
import ActivitiesPhase from '@/components/phases/ActivitiesPhase';
import TransportationPhase from '@/components/phases/TransportationPhase';
import ItineraryPhase from '@/components/phases/ItineraryPhase';
import FinalizationPhase from '@/components/phases/FinalizationPhase';
import { useQuote } from '@/context/QuoteContext';

type ExchangeRate = {
  code: string;
  rate: number;
};

interface IndexProps {
  exchangeRates: ExchangeRate[];
}

const QuoteContent = () => {
  const { currentPhase } = useQuote();

  // Render the appropriate component based on the current phase
  const renderPhaseComponent = () => {
    switch (currentPhase) {
      case 'initialization':
        return <InitializationPhase />;
      case 'accommodations':
        return <AccommodationsPhase />;
      case 'activities':
        return <ActivitiesPhase />;
      case 'transportation':
        return <TransportationPhase />;
      case 'itinerary':
        return <ItineraryPhase />;
      case 'finalization':
        return <FinalizationPhase />;
      default:
        return <InitializationPhase />;
    }
  };

  return (
    <div>
      {renderPhaseComponent()}
    </div>
  );
};

const Index: React.FC<IndexProps> = ({ exchangeRates }) => {
  return (
    <QuoteProvider exchangeRates={exchangeRates}>
      <MainLayout>
        <QuoteContent />
      </MainLayout>
    </QuoteProvider>
  );
};

// Default props in case they're not provided
Index.defaultProps = {
  exchangeRates: [
    { code: 'USD', rate: 1.0 },
    { code: 'EUR', rate: 0.85 },
    { code: 'GBP', rate: 0.75 }
  ]
};

export default Index;
