
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bus, Plane, Train, Ship, Plus } from 'lucide-react';

interface TransportActionsProps {
  onAddTransport: (type: 'coaching' | 'air' | 'train' | 'ferry' | 'other') => void;
}

const TransportActions: React.FC<TransportActionsProps> = ({ onAddTransport }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button onClick={() => onAddTransport('coaching')} size="sm" variant="outline">
        <Bus className="mr-2 h-4 w-4" />
        Add Ground Transport
      </Button>
      <Button onClick={() => onAddTransport('air')} size="sm" variant="outline">
        <Plane className="mr-2 h-4 w-4" />
        Add Air Transport
      </Button>
      <Button onClick={() => onAddTransport('train')} size="sm" variant="outline">
        <Train className="mr-2 h-4 w-4" />
        Add Train
      </Button>
      <Button onClick={() => onAddTransport('ferry')} size="sm" variant="outline">
        <Ship className="mr-2 h-4 w-4" />
        Add Ferry
      </Button>
      <Button onClick={() => onAddTransport('other')} size="sm" variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        Add Other
      </Button>
    </div>
  );
};

export default TransportActions;
