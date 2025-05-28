
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

const Index = () => {
  return (
    <QuoteProvider>
      <MainLayout>
        <QuoteContent />
      </MainLayout>
    </QuoteProvider>
  );
};

export default Index;
