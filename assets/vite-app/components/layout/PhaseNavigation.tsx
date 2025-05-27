
import React from 'react';
import { useQuote } from '@/context/QuoteContext';
import { PhaseStatus } from '@/types/quote';
import { cn } from '@/lib/utils';

const phases = [
  { id: 'initialization', label: 'Trip Details' },
  { id: 'accommodations', label: 'Accommodations' },
  { id: 'activities', label: 'Activities' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'finalization', label: 'Finalize' },
];

const PhaseNavigation = () => {
  const { phaseStatuses, setCurrentPhase, currentPhase } = useQuote();

  const getPhaseStatusClass = (phaseId: string) => {
    const status = phaseStatuses[phaseId];
    if (status === PhaseStatus.COMPLETED) return 'completed';
    if (status === PhaseStatus.ACTIVE) return 'active';
    return 'pending';
  };

  const handlePhaseClick = (phaseId: string) => {
    const status = phaseStatuses[phaseId];
    if (status !== PhaseStatus.PENDING) {
      setCurrentPhase(phaseId);
    }
  };

  return (
    <div className="py-6 bg-white shadow-md">
      <div className="container mx-auto">
        <div className="hidden md:flex items-center justify-between px-4">
          {phases.map((phase, index) => (
            <React.Fragment key={phase.id}>
              <div 
                className={cn(
                  "flex flex-col items-center cursor-pointer transition-all duration-300",
                  currentPhase === phase.id ? "scale-105" : "",
                  phaseStatuses[phase.id] === PhaseStatus.PENDING ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                )}
                onClick={() => handlePhaseClick(phase.id)}
              >
                <div className={`phase-indicator ${getPhaseStatusClass(phase.id)}`}>
                  {index + 1}
                </div>
                <span className="mt-2 text-sm font-medium">{phase.label}</span>
              </div>
              
              {index < phases.length - 1 && (
                <div className={`phase-connector ${getPhaseStatusClass(phase.id)}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Mobile view */}
        <div className="md:hidden px-4">
          <select 
            className="w-full p-2 border rounded"
            value={currentPhase}
            onChange={(e) => handlePhaseClick(e.target.value)}
          >
            {phases.map((phase, index) => (
              <option 
                key={phase.id} 
                value={phase.id}
                disabled={phaseStatuses[phase.id] === PhaseStatus.PENDING}
              >
                {index + 1}. {phase.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PhaseNavigation;
