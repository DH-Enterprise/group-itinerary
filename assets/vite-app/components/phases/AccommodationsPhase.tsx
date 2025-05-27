
import React, { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { PhaseStatus, Hotel } from '@/types/quote';
import {
  calculateTotalAccommodationCost,
  calculateTotalActivityCost,
  calculateTotalTransportationCost
} from '@/utils/quoteUtils';
import AccommodationsBudgetSummary from '../accommodations/AccommodationsBudgetSummary';
import EmptyAccommodationsState from '../accommodations/EmptyAccommodationsState';
import AccommodationCityTabs from '../accommodations/AccommodationCityTabs';
import AccommodationNavigation from '../accommodations/AccommodationNavigation';
import * as hotelFunctions from '@/utils/hotelFunctions';

const AccommodationsPhase = () => {
  const { quote, setQuote, setPhaseStatus, setCurrentPhase } = useQuote();
  
  // Sort cities by check-in date before displaying them
  const sortedCities = [...quote.cities].sort((a, b) => {
    return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
  });
  
  const [activeCity, setActiveCity] = useState<string>(sortedCities.length > 0 ? sortedCities[0].id : '');

  const totalAccommodationCost = calculateTotalAccommodationCost(quote.hotels);
  const activityCost = calculateTotalActivityCost(quote.activities);
  const transportationCost = calculateTotalTransportationCost(quote.transportation);
  const totalCost = totalAccommodationCost + activityCost + transportationCost;
  const remainingBudget = quote.budget - totalCost;

  const handleBack = () => {
    setCurrentPhase('initialization');
  };

  const handleContinue = () => {
    // Update phase status
    setPhaseStatus('accommodations', PhaseStatus.COMPLETED);
    setPhaseStatus('activities', PhaseStatus.ACTIVE);
    
    // Move to next phase
    setCurrentPhase('activities');
  };

  const getHotelsForCity = (cityId: string): Hotel[] => {
    return quote.hotels.filter(hotel => hotel.city === cityId);
  };

  // Hotel management functions
  const handleAddHotel = (cityId: string) => {
    const newHotel = hotelFunctions.addHotel(cityId, quote.hotels);
    setQuote(prev => ({
      ...prev,
      hotels: [...prev.hotels, newHotel]
    }));
  };

  const handleUpdateHotel = (hotelId: string, field: string, value: any) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.updateHotel(prev.hotels, hotelId, field, value)
    }));
  };

  const handleRemoveHotel = (hotelId: string) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.removeHotel(prev.hotels, hotelId)
    }));
  };

  const handleTogglePrimaryHotel = (hotelId: string, cityId: string) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.togglePrimaryHotel(prev.hotels, hotelId, cityId)
    }));
  };

  const handleAddRoomCategory = (hotelId: string) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.addRoomCategory(prev.hotels, hotelId)
    }));
  };

  const handleUpdateRoomCategory = (hotelId: string, categoryId: string, field: string, value: any) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.updateRoomCategory(prev.hotels, hotelId, categoryId, field, value)
    }));
  };

  const handleRemoveRoomCategory = (hotelId: string, categoryId: string) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.removeRoomCategory(prev.hotels, hotelId, categoryId)
    }));
  };

  const handleAddRoomExtra = (hotelId: string) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.addRoomExtra(prev.hotels, hotelId)
    }));
  };

  const handleUpdateRoomExtra = (hotelId: string, extraId: string, field: string, value: any) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.updateRoomExtra(prev.hotels, hotelId, extraId, field, value)
    }));
  };

  const handleRemoveRoomExtra = (hotelId: string, extraId: string) => {
    setQuote(prev => ({
      ...prev,
      hotels: hotelFunctions.removeRoomExtra(prev.hotels, hotelId, extraId)
    }));
  };

  const calculateHotelCostById = (hotelId: string): number => {
    const hotel = quote.hotels.find(h => h.id === hotelId);
    return hotel ? hotelFunctions.calculateHotelCost(hotel) : 0;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-travel-blue-dark">Accommodations</h2>
        <AccommodationsBudgetSummary 
          totalAccommodationCost={totalAccommodationCost}
          remainingBudget={remainingBudget}
        />
      </div>
      <p className="text-gray-600">Select and configure accommodations for each city in the itinerary.</p>
      
      {sortedCities.length === 0 ? (
        <EmptyAccommodationsState onBack={handleBack} />
      ) : (
        <div>
          <AccommodationCityTabs
            cities={sortedCities}
            activeCity={activeCity}
            setActiveCity={setActiveCity}
            getHotelsForCity={getHotelsForCity}
            onAddHotel={handleAddHotel}
            onUpdateHotel={handleUpdateHotel}
            onRemoveHotel={handleRemoveHotel}
            onTogglePrimaryHotel={handleTogglePrimaryHotel}
            onAddRoomCategory={handleAddRoomCategory}
            onUpdateRoomCategory={handleUpdateRoomCategory}
            onRemoveRoomCategory={handleRemoveRoomCategory}
            onAddRoomExtra={handleAddRoomExtra}
            onUpdateRoomExtra={handleUpdateRoomExtra}
            onRemoveRoomExtra={handleRemoveRoomExtra}
            calculateHotelCost={calculateHotelCostById}
            remainingBudget={remainingBudget}
            totalCost={totalCost}
          />
          
          <AccommodationNavigation 
            onBack={handleBack} 
            onContinue={handleContinue} 
          />
        </div>
      )}
    </div>
  );
};

export default AccommodationsPhase;
