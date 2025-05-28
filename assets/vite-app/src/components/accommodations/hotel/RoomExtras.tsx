
import React from 'react';
import { Hotel, RoomExtra } from '@/types/quote';
import { Button } from '@/components/ui/button';
import { Plus, CircleDollarSign } from 'lucide-react';
import RoomExtraRow from './RoomExtraRow';

interface RoomExtrasProps {
  hotel: Hotel;
  onAddExtra: () => void;
  onUpdateExtra: (extraId: string, field: string, value: any) => void;
  onRemoveExtra: (extraId: string) => void;
}

const RoomExtras = ({
  hotel,
  onAddExtra,
  onUpdateExtra,
  onRemoveExtra,
}: RoomExtrasProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium flex items-center">
          <CircleDollarSign className="h-4 w-4 mr-2 text-travel-orange" />
          Room Extras
        </h4>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onAddExtra}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Extra
        </Button>
      </div>
      
      {hotel.extras.length === 0 ? (
        <div className="text-sm text-gray-500 italic p-2">
          No extras added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {hotel.extras.map(extra => (
            <RoomExtraRow
              key={extra.id}
              extra={extra}
              onUpdate={onUpdateExtra}
              onRemove={onRemoveExtra}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomExtras;
