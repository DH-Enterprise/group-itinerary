import React, { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { GroupType } from '@/types/quote';
import { PhaseStatus } from '@/types/quote';
import { generateUniqueId } from '@/utils/quoteUtils';
import { toast } from '@/hooks/use-toast';
import DateRangeSelector from './initialization/DateRangeSelector';
import BasicInformation from './initialization/BasicInformation';
import CityList from './initialization/CityList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface BasicInformationProps {
  quote: Quote;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGroupRangeToggle: (id: string, checked: boolean) => void;
  showValidation?: boolean;
}

const InitializationPhase = () => {
  const { quote, setQuote, setPhaseStatus, setCurrentPhase } = useQuote();
  const [showValidation, setShowValidation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date) => {
    setQuote(prev => {
      const newQuote = {
        ...prev,
        [field]: date
      };

      if (field === 'startDate' && date > prev.endDate) {
        newQuote.endDate = date;
      }
      if (field === 'endDate' && date < prev.startDate) {
        newQuote.startDate = date;
      }

      return newQuote;
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const addCity = () => {
    const newId = generateUniqueId();
    const newCity = {
      id: newId,
      name: '',
      country: '',
      checkIn: quote.startDate,
      checkOut: quote.endDate
    };
    
    setQuote(prev => ({
      ...prev,
      cities: [...prev.cities, newCity]
    }));
  };

  const updateCity = (id: string, field: string, value: any) => {
    if (field === 'checkIn' || field === 'checkOut') {
      const date = new Date(value);
      if (date < quote.startDate || date > quote.endDate) {
        toast({
          title: "Invalid Date Selection",
          description: "City dates must be within the trip date range.",
          variant: "destructive"
        });
        return;
      }
    }

    setQuote(prev => ({
      ...prev,
      cities: prev.cities.map(city => 
        city.id === id ? { ...city, [field]: value } : city
      )
    }));
  };

  const removeCity = (id: string) => {
    setQuote(prev => ({
      ...prev,
      cities: prev.cities.filter(city => city.id !== id)
    }));
  };

  const handleGroupTypeChange = (value: string) => {
    setQuote(prev => ({
      ...prev,
      groupType: value as 'known' | 'speculative'
    }));
  };

  const handleGroupRangeToggle = (id: string, checked: boolean) => {
    setQuote(prev => ({
      ...prev,
      groupRanges: prev.groupRanges?.map(range => 
        range.id === id ? { ...range, selected: checked } : range
      ) || []
    }));
  };

  const validateForm = () => {
    if (!quote.agencyName || !quote.agentName || !quote.startDate || !quote.endDate) {
      return false;
    }
    
    if (!quote.travelerCount || quote.travelerCount < 10) {
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      setShowValidation(true);
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setPhaseStatus('initialization', PhaseStatus.COMPLETED);
    setPhaseStatus('accommodations', PhaseStatus.ACTIVE);
    setCurrentPhase('accommodations');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-travel-blue-dark">Trip Details</h2>
      <p className="text-gray-600">Start by entering the basic information about this group quote.</p>
      
      {showValidation && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please complete all required fields marked with an asterisk (*) before continuing.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the core details about this quote</CardDescription>
            </div>
            <div className="space-y-2 w-64">
              <Label htmlFor="groupType" className={cn((!quote.groupType) && showValidation && "text-destructive")}>
                Group Type *
              </Label>
              <Select
                value={quote.groupType || 'known'}
                onValueChange={handleGroupTypeChange}
              >
                <SelectTrigger className={cn((!quote.groupType) && showValidation && "border-destructive")}>
                  <SelectValue placeholder="Select group type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="known">Known Group</SelectItem>
                  <SelectItem value="speculative">Speculative Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DateRangeSelector
            startDate={quote.startDate}
            endDate={quote.endDate}
            onDateChange={handleDateChange}
          />
          
          <BasicInformation
            quote={quote}
            onInputChange={handleInputChange}
            onNumberChange={handleNumberChange}
            onGroupRangeToggle={handleGroupRangeToggle}
            showValidation={showValidation}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cities & Destinations</CardTitle>
          <CardDescription>Add the cities that will be visited during this trip</CardDescription>
        </CardHeader>
        <CardContent>
          <CityList
            cities={quote.cities}
            startDate={quote.startDate}
            endDate={quote.endDate}
            onAddCity={addCity}
            onUpdateCity={updateCity}
            onRemoveCity={removeCity}
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button size="lg" onClick={handleContinue}>
          Continue to Accommodations
        </Button>
      </div>
    </div>
  );
};

export default InitializationPhase;
