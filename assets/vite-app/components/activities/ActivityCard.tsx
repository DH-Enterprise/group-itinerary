
import React from 'react';
import { format } from 'date-fns';
import { Trash, Users, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Activity } from '@/types/quote';
import { formatCurrency } from '@/utils/quoteUtils';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  updateActivity: (id: string, field: string, value: any) => void;
  removeActivity: (id: string) => void;
  travelerCount: number; // Default traveler count from quote
}

const ActivityCard = ({ activity, updateActivity, removeActivity, travelerCount }: ActivityCardProps) => {
  const activityTypes = [
    { value: 'tour', label: 'Tour/Excursion' },
    { value: 'restaurant', label: 'Restaurant/Dining' },
    { value: 'golf', label: 'Golf' },
    { value: 'other', label: 'Other' }
  ];
  
  // Use activity-specific traveler count if available, otherwise use the default
  const activityTravelerCount = activity.travelerCount !== undefined ? activity.travelerCount : travelerCount;
  const totalCost = activity.perPerson ? activity.cost * activityTravelerCount : activity.cost;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{activity.name || 'New Activity'}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => removeActivity(activity.id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {format(activity.date, 'EEEE, MMMM d, yyyy')} • {formatCurrency(totalCost)}
          {activity.perPerson && activityTravelerCount !== travelerCount && 
            ` • ${activityTravelerCount}/${travelerCount} travelers`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`activity-name-${activity.id}`}>Activity Name</Label>
            <Input
              id={`activity-name-${activity.id}`}
              value={activity.name}
              onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
              placeholder="Enter activity name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`activity-type-${activity.id}`}>Activity Type</Label>
            <Select
              value={activity.type}
              onValueChange={(value) => updateActivity(activity.id, 'type', value)}
            >
              <SelectTrigger id={`activity-type-${activity.id}`}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !activity.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {activity.date ? format(activity.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={activity.date}
                  onSelect={(date) => date && updateActivity(activity.id, 'date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`activity-cost-${activity.id}`}>Cost (USD)</Label>
            <div className="flex items-center gap-2">
              <Input
                id={`activity-cost-${activity.id}`}
                type="number"
                value={activity.cost}
                onChange={(e) => updateActivity(activity.id, 'cost', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <Switch 
                  checked={activity.perPerson}
                  onCheckedChange={(checked) => updateActivity(activity.id, 'perPerson', checked)}
                />
                <Label className="text-sm">Per Person</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Traveler count section - only show when perPerson is true */}
        {activity.perPerson && (
          <div className="space-y-2">
            <Label htmlFor={`activity-travelers-${activity.id}`} className="flex items-center">
              <Users className="h-4 w-4 mr-1" /> Number of Travelers
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id={`activity-travelers-${activity.id}`}
                type="number"
                min="1"
                max={travelerCount}
                value={activityTravelerCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  const clampedValue = Math.min(Math.max(value, 1), travelerCount);
                  updateActivity(activity.id, 'travelerCount', clampedValue);
                }}
                className="max-w-24"
              />
              <span className="text-sm text-gray-500">of {travelerCount} total travelers</span>
              {activityTravelerCount !== travelerCount && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateActivity(activity.id, 'travelerCount', travelerCount)}
                  className="ml-auto text-xs"
                >
                  Reset to All
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor={`activity-notes-${activity.id}`}>Notes</Label>
          <Textarea
            id={`activity-notes-${activity.id}`}
            value={activity.notes}
            onChange={(e) => updateActivity(activity.id, 'notes', e.target.value)}
            placeholder="Add any notes about this activity..."
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between text-sm">
          <div className="text-gray-500">
            {activity.perPerson ? 
              `${formatCurrency(activity.cost)} × ${activityTravelerCount} travelers` : 
              'Group rate'}
          </div>
          <div className="font-medium">
            Total: {formatCurrency(totalCost)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
