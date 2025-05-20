
import React from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const InclusionsExclusionsContent = () => {
  const { quote, setQuote } = useQuote();
  const { toast } = useToast();

  // Convert array of inclusions to newline-separated string
  const inclusionsText = quote.inclusions.join('\n');
  
  // Convert array of exclusions to newline-separated string
  const exclusionsText = quote.exclusions.join('\n');

  // Update inclusions from textarea
  const updateInclusions = (value: string) => {
    // Split by newline and filter out empty lines
    const inclusions = value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    setQuote(prev => ({
      ...prev,
      inclusions
    }));
  };

  // Update exclusions from textarea
  const updateExclusions = (value: string) => {
    // Split by newline and filter out empty lines
    const exclusions = value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    setQuote(prev => ({
      ...prev,
      exclusions
    }));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inclusions</CardTitle>
          <CardDescription>What's included in this quote? Enter each item on a new line.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inclusionsText}
            onChange={(e) => updateInclusions(e.target.value)}
            placeholder="Enter inclusions, one per line, e.g.:
11 nights accommodation in 4-5 star hotels
All breakfasts and 3 dinners
Guided tours as specified in the itinerary
Private transfers between destinations"
            rows={10}
            className="font-mono"
          />
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Exclusions</CardTitle>
          <CardDescription>What's not included in this quote? Enter each item on a new line.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={exclusionsText}
            onChange={(e) => updateExclusions(e.target.value)}
            placeholder="Enter exclusions, one per line, e.g.:
International flights
Travel insurance
Optional activities
Personal expenses"
            rows={10}
            className="font-mono"
          />
        </CardContent>
      </Card>
    </>
  );
};

export default InclusionsExclusionsContent;
