
import React, { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Button } from '@/components/ui/button';
import { PhaseStatus } from '@/types/quote';
import { CalendarDays, FileText, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyItineraryContent from './itinerary/DailyItineraryContent';
import InclusionsExclusionsContent from './itinerary/InclusionsExclusionsContent';
import TermsContent from './itinerary/TermsContent';

const ItineraryPhase = () => {
  const { setPhaseStatus, setCurrentPhase } = useQuote();
  const [activeTab, setActiveTab] = useState<string>('itinerary');

  const handleContinue = () => {
    // Update phase status
    setPhaseStatus('itinerary', PhaseStatus.COMPLETED);
    setPhaseStatus('finalization', PhaseStatus.ACTIVE);
    
    // Move to next phase
    setCurrentPhase('finalization');
  };

  const handleBack = () => {
    setCurrentPhase('transportation');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-travel-blue-dark">Itinerary Builder</h2>
      </div>
      <p className="text-gray-600">Create the daily itinerary and add important terms and information.</p>
      
      <Tabs 
        defaultValue="itinerary" 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="itinerary" className="flex gap-2">
            <CalendarDays className="h-4 w-4" />
            Daily Itinerary
          </TabsTrigger>
          <TabsTrigger value="inclusions" className="flex gap-2">
            <Plus className="h-4 w-4" />
            Inclusions & Exclusions
          </TabsTrigger>
          <TabsTrigger value="terms" className="flex gap-2">
            <FileText className="h-4 w-4" />
            Terms & Conditions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary" className="space-y-4 pt-4">
          <DailyItineraryContent />
        </TabsContent>
        
        <TabsContent value="inclusions" className="space-y-4 pt-4">
          <InclusionsExclusionsContent />
        </TabsContent>
        
        <TabsContent value="terms" className="space-y-4 pt-4">
          <TermsContent />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back to Transportation
        </Button>
        <Button onClick={handleContinue}>
          Continue to Finalization
        </Button>
      </div>
    </div>
  );
};

export default ItineraryPhase;
