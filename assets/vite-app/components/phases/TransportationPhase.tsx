
import React, { useEffect } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { generateUniqueId } from '@/utils/quoteUtils';
import { PhaseStatus } from '@/types/quote';
import TransportBudgetSummary from '../transportation/TransportBudgetSummary';
import TransportTabs from '../transportation/TransportTabs';
import TransportNavigation from '../transportation/TransportNavigation';

const TransportationPhase = () => {
  const { quote, setQuote, setPhaseStatus, setCurrentPhase } = useQuote();

  const handleContinue = () => {
    setPhaseStatus('transportation', PhaseStatus.COMPLETED);
    setPhaseStatus('itinerary', PhaseStatus.ACTIVE);
    setCurrentPhase('itinerary');
  };

  const handleBack = () => {
    setCurrentPhase('activities');
  };

  const addTransportation = (type: 'coaching' | 'air' | 'train' | 'ferry' | 'other') => {
    const newId = generateUniqueId();
    
    // Create base transportation object
    const newTransportation = {
      id: newId,
      type,
      from: '',
      to: '',
      date: new Date(),
      cost: 0,
      notes: '',
      details: ''
    };

    // Add specific details based on transportation type
    if (type === 'air') {
      newTransportation['airDetails'] = {
        airline: '',
        flightNumber: '',
        departureTime: '',
        arrivalTime: '',
        ticketClass: 'economy',
        ratePerPerson: 0,
        travelerCount: quote.travelerCount
      };
    }
    
    setQuote(prev => ({
      ...prev,
      transportation: [...prev.transportation, newTransportation]
    }));
  };

  const updateTransportation = (id: string, field: string, value: any) => {
    setQuote(prev => ({
      ...prev,
      transportation: prev.transportation.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeTransportation = (id: string) => {
    setQuote(prev => ({
      ...prev,
      transportation: prev.transportation.filter(item => item.id !== id)
    }));
  };

  // Listen for cost updates from the CoachSummarySection
  useEffect(() => {
    const handleCostUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.id) {
        updateTransportation(
          customEvent.detail.id, 
          'cost', 
          customEvent.detail.cost
        );
      }
    };

    document.addEventListener('update-transport-cost', handleCostUpdate);

    return () => {
      document.removeEventListener('update-transport-cost', handleCostUpdate);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-travel-blue-dark">Transportation</h2>
        <TransportBudgetSummary quote={quote} />
      </div>
      <p className="text-gray-600">Add air and ground transportation details for the group's journey.</p>
      
      <div className="bg-white rounded-lg shadow">
        <TransportTabs 
          quote={quote.transportation}
          updateTransport={updateTransportation}
          removeTransport={removeTransportation}
          onAddTransport={addTransportation}
          defaultTravelerCount={quote.travelerCount}
        />
      </div>
      
      <TransportNavigation 
        onBack={handleBack}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default TransportationPhase;
