
import React from 'react';
import { Button } from '@/components/ui/button';

interface AccommodationNavigationProps {
  onBack: () => void;
  onContinue: () => void;
}

const AccommodationNavigation = ({
  onBack,
  onContinue,
}: AccommodationNavigationProps) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack}>
        Back to Trip Details
      </Button>
      <Button onClick={onContinue}>
        Continue to Activities
      </Button>
    </div>
  );
};

export default AccommodationNavigation;
