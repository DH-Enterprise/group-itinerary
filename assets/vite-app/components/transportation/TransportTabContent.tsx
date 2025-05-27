
import React from 'react';
import { Transportation } from '@/types/quote';
import TransportActions from './TransportActions';
import EmptyTransportState from './EmptyTransportState';
import TransportList from './TransportList';

interface TransportTabContentProps {
  transports: Transportation[];
  updateTransport: (id: string, field: string, value: any) => void;
  removeTransport: (id: string) => void;
  onAddTransport: (type: 'coaching' | 'air' | 'train' | 'ferry' | 'other') => void;
  defaultTravelerCount: number;
}

const TransportTabContent: React.FC<TransportTabContentProps> = ({ 
  transports, 
  updateTransport, 
  removeTransport, 
  onAddTransport,
  defaultTravelerCount
}) => {
  return (
    <div>
      <TransportActions onAddTransport={onAddTransport} />
      {transports.length === 0 ? (
        <EmptyTransportState />
      ) : (
        <TransportList 
          transports={transports}
          updateTransport={updateTransport}
          removeTransport={removeTransport}
          defaultTravelerCount={defaultTravelerCount}
        />
      )}
    </div>
  );
};

export default TransportTabContent;
