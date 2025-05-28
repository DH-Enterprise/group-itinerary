
import React from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format, isSameDay } from 'date-fns';
import { Edit, Hotel, MapPin, Bus, CircleDollarSign } from 'lucide-react';
import { generateUniqueId } from '@/utils/quoteUtils';

const DailyItineraryContent = () => {
  const { quote, setQuote } = useQuote();

  // Generate days for the itinerary
  const generateDays = () => {
    const days = [];
    const currentDate = new Date(quote.startDate);
    const endDate = new Date(quote.endDate);
    
    while (currentDate < endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Get activities for a specific day
  const getActivitiesForDay = (date: Date) => {
    return quote.activities.filter(activity => 
      isSameDay(new Date(activity.date), date)
    );
  };

  // Get transportation for a specific day
  const getTransportationForDay = (date: Date) => {
    return quote.transportation.filter(transport => 
      isSameDay(new Date(transport.date), date)
    );
  };

  // Get hotels for a specific day (check if the day is between check-in and check-out)
  const getHotelsForDay = (date: Date) => {
    const cityIds = quote.cities.filter(city => 
      date >= new Date(city.checkIn) && date < new Date(city.checkOut)
    ).map(city => city.id);
    
    return quote.hotels.filter(hotel => 
      cityIds.includes(hotel.city) && hotel.isPrimary
    );
  };

  // Get city for a specific day
  const getCityForDay = (date: Date) => {
    return quote.cities.find(city => 
      date >= new Date(city.checkIn) && date < new Date(city.checkOut)
    );
  };

  // Get existing itinerary day or create a new one
  const getOrCreateItineraryDay = (date: Date) => {
    const existingDay = quote.itinerary.find(day => 
      isSameDay(new Date(day.date), date)
    );
    
    if (existingDay) {
      return existingDay;
    }
    
    // Create a new day with activities IDs
    const activities = getActivitiesForDay(date).map(a => a.id);
    
    return {
      id: generateUniqueId(),
      date,
      description: '',
      activities
    };
  };

  // Update itinerary day
  const updateItineraryDay = (dayId: string, field: string, value: any) => {
    const existingIndex = quote.itinerary.findIndex(day => day.id === dayId);
    
    if (existingIndex >= 0) {
      // Update existing day
      setQuote(prev => ({
        ...prev,
        itinerary: prev.itinerary.map(day => 
          day.id === dayId ? { ...day, [field]: value } : day
        )
      }));
    } else {
      // Add new day
      setQuote(prev => ({
        ...prev,
        itinerary: [...prev.itinerary, { id: dayId, date: new Date(), description: '', activities: [], [field]: value }]
      }));
    }
  };

  const days = generateDays();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Itinerary</CardTitle>
        <CardDescription>Create descriptions for each day of the trip.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {days.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-10 text-center">
            <p className="text-gray-500">Please set the trip dates in the Trip Details phase to generate the itinerary days.</p>
          </div>
        ) : (
          days.map((day, index) => {
            const activities = getActivitiesForDay(day);
            const transportation = getTransportationForDay(day);
            const hotels = getHotelsForDay(day);
            const city = getCityForDay(day);
            const itineraryDay = getOrCreateItineraryDay(day);
            
            return (
              <Card key={day.toISOString()} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Day {index + 1}: {format(day, 'EEEE, MMMM d, yyyy')}</span>
                    {city && (
                      <div className="flex items-center text-sm font-normal bg-gray-100 px-2 py-1 rounded-md">
                        <MapPin className="h-3 w-3 mr-1" />
                        {city.name}, {city.country}
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`day-description-${itineraryDay.id}`} className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Day Description
                      </Label>
                      <Textarea
                        id={`day-description-${itineraryDay.id}`}
                        value={itineraryDay.description}
                        onChange={(e) => updateItineraryDay(itineraryDay.id, 'description', e.target.value)}
                        placeholder={`Describe the activities and events for Day ${index + 1}...`}
                        rows={3}
                      />
                    </div>
                    
                    {/* Show hotels, activities, transportation for the day */}
                    <div className="space-y-3 pt-2">
                      {hotels.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium flex items-center mb-1 text-travel-blue">
                            <Hotel className="h-4 w-4 mr-1" />
                            Accommodation:
                          </div>
                          <ul className="list-disc pl-6 space-y-1">
                            {hotels.map(hotel => (
                              <li key={hotel.id}>{hotel.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {activities.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium flex items-center mb-1 text-travel-orange">
                            <CircleDollarSign className="h-4 w-4 mr-1" />
                            Activities:
                          </div>
                          <ul className="list-disc pl-6 space-y-1">
                            {activities.map(activity => (
                              <li key={activity.id}>{activity.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {transportation.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium flex items-center mb-1 text-travel-green">
                            <Bus className="h-4 w-4 mr-1" />
                            Transportation:
                          </div>
                          <ul className="list-disc pl-6 space-y-1">
                            {transportation.map(transport => (
                              <li key={transport.id}>
                                {transport.type}: {transport.from} to {transport.to}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default DailyItineraryContent;
