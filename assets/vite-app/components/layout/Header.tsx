
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuote } from '@/context/QuoteContext';
import { Save, FileText, Plus } from 'lucide-react';

const Header = () => {
  const { saveQuote, loadSampleQuote, createNewQuote, quote } = useQuote();

  return (
    <header className="bg-travel-blue-dark text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">Group Travel Quote Builder</h1>
          {quote.name && (
            <span className="ml-4 px-3 py-1 bg-travel-blue text-white rounded-md">
              {quote.name}
            </span>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            size="sm"
            className="text-white hover:bg-travel-blue/80"
            onClick={createNewQuote}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Quote
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="text-white hover:bg-travel-blue/80"
            onClick={loadSampleQuote}
          >
            <FileText className="mr-2 h-4 w-4" />
            Load Sample
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="text-white hover:bg-travel-blue/80"
            onClick={saveQuote}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Quote
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
