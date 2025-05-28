
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { City } from '@/types/quote';
import { toast } from '@/hooks/use-toast';

interface CityListProps {
  cities: City[];
  startDate: Date;
  endDate: Date;
  onAddCity: () => void;
  onUpdateCity: (id: string, field: string, value: any) => void;
  onRemoveCity: (id: string) => void;
}

const CityList = ({ 
  cities, 
  startDate, 
  endDate, 
  onAddCity, 
  onUpdateCity, 
  onRemoveCity 
}: CityListProps) => {
  return (
    <div className="space-y-4">
      {cities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No cities added yet. Add your first city to continue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cities.map((city) => (
            <div key={city.id} className="border rounded-lg p-4 bg-white">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`city-name-${city.id}`}>City Name</Label>
                  <Input
                    id={`city-name-${city.id}`}
                    value={city.name}
                    onChange={(e) => onUpdateCity(city.id, 'name', e.target.value)}
                    placeholder="e.g., Dublin"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`city-country-${city.id}`}>Country</Label>
                  <Input
                    id={`city-country-${city.id}`}
                    value={city.country}
                    onChange={(e) => onUpdateCity(city.id, 'country', e.target.value)}
                    placeholder="e.g., Ireland"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Check-In Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !city.checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {city.checkIn ? format(city.checkIn, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={city.checkIn}
                        onSelect={(date) => date && onUpdateCity(city.id, 'checkIn', date)}
                        disabled={(date) => 
                          date < startDate || 
                          date > endDate ||
                          (city.checkOut && date > city.checkOut)
                        }
                        defaultMonth={startDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-1 space-y-2">
                  <Label>Check-Out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !city.checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {city.checkOut ? format(city.checkOut, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={city.checkOut}
                        onSelect={(date) => date && onUpdateCity(city.id, 'checkOut', date)}
                        disabled={(date) => 
                          date < (city.checkIn || startDate) || 
                          date > endDate
                        }
                        defaultMonth={city.checkIn || startDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => onRemoveCity(city.id)}
                    className="mb-2"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button variant="outline" onClick={onAddCity}>
        <Plus className="mr-2 h-4 w-4" />
        Add City
      </Button>
    </div>
  );
};

export default CityList;
