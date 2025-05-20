
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TransportNavigationProps {
  onBack: () => void;
  onContinue: () => void;
}

const TransportNavigation: React.FC<TransportNavigationProps> = ({ onBack, onContinue }) => {
  return (
    <div className="flex justify-between pt-4">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft size={16} />
        Back to Activities
      </Button>
      <Button onClick={onContinue} className="flex items-center gap-2">
        Continue to Itinerary
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default TransportNavigation;
