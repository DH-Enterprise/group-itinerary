
import React from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types/quote';
import ActivityCard from './ActivityCard';

type ExchangeRate = {
  code: string;
  rate: number;
};

interface DailyActivitiesTabProps {
  date?: Date;
  cityId: string;
  activities: Activity[];
  addActivity: (cityId: string, date?: Date) => void;
  updateActivity: (id: string, field: string, value: any) => void;
  removeActivity: (id: string) => void;
  travelerCount: number;
  isAllDaysView?: boolean;
  exchangeRates: ExchangeRate[];
}

const DailyActivitiesTab = ({ 
  date, 
  cityId, 
  activities, 
  addActivity, 
  updateActivity, 
  removeActivity, 
  travelerCount,
  isAllDaysView = false,
  exchangeRates
}: DailyActivitiesTabProps) => {
  if (activities.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-10 text-center">
        <p className="text-gray-500">
          {isAllDaysView 
            ? "No activities added yet for this city." 
            : "No activities scheduled for this day."}
        </p>
        {isAllDaysView && (
          <Button className="mt-4" onClick={() => addActivity(cityId)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Activity
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            updateActivity={updateActivity}
            removeActivity={removeActivity}
            travelerCount={travelerCount}
            exchangeRates={exchangeRates}
          />
        ))}
    </div>
  );
};

export default DailyActivitiesTab;
