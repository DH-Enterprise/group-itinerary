
import React from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const TermsContent = () => {
  const { quote, setQuote } = useQuote();

  // Update terms and conditions
  const updateTerms = (value: string) => {
    setQuote(prev => ({
      ...prev,
      termsAndConditions: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms & Conditions</CardTitle>
        <CardDescription>Add terms, payment conditions, and cancellation policies.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={quote.termsAndConditions}
          onChange={(e) => updateTerms(e.target.value)}
          placeholder="Enter the terms and conditions for this quote..."
          rows={10}
        />
      </CardContent>
    </Card>
  );
};

export default TermsContent;
