
import React from 'react';
import { Transportation } from '@/types/quote';
import TransportCard from './TransportCard';

interface TransportListProps {
  transports: Transportation[];
  updateTransport: (id: string, field: string, value: any) => void;
  removeTransport: (id: string) => void;
  defaultTravelerCount: number;
}

const TransportList: React.FC<TransportListProps> = ({ 
  transports, 
  updateTransport, 
  removeTransport,
  defaultTravelerCount
}) => {
  if (transports.length === 0) {
    return null;
  }

  // Sort transports by date
  const sortedTransports = [...transports].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-4">
      {sortedTransports.map(transport => (
        <TransportCard 
          key={transport.id} 
          transport={transport} 
          updateTransport={updateTransport}
          removeTransport={removeTransport}
          defaultTravelerCount={defaultTravelerCount}
        />
      ))}
    </div>
  );
};

export default TransportList;
