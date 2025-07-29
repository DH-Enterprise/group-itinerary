
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Map, Plus, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, City, Quote } from '@/types/quote';
import { formatCurrency } from '@/utils/quoteUtils';
import DailyActivitiesTab from './DailyActivitiesTab';
import { useQuote } from '@/context/QuoteContext';

export type ExchangeRate = {
  code: string;
  rate: number;
};

interface CityActivitiesContentProps {
  city: City;
  activities: Activity[];
  travelerCount: number;
  addActivity: (cityId: string, date?: Date) => void;
  updateActivity: (id: string, field: string, value: any) => void;
  removeActivity: (id: string) => void;
  calculateActivityTotalCost: (activity: Activity) => number;
  exchangeRates: ExchangeRate[];
  quote: Quote;
}

// Helper function to calculate total cost of activities
const calculateTotalActivitiesCost = (
  activities: Activity[], 
  quote: Quote, 
  defaultTravelerCount: number
): number => {
  return activities.reduce((sum, activity) => {
    const baseCost = activity.costUSD || 0;
    if (!activity.perPerson) return sum + baseCost;
    
    if (quote.groupType === 'known') {
      const count = activity.travelerCount !== undefined ? activity.travelerCount : defaultTravelerCount;
      return sum + (baseCost * count);
    } else {
      // For speculative groups, use the minimum of the selected ranges
      const selectedRange = quote.groupRanges.find(range => range.selected);
      return sum + (selectedRange ? baseCost * selectedRange.min : baseCost);
    }
  }, 0);
};

const CityActivitiesContent = ({ 
  city, 
  activities, 
  travelerCount, 
  addActivity, 
  updateActivity, 
  removeActivity,
  calculateActivityTotalCost,
  exchangeRates,
  quote
}: CityActivitiesContentProps) => {
  const [activeDay, setActiveDay] = useState<string>('all');

  // Filter activities for this city
  const cityActivities = activities.filter(activity => activity.city === city.id);
  
  // Get activities for a specific day
  const getActivitiesForDay = (dateString: string) => {
    if (dateString === 'all') {
      return cityActivities;
    }
    
    const targetDate = new Date(dateString);
    return cityActivities.filter(activity => 
      activity.date.toDateString() === targetDate.toDateString()
    );
  };

  // Generate array of dates for this city's stay
  const getDatesForCity = () => {
    const dates = [];
    const currentDate = new Date(city.checkIn);
    const endDate = new Date(city.checkOut);
    
    while (currentDate < endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const dates = getDatesForCity();

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{city.name}, {city.country}</h3>
            <p className="text-sm text-gray-500">
              {cityActivities.length} activities (${formatCurrency(
                calculateTotalActivitiesCost(cityActivities, quote, travelerCount)
              )})
            </p>
          </div>
          <Button onClick={() => addActivity(city.id)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        onValueChange={setActiveDay}
        className="w-full"
      >
        <TabsList className="mb-4 flex overflow-x-auto pb-2 scrollbar-hide">
          <TabsTrigger value="all" className="px-3 py-1">
            All Days
          </TabsTrigger>
          {dates.map(date => (
            <TabsTrigger 
              key={date.toISOString()} 
              value={date.toISOString()}
              className="px-3 py-1 whitespace-nowrap"
            >
              <CalendarDays className="h-3 w-3 mr-1" />
              {format(date, 'MMM d')}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="pt-2">
          <DailyActivitiesTab
            cityId={city.id}
            activities={cityActivities}
            addActivity={addActivity}
            updateActivity={updateActivity}
            removeActivity={removeActivity}
            travelerCount={travelerCount}
            isAllDaysView={true}
            exchangeRates={exchangeRates}
          />
        </TabsContent>
        
        {dates.map(date => (
          <TabsContent key={date.toISOString()} value={date.toISOString()}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</h4>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addActivity(city.id, date)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Activity for this Day
              </Button>
            </div>
            
            <DailyActivitiesTab
              date={date}
              cityId={city.id}
              activities={getActivitiesForDay(date.toISOString())}
              addActivity={addActivity}
              updateActivity={updateActivity}
              removeActivity={removeActivity}
              travelerCount={travelerCount}
              exchangeRates={exchangeRates}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CityActivitiesContent;
