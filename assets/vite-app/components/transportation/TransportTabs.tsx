
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transportation } from '@/types/quote';
import { Bus, Plane, Ship } from 'lucide-react';
import TransportTabContent from './TransportTabContent';

interface TransportTabsProps {
  quote: Transportation[];
  updateTransport: (id: string, field: string, value: any) => void;
  removeTransport: (id: string) => void;
  onAddTransport: (type: 'coaching' | 'air' | 'train' | 'ferry' | 'other') => void;
  defaultTravelerCount: number;
}

const TransportTabs: React.FC<TransportTabsProps> = ({ 
  quote, 
  updateTransport, 
  removeTransport, 
  onAddTransport,
  defaultTravelerCount 
}) => {
  const getTransportationByType = (type: 'coaching' | 'air' | 'train' | 'ferry' | 'other') => {
    return quote.filter(item => item.type === type);
  };
  
  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="border-b px-6 py-2">
        <TabsList className="grid grid-flow-col auto-cols-max gap-4">
          <TabsTrigger value="all" className="px-4 py-2">
            All Transportation
          </TabsTrigger>
          <TabsTrigger value="coaching" className="px-4 py-2">
            <span className="flex items-center gap-2">
              <Bus className="h-4 w-4" />
              Ground
            </span>
          </TabsTrigger>
          <TabsTrigger value="air" className="px-4 py-2">
            <span className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Air
            </span>
          </TabsTrigger>
          <TabsTrigger value="other" className="px-4 py-2">
            <span className="flex items-center gap-2">
              <Ship className="h-4 w-4" />
              Other
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all" className="p-6">
        <TransportTabContent 
          transports={quote}
          updateTransport={updateTransport}
          removeTransport={removeTransport}
          onAddTransport={onAddTransport}
          defaultTravelerCount={defaultTravelerCount}
        />
      </TabsContent>
      
      <TabsContent value="coaching" className="p-6">
        <TransportTabContent 
          transports={getTransportationByType('coaching')}
          updateTransport={updateTransport}
          removeTransport={removeTransport}
          onAddTransport={onAddTransport}
          defaultTravelerCount={defaultTravelerCount}
        />
      </TabsContent>
      
      <TabsContent value="air" className="p-6">
        <TransportTabContent 
          transports={getTransportationByType('air')}
          updateTransport={updateTransport}
          removeTransport={removeTransport}
          onAddTransport={onAddTransport}
          defaultTravelerCount={defaultTravelerCount}
        />
      </TabsContent>
      
      <TabsContent value="other" className="p-6">
        <TransportTabContent 
          transports={[
            ...getTransportationByType('train'),
            ...getTransportationByType('ferry'),
            ...getTransportationByType('other')
          ]}
          updateTransport={updateTransport}
          removeTransport={removeTransport}
          onAddTransport={onAddTransport}
          defaultTravelerCount={defaultTravelerCount}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TransportTabs;
