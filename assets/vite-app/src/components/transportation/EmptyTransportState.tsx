
import React from 'react';

const EmptyTransportState: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-10 text-center">
      <p className="text-gray-500">No transportation items added yet.</p>
      <p className="text-sm text-gray-400 mt-2">Use the buttons above to add transportation options.</p>
    </div>
  );
};

export default EmptyTransportState;
