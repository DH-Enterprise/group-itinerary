
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyAccommodationsStateProps {
  onBack: () => void;
}

const EmptyAccommodationsState = ({ onBack }: EmptyAccommodationsStateProps) => {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <p className="text-gray-500">You need to add cities in the Trip Details phase before adding accommodations.</p>
        <Button className="mt-4" onClick={onBack}>
          Go Back to Trip Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyAccommodationsState;
