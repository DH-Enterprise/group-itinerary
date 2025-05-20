
import React, { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PhaseStatus } from '@/types/quote';
import { 
  calculateTotalActivityCost, 
  calculateTotalAccommodationCost, 
  calculateTotalTransportationCost, 
  formatCurrency,
  generateUniqueId 
} from '@/utils/quoteUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map } from 'lucide-react';
import { calculateActivityTotalCost } from '@/components/activities/ActivityUtils';
import CityActivitiesContent from '@/components/activities/CityActivitiesContent';

const ActivitiesPhase = () => {
  const { quote, setQuote, setPhaseStatus, setCurrentPhase } = useQuote();
  const [activeCity, setActiveCity] = useState<string>(quote.cities.length > 0 ? quote.cities[0].id : '');

  // Calculate total costs for all phases
  const accommodationCost = calculateTotalAccommodationCost(quote.hotels);
  const activityCost = calculateTotalActivityCost(quote.activities);
  const transportationCost = calculateTotalTransportationCost(quote.transportation);
  const totalCost = accommodationCost + activityCost + transportationCost;
  const remainingBudget = quote.budget - totalCost;

  const handleContinue = () => {
    // Update phase status
    setPhaseStatus('activities', PhaseStatus.COMPLETED);
    setPhaseStatus('transportation', PhaseStatus.ACTIVE);
    
    // Move to next phase
    setCurrentPhase('transportation');
  };

  const handleBack = () => {
    setCurrentPhase('accommodations');
  };

  const addActivity = (cityId: string, date?: Date) => {
    const newId = generateUniqueId();
    const activityDate = date || getCityById(cityId)?.checkIn || new Date();
    
    const newActivity = {
      id: newId,
      name: '',
      date: activityDate,
      city: cityId,
      type: 'tour' as const,
      cost: 0,
      perPerson: true,
      notes: '',
      travelerCount: quote.travelerCount // Default to quote's traveler count
    };
    
    setQuote(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
  };

  const updateActivity = (activityId: string, field: string, value: any) => {
    setQuote(prev => ({
      ...prev,
      activities: prev.activities.map(activity => 
        activity.id === activityId ? { ...activity, [field]: value } : activity
      )
    }));
  };

  const removeActivity = (activityId: string) => {
    setQuote(prev => ({
      ...prev,
      activities: prev.activities.filter(activity => activity.id !== activityId)
    }));
  };

  const getCityById = (cityId: string) => {
    return quote.cities.find(city => city.id === cityId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-travel-blue-dark">Activities & Tours</h2>
        <div className="text-right space-y-1">
          <div>
            <p className="text-sm text-gray-500">Total Activity Cost</p>
            <p className="text-xl font-bold text-travel-blue-dark">{formatCurrency(activityCost)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Client's Remaining Budget</p>
            <p className={`text-xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600">Add activities, tours, and dining experiences to each day of the itinerary.</p>
      
      {quote.cities.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500">You need to add cities in the Trip Details phase before adding activities.</p>
            <Button className="mt-4" onClick={() => setCurrentPhase('initialization')}>
              Go to Trip Details
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow">
            <Tabs 
              defaultValue={activeCity || quote.cities[0]?.id} 
              onValueChange={setActiveCity}
              className="w-full"
            >
              <div className="border-b px-6 py-2">
                <TabsList className="grid grid-flow-col auto-cols-max gap-4">
                  {quote.cities.map(city => (
                    <TabsTrigger key={city.id} value={city.id} className="px-4 py-2">
                      <span className="flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        {city.name}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {quote.cities.map(city => (
                <TabsContent key={city.id} value={city.id}>
                  <CityActivitiesContent 
                    city={city}
                    activities={quote.activities}
                    travelerCount={quote.travelerCount}
                    addActivity={addActivity}
                    updateActivity={updateActivity}
                    removeActivity={removeActivity}
                    calculateActivityTotalCost={(activity) => 
                      calculateActivityTotalCost(activity, quote.travelerCount)
                    }
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back to Accommodations
            </Button>
            <Button onClick={handleContinue}>
              Continue to Transportation
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivitiesPhase;
