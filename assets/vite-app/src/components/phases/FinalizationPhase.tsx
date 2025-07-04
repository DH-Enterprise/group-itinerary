import React, { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PhaseStatus } from '@/types/quote';
import { calculateTotalAccommodationCost, calculateTotalActivityCost, calculateTotalTransportationCost, calculatePerPersonCost, formatCurrency } from '@/utils/quoteUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Printer, Send, Check, X, Eye, CalendarDays, Hotel, Bus, CircleDollarSign, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const FinalizationPhase = () => {
  const { quote, setQuote, setPhaseStatus, setCurrentPhase } = useQuote();
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleBack = () => {
    setCurrentPhase('itinerary');
  };

  const handleExport = (type: 'agent' | 'traveler') => {
    toast({
      title: `Quote ${type === 'agent' ? 'Agent' : 'Blue Page'} Exported`,
      description: `The quote has been exported successfully as a PDF.`,
    });
  };

  const handleEmail = (type: 'agent' | 'traveler') => {
    toast({
      title: `Quote ${type === 'agent' ? 'Agent' : 'Blue Page'} Emailed`,
      description: `The quote has been sent via email.`,
    });
  };

  const handlePreviewBluePage = async () => {
    setIsLoading(true);
    try {
      // Transform activities to use cityName instead of city, rename date to dateString, and costUSD to costUsd
      const transformedActivities = quote.activities.map(activity => {
        const city = quote.cities.find(c => c.id === activity.city);
        return {
          ...activity,
          cityName: city ? city.name : activity.city,
          dateString: activity.date, // Rename date to dateString
          costUsd: activity.costUSD, // Rename costUSD to costUsd
          city: undefined, // Remove the city field
          date: undefined, // Remove the date field
          costUSD: undefined, // Remove the costUSD field
        };
      });

      // Transform hotels to use cityName instead of city
      const transformedHotels = quote.hotels.map(hotel => {
        const city = quote.cities.find(c => c.id === hotel.city);
        return {
          ...hotel,
          cityName: city ? city.name : hotel.city,
          city: undefined // Remove the city field
        };
      });

      // Ensure agentId is included in the payload
      const payload = {
        ...quote,
        activities: transformedActivities,
        hotels: transformedHotels,
        agentId: quote.agentId || null,
      };

      const response = await fetch('/api/quotes/preview-blue-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to preview Blue Page');
      }

      const data = await response.json();
      console.log('Blue Page preview requested', data);
      
      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error previewing Blue Page:', error);
      toast({
        title: 'Error',
        description: 'Failed to preview Blue Page',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    setQuote(prev => ({
      ...prev,
      status: 'approved'
    }));
    
    toast({
      title: "Quote Approved",
      description: "The quote has been approved and is ready to send to the agent.",
    });
  };

  // Calculate various costs
  const accommodationCost = calculateTotalAccommodationCost(quote.hotels);
  const activityCost = calculateTotalActivityCost(quote.activities);
  const transportationCost = calculateTotalTransportationCost(quote.transportation);
  const totalCost = accommodationCost + activityCost + transportationCost;
  const perPersonCost = calculatePerPersonCost(quote);
  const remainingBudget = quote.budget - totalCost;

  return (
    <div className="space-y-6 animate-fade-in relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-travel-blue animate-spin mb-4" />
            <p className="text-lg font-medium">Generating Blue Page Preview...</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-travel-blue-dark">Quote Finalization</h2>
        <div className="flex items-center">
          <Badge variant={quote.status === 'approved' ? 'default' : 'outline'} className="mr-2">
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </Badge>
          {quote.status !== 'approved' && (
            <Button 
              size="sm" 
              onClick={handleApprove}
              className="bg-travel-green hover:bg-travel-green/90"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve Quote
            </Button>
          )}
        </div>
      </div>
      <p className="text-gray-600">Review the complete quote and generate documents for agents and travelers.</p>
      
      <Tabs 
        defaultValue="summary" 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">
            Quote Summary
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary: {quote.name}</CardTitle>
              <CardDescription>
                {quote.travelerCount} travelers • {format(quote.startDate, 'MMM d')} - {format(quote.endDate, 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard 
                  title="Accommodations" 
                  amount={accommodationCost} 
                  icon={<Hotel className="h-5 w-5" />}
                  items={quote.hotels.length}
                />
                
                <SummaryCard 
                  title="Activities & Tours" 
                  amount={activityCost} 
                  icon={<CircleDollarSign className="h-5 w-5" />}
                  items={quote.activities.length}
                />
                
                <SummaryCard 
                  title="Transportation" 
                  amount={transportationCost} 
                  icon={<Bus className="h-5 w-5" />}
                  items={quote.transportation.length}
                />
              </div>
              
              <div className="border-t border-b py-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Total Budget:</span>
                  <span className="font-medium">{formatCurrency(quote.budget)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Total Quote Cost:</span>
                  <span className="font-medium">{formatCurrency(totalCost)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Remaining Budget:</span>
                  <span className={`font-medium ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(remainingBudget)}
                  </span>
                </div>
                
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Per Person Cost:</span>
                  <span className="font-medium">{formatCurrency(perPersonCost)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Itinerary Summary</h3>
                <div className="text-sm space-y-2">
                  {quote.cities.map((city, index) => (
                    <div key={city.id} className="flex items-start">
                      <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-travel-blue" />
                      <div>
                        <span className="font-medium">{city.name}, {city.country}</span>
                        <span className="text-gray-500 ml-2">
                          ({format(city.checkIn, 'MMM d')} - {format(city.checkOut, 'MMM d')})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Inclusions</h3>
                  {quote.inclusions.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No inclusions added yet.</p>
                  ) : (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {quote.inclusions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Exclusions</h3>
                  {quote.exclusions.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No exclusions added yet.</p>
                  ) : (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {quote.exclusions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Quote</CardTitle>
                <CardDescription>Generate a detailed quote for the agent with all pricing details.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-64 h-80 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden border">
                  <div className="text-center p-4">
                    <FileText className="h-16 w-16 text-travel-blue mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">{quote.name}</h3>
                    <p className="text-sm text-gray-500">Agent Quote</p>
                    <div className="border-t mt-2 pt-2">
                      <p className="text-sm font-medium">Total: {formatCurrency(totalCost)}</p>
                      <p className="text-xs">Per Person: {formatCurrency(perPersonCost)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleExport('agent')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" size="icon">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleEmail('agent')}>
                    <Send className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Blue Page for Travelers</CardTitle>
                <CardDescription>Generate a traveler-friendly document without pricing details.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-64 h-80 bg-travel-blue/10 flex items-center justify-center rounded-md overflow-hidden border border-travel-blue/30">
                  <div className="text-center p-4">
                    <CalendarDays className="h-16 w-16 text-travel-blue mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">{quote.name}</h3>
                    <p className="text-sm text-gray-500">Traveler Itinerary</p>
                    <div className="border-t mt-2 pt-2">
                      <p className="text-sm font-medium">{quote.cities.length} Destinations</p>
                      <p className="text-xs">{format(quote.startDate, 'MMM d')} - {format(quote.endDate, 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleExport('traveler')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handlePreviewBluePage}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleEmail('traveler')}>
                    <Send className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
              <CardDescription>Summary of what will be included in the documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Agent Quote Includes:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Complete pricing breakdown</li>
                      <li>Room category details</li>
                      <li>Per-night and per-person costs</li>
                      <li>Activity pricing</li>
                      <li>Transportation costs</li>
                      <li>Budget summary</li>
                      <li>Internal notes</li>
                      <li>Full itinerary</li>
                      <li>Terms and conditions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Blue Page Includes:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Professionally styled itinerary</li>
                      <li>Destination images</li>
                      <li>Hotel descriptions</li>
                      <li>Activity descriptions (without prices)</li>
                      <li>Transportation details</li>
                      <li>Daily schedule</li>
                      <li>Inclusions and exclusions</li>
                      <li>Terms and conditions</li>
                      <li>No pricing information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back to Itinerary
        </Button>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  items: number;
}

const SummaryCard = ({ title, amount, icon, items }: SummaryCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="rounded-full bg-travel-blue/10 p-2 text-travel-blue">
            {icon}
          </div>
          <span className="text-sm text-gray-500">{items} items</span>
        </div>
        <h3 className="font-medium mt-2">{title}</h3>
        <p className="text-xl font-bold mt-1 text-travel-blue-dark">{formatCurrency(amount)}</p>
      </CardContent>
    </Card>
  );
};

export default FinalizationPhase;
