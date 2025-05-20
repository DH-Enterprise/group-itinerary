import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { calculateTripDuration } from '@/utils/quoteUtils';
import { Quote } from '@/types/quote';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface BasicInformationProps {
  quote: Quote;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showValidation?: boolean;
}

const BasicInformation = ({ quote, onInputChange, onNumberChange, showValidation }: BasicInformationProps) => {
  const tripDuration = calculateTripDuration(quote.startDate, quote.endDate);

  const isFieldInvalid = (value: any, type: 'text' | 'number' = 'text'): boolean => {
    if (!showValidation) return false;
    if (type === 'number') {
      return !value || value <= 0 || (value < 10 && value === quote.travelerCount);
    }
    return !value || value.trim() === '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name" className={cn(isFieldInvalid(quote.name) && "text-destructive")}>
          Quote Name *
        </Label>
        <Input
          id="name"
          name="name"
          value={quote.name}
          onChange={onInputChange}
          placeholder="e.g., Ireland Golf Group May 2025"
          className={cn(isFieldInvalid(quote.name) && "border-destructive")}
        />
        {isFieldInvalid(quote.name) && (
          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>Quote name is required</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="travelerCount" className={cn(isFieldInvalid(quote.travelerCount, 'number') && "text-destructive")}>
          Number of Travelers (min. 10) *
        </Label>
        <Input
          id="travelerCount"
          name="travelerCount"
          type="number"
          min="10"
          value={quote.travelerCount}
          onChange={onNumberChange}
          className={cn(isFieldInvalid(quote.travelerCount, 'number') && "border-destructive")}
        />
        {isFieldInvalid(quote.travelerCount, 'number') && (
          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>Minimum 10 travelers required</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agentName" className={cn(isFieldInvalid(quote.agentName) && "text-destructive")}>
          Agent Name *
        </Label>
        <Input
          id="agentName"
          name="agentName"
          value={quote.agentName}
          onChange={onInputChange}
          placeholder="Agent's name"
          className={cn(isFieldInvalid(quote.agentName) && "border-destructive")}
        />
        {isFieldInvalid(quote.agentName) && (
          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>Agent name is required</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencyName" className={cn(isFieldInvalid(quote.agencyName) && "text-destructive")}>
          Agency Name *
        </Label>
        <Input
          id="agencyName"
          name="agencyName"
          value={quote.agencyName}
          onChange={onInputChange}
          placeholder="Agency's name"
          className={cn(isFieldInvalid(quote.agencyName) && "border-destructive")}
        />
        {isFieldInvalid(quote.agencyName) && (
          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>Agency name is required</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget" className={cn(isFieldInvalid(quote.budget, 'number') && "text-destructive")}>
          Total Budget (USD) *
        </Label>
        <Input
          id="budget"
          name="budget"
          type="number"
          value={quote.budget}
          onChange={onNumberChange}
          placeholder="Enter total budget"
          className={cn(isFieldInvalid(quote.budget, 'number') && "border-destructive")}
        />
        {isFieldInvalid(quote.budget, 'number') && (
          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>Budget must be greater than 0</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Trip Duration</Label>
        <div className="flex items-center h-10 px-4 border rounded-md bg-muted">
          <span>{tripDuration} days / {tripDuration - 1} nights</span>
        </div>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="notes">Internal Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={quote.notes}
          onChange={onInputChange}
          placeholder="Add any internal notes about this quote..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default BasicInformation;
