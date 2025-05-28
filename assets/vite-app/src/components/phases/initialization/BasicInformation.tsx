import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Quote, GroupType, GroupRange } from '@/types/quote';

interface BasicInformationProps {
  quote: Quote;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGroupRangeToggle: (id: string, checked: boolean) => void;
  showValidation?: boolean;
}

const BasicInformation = ({
  quote,
  onInputChange,
  onNumberChange,
  onGroupRangeToggle,
  showValidation
}: BasicInformationProps) => {
  // Generate the structured part of the name (e.g., [Known - Agency - Country])
  const generateStructuredPart = useCallback(() => {
    const parts: string[] = [];
    
    // Always include group type if available
    if (quote.groupType) {
      const formattedGroupType = quote.groupType.charAt(0).toUpperCase() + quote.groupType.slice(1);
      parts.push(formattedGroupType);
    } else {
      parts.push('Group Type');
    }
    
    // Include agency name if available
    if (quote.agencyName) {
      parts.push(quote.agencyName);
    } else {
      parts.push('Agency');
    }
    
    // Include countries if available
    if (quote.cities?.length > 0) {
      const uniqueCountries = [...new Set(quote.cities.map(city => city.country))];
      parts.push(uniqueCountries.join(', '));
    } else {
      parts.push('Countries');
    }
    
    return `[${parts.join(' - ')}]`;
  }, [quote.groupType, quote.agencyName, quote.cities]);

  // Extract free text from the current name
  const [freeText, setFreeText] = useState('');
  
  // Update the quote name when the structured part changes
  useEffect(() => {
    const structuredPart = generateStructuredPart();
    if (!structuredPart) return;
    
    // Only update if we have a valid structured part and either:
    // 1. We don't have a name yet, or
    // 2. The current name doesn't start with the new structured part
    if (!quote.name || !quote.name.startsWith('[') || !quote.name.startsWith(structuredPart)) {
      const newName = freeText ? `${structuredPart} - ${freeText}` : structuredPart;
      onInputChange({ target: { name: 'name', value: newName } } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [generateStructuredPart, onInputChange]);
  
  // Update free text when the name changes
  useEffect(() => {
    const structuredPart = generateStructuredPart();
    if (!quote.name || !structuredPart) return;
    
    // If the name starts with the structured part, extract the free text
    if (quote.name.startsWith(structuredPart)) {
      const newFreeText = quote.name.substring(structuredPart.length).trim();
      // Remove leading dash if present and update free text
      setFreeText(newFreeText.startsWith('-') ? newFreeText.substring(1).trim() : newFreeText);
    } else if (quote.name) {
      // If the name doesn't match the structure, treat the whole thing as free text
      setFreeText(quote.name);
    }
  }, [quote.name, generateStructuredPart]);
  
  // Handle changes to the free text input
  const handleFreeTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFreeText = e.target.value;
    setFreeText(newFreeText);
    
    // Combine with the structured part
    const structuredPart = generateStructuredPart();
    const newName = newFreeText ? `${structuredPart} - ${newFreeText}` : structuredPart;
    
    // Update the parent component
    onInputChange({ target: { name: 'name', value: newName } } as React.ChangeEvent<HTMLInputElement>);
  };
  
  const tripDuration = quote.startDate && quote.endDate 
    ? Math.ceil((new Date(quote.endDate).getTime() - new Date(quote.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const isFieldInvalid = (value: any, type: 'string' | 'number' = 'string'): boolean => {
    if (!showValidation) return false;
    if (type === 'number') return !value || isNaN(Number(value)) || Number(value) < 10;
    return !value;
  };

  const hasSelectedGroupRanges = quote.groupRanges?.some(range => range.selected) ?? false;
  const showGroupRangeError = showValidation && quote.groupType === 'speculative' && !hasSelectedGroupRanges;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name" className={cn(isFieldInvalid(quote.name) && "text-destructive")}>
          Quote Name *
        </Label>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 text-sm border rounded-md bg-muted whitespace-nowrap">
            {generateStructuredPart() || '[Group Type - Agency - Countries]'}
          </div>
          <div className="flex-1">
            <Input
              id="name"
              name="name"
              value={freeText}
              onChange={handleFreeTextChange}
              placeholder="Enter description (e.g., Summer Tour 2025)"
              className={cn(isFieldInvalid(quote.name) && "border-destructive")}
            />
          </div>
        </div>
        {isFieldInvalid(quote.name) && (
          <div className="flex items-center gap-2 text-destructive text-sm mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>Quote name is required</span>
          </div>
        )}
      </div>

      {quote.groupType === 'known' ? (
        <div className="space-y-2">
          <Label htmlFor="travelerCount" className={cn(showValidation && !quote.travelerCount && 'text-destructive')}>
            Number of Travelers *
          </Label>
          <Input
            id="travelerCount"
            name="travelerCount"
            type="number"
            min="10"
            value={quote.travelerCount || ''}
            onChange={onNumberChange}
            className={cn(showValidation && !quote.travelerCount && 'border-destructive')}
          />
          {showValidation && !quote.travelerCount && (
            <p className="text-sm text-destructive">Number of travelers is required (minimum 10)</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label className={cn(showGroupRangeError && 'text-destructive')}>
            Group Size Ranges *
          </Label>
          <div className="space-y-2">
            {quote.groupRanges?.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <Checkbox
                  id={range.id}
                  checked={range.selected}
                  onCheckedChange={(checked) => onGroupRangeToggle(range.id, checked as boolean)}
                />
                <Label htmlFor={range.id} className="font-normal">
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
          {showGroupRangeError && (
            <p className="text-sm text-destructive">Please select at least one group range</p>
          )}
        </div>
      )}

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

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          value={quote.additionalInfo || ''}
          onChange={onInputChange}
          placeholder="Any additional information or special requirements..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default BasicInformation;
