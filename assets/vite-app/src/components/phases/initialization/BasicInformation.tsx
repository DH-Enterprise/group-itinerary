import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronsUpDown, Check } from 'lucide-react';
import { Quote } from '@/types/quote';
import { searchAgents, Agent } from '@/utils/api/agentApi';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Button } from '@/components/ui/button';

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
    
    // Combine with the structured part for the name
    const structuredPart = generateStructuredPart();
    const newName = newFreeText ? `${structuredPart} - ${newFreeText}` : structuredPart;
    
    // Update both name and description in the parent component
    onInputChange({ target: { name: 'name', value: newName } } as React.ChangeEvent<HTMLInputElement>);
    onInputChange({ target: { name: 'description', value: newFreeText } } as React.ChangeEvent<HTMLInputElement>);
  };
  
  const tripDuration = quote.startDate && quote.endDate 
    ? Math.ceil((new Date(quote.endDate).getTime() - new Date(quote.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const isFieldInvalid = (value: any, type: 'string' | 'number' | 'travelerCount' = 'string'): boolean => {
    if (!showValidation) return false;
    if (type === 'number') {
      // For budget field, require value > 0 when form is being validated
      if (showValidation && (value === '' || value === null || value === undefined)) {
        return true;
      }
      return value !== '' && (isNaN(Number(value)) || Number(value) <= 0);
    }
    if (type === 'travelerCount') return !value || isNaN(Number(value)) || Number(value) < 10;
    return !value;
  };

  const hasSelectedGroupRanges = quote.groupRanges?.some(range => range.selected) ?? false;
  const showGroupRangeError = showValidation && quote.groupType === 'speculative' && !hasSelectedGroupRanges;
  
  // Agent search state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAgentSearchOpen, setIsAgentSearchOpen] = useState(false);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  
  // Search for agents when query changes or when dropdown is opened
  useEffect(() => {
    const search = async (searchQuery: string) => {
      if (searchQuery.length > 1 || isAgentSearchOpen) {
        const results = await searchAgents(searchQuery || '');
        setAgents(results);
        
        // If we have an agentId but no name in the results, try to find and set the name
        if (quote.agentId) {
          const selectedAgent = results.find(a => a.id === quote.agentId);
          if (selectedAgent && !quote.agentName) {
            onInputChange({ 
              target: { 
                name: 'agentName', 
                value: getAgentFullName(selectedAgent) 
              } 
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }
      } else {
        setAgents([]);
      }
    };
    
    const timeoutId = setTimeout(() => search(agentSearchQuery), 300);
    return () => clearTimeout(timeoutId);
  }, [agentSearchQuery, isAgentSearchOpen, quote.agentId, quote.agentName, onInputChange]);
  
  // Load the selected agent when dropdown is opened
  useEffect(() => {
    if (isAgentSearchOpen && quote.agentId && !agentSearchQuery) {
      // Trigger a search with empty query to load agents
      const loadSelectedAgent = async () => {
        const results = await searchAgents('');
        setAgents(results);
      };
      loadSelectedAgent();
    }
  }, [isAgentSearchOpen, quote.agentId, agentSearchQuery]);
  
  // Get full agent name
  const getAgentFullName = (agent: Agent) => {
    return `${agent.firstName}${agent.middleName ? ' ' + agent.middleName : ''} ${agent.lastName}`.trim();
  };
  
  // Get selected agent name from agents list or use the stored agent name
  const getSelectedAgentName = useCallback(() => {
    // If we have a selected agent in the list, use that
    if (quote.agentId) {
      const selectedAgent = agents.find(a => a.id === quote.agentId);
      if (selectedAgent) {
        return getAgentFullName(selectedAgent);
      }
      // If not found in agents but we have a stored agent name, use that
      if (quote.agentName) {
        return quote.agentName;
      }
    }
    return '';
  }, [quote.agentId, quote.agentName, agents]);
  
  // Handle agent selection
  const handleAgentSelect = (agent: Agent) => {
    // Update agent ID
    onInputChange({ target: { name: 'agentId', value: agent.id } } as React.ChangeEvent<HTMLInputElement>);
    
    // Update agent name (for display)
    onInputChange({ target: { name: 'agentName', value: getAgentFullName(agent) } } as React.ChangeEvent<HTMLInputElement>);
    
    // Update agency name
    onInputChange({ target: { name: 'agencyName', value: agent.agency.name } } as React.ChangeEvent<HTMLInputElement>);
    
    // Clear search query and close dropdown
    setAgentSearchQuery('');
    setIsAgentSearchOpen(false);
  };

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
          <Label htmlFor="travelerCount" className={cn(isFieldInvalid(quote.travelerCount, 'travelerCount') && 'text-destructive')}>
            Number of Travelers *
          </Label>
          <Input
            id="travelerCount"
            name="travelerCount"
            type="number"
            min="10"
            value={quote.travelerCount || ''}
            onChange={onNumberChange}
            className={cn(isFieldInvalid(quote.travelerCount, 'travelerCount') && 'border-destructive')}
          />
          {isFieldInvalid(quote.travelerCount, 'travelerCount') && (
            <div className="flex items-center gap-2 text-destructive text-sm mt-1">
              <AlertCircle className="h-4 w-4" />
              <span>Minimum 10 travelers required for known groups</span>
            </div>
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
        <Popover.Root open={isAgentSearchOpen} onOpenChange={setIsAgentSearchOpen}>
          <Popover.Trigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isAgentSearchOpen}
              className={cn(
                "w-full justify-between",
                isFieldInvalid(quote.agentId) && "border-destructive"
              )}
              onClick={() => setIsAgentSearchOpen(!isAgentSearchOpen)}
            >
              {getSelectedAgentName() || "Select agent..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </Popover.Trigger>
          <Popover.Content className="w-[300px] p-0" align="start" sideOffset={4}>
            <div className="rounded-md border bg-popover text-popover-foreground shadow-md">
              <Command className="rounded-lg border">
                <Command.Input 
                  placeholder="Search agents..." 
                  value={agentSearchQuery}
                  onValueChange={setAgentSearchQuery}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Command.List className="max-h-[300px] overflow-y-auto">
                  {agents.length === 0 ? (
                    <div className="py-6 text-center text-sm">
                      No agents found.
                    </div>
                  ) : (
                    agents.map((agent) => (
                      <Command.Item
                        key={agent.id}
                        value={getAgentFullName(agent)}
                        onSelect={() => handleAgentSelect(agent)}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            quote.agentName === getAgentFullName(agent) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div>
                          <div className="font-medium">
                            {getAgentFullName(agent)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {agent.agency.name}
                          </div>
                        </div>
                      </Command.Item>
                    ))
                  )}
                </Command.List>
              </Command>
            </div>
          </Popover.Content>
        </Popover.Root>
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
        <div className="relative">
          <Input
            id="agencyName"
            name="agencyName"
            value={quote.agencyName}
            onChange={onInputChange}
            placeholder="Agency's name"
            readOnly
            className={cn(
              'bg-muted/50',
              isFieldInvalid(quote.agencyName) ? 'border-destructive' : ''
            )}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-xs text-muted-foreground">Auto-filled</span>
          </div>
        </div>
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
            <span>Budget is required and must be greater than 0</span>
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
