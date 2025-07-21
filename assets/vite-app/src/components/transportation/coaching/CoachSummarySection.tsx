
import React, { useMemo } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Transportation, CoachClass, CoachExtra } from '@/types/quote';

interface CoachSummarySectionProps {
  transport: Transportation;
}

const CoachSummarySection: React.FC<CoachSummarySectionProps> = ({ transport }) => {
  const { exchangeRates } = useQuote();
  
  // Create a default coaching details object if not present
  const coachingDetails = useMemo(() => {
    const defaultCurrency = 'EUR';
    const defaultExchangeRate = exchangeRates.find(rate => rate.code === defaultCurrency)?.rate || 1.25;
    
    return transport.coachingDetails || {
      driverDays: 7,
      selectedCurrency: defaultCurrency,
      exchangeRate: defaultExchangeRate,
      markupRate: 1.45,
      coachClasses: [],
      extras: [],
    };
  }, [transport.coachingDetails, exchangeRates]);

  // Safely access coach classes and extras
  const coachClasses = coachingDetails.coachClasses || [];
  const extras = coachingDetails.extras || [];

  const calculateTotals = (coachClass: CoachClass) => {
    const { driverDays, selectedCurrency, markupRate } = coachingDetails;
    const dailyRate = coachClass.dailyRate || 0;
    const exchangeRate = exchangeRates.find(rate => rate.code === selectedCurrency)?.rate || 1;
    
    const baseNetForeign = dailyRate * driverDays;
    const baseUSDNet = baseNetForeign * exchangeRate;
    const baseUSDSell = baseUSDNet * markupRate;

    // Calculate extras total (already in USD)
    const extrasTotal = extras
      .filter(extra => extra.enabled)
      .reduce((sum, extra) => sum + ((extra.rate || 0) * (extra.days || 0)), 0);

    return {
      netForeign: baseNetForeign,
      usdNet: baseUSDNet,
      usdSell: baseUSDSell + extrasTotal,
    };
  };

  const currencySymbol = coachingDetails.selectedCurrency === 'EUR' ? '€' : '£';

  // Calculate the summary totals
  const calculateSummaryTotals = () => {
    const { selectedCurrency } = coachingDetails;
    const exchangeRate = exchangeRates.find(rate => rate.code === selectedCurrency)?.rate || 1;
    
    let totalForeignCurrency = 0;
    let totalForeignNet = 0;
    let totalUSDNet = 0;
    let totalUSDSell = 0;

    // Add coach class totals
    coachClasses
      .filter(cc => cc.enabled)
      .forEach((coachClass) => {
        const { driverDays, selectedCurrency } = coachingDetails;
        const dailyRate = coachClass.dailyRate || 0;
        const exchangeRate = exchangeRates.find(rate => rate.code === selectedCurrency)?.rate || 1;
        const markupRate = coachingDetails.markupRate;
        
        totalForeignCurrency += dailyRate;
        
        // If entireRate is true, don't multiply by driverDays
        const baseNetForeign = coachClass.entireRate ? dailyRate : dailyRate * driverDays;
        totalForeignNet += baseNetForeign;
        
        const baseUSDNet = baseNetForeign * exchangeRate;
        totalUSDNet += baseUSDNet;
        
        const baseUSDSell = baseUSDNet * markupRate;
        totalUSDSell += baseUSDSell;
      });

    // Add extras totals - only for coach classes where additionalServicesIncluded is false
    const coachClassesWithExtras = coachClasses.filter(cc => cc.enabled && !cc.additionalServicesIncluded);
    if (coachClassesWithExtras.length > 0) {
      extras
        .filter(extra => extra.enabled)
        .forEach((extra) => {
          const { selectedCurrency, markupRate } = coachingDetails;
          const exchangeRate = exchangeRates.find(rate => rate.code === selectedCurrency)?.rate || 1;
          const extraRate = extra.rate || 0;
          const extraDays = extra.days || 0;
          
          totalForeignCurrency += extraRate;
          
          const extraNetForeign = extraRate * extraDays;
          totalForeignNet += extraNetForeign;
          
          const extraUSDNet = extraNetForeign * exchangeRate;
          totalUSDNet += extraUSDNet;
          
          const extraUSDSell = extraUSDNet * markupRate;
          totalUSDSell += extraUSDSell;
        });
    }

    return {
      totalForeignCurrency,
      totalForeignNet,
      totalUSDNet,
      totalUSDSell,
    };
  };

  const summaryTotals = calculateSummaryTotals();

  // Update the transport cost with the calculated total
  if (transport.cost !== summaryTotals.totalUSDSell) {
    // We need to use setTimeout to avoid modifying props directly during render
    setTimeout(() => {
      // This is a bit of a hack, but it helps ensure the total cost is reflected in the transportation summary
      const transportEvent = new CustomEvent('update-transport-cost', { 
        detail: { 
          id: transport.id, 
          cost: summaryTotals.totalUSDSell
        } 
      });
      document.dispatchEvent(transportEvent);
    }, 0);
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coach Type</TableHead>
            <TableHead>Days</TableHead>
            <TableHead className="text-right">{coachingDetails.selectedCurrency}</TableHead>
            <TableHead className="text-right">{coachingDetails.selectedCurrency} NET</TableHead>
            <TableHead className="text-right">USD NET</TableHead>
            <TableHead className="text-right">USD SELL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coachClasses
            .filter(cc => cc.enabled)
            .map((coachClass) => {
              const totals = calculateTotals(coachClass);
              return (
                <React.Fragment key={coachClass.id}>
                  <TableRow>
                    <TableCell>{coachClass.maxCapacity} Pax {coachClass.type} Class Coach</TableCell>
                    <TableCell>{coachingDetails.driverDays} days at</TableCell>
                    <TableCell className="text-right">{currencySymbol}{coachClass.dailyRate}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{totals.netForeign.toFixed(2)}</TableCell>
                    <TableCell className="text-right">$ {totals.usdNet.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">$ {totals.usdSell.toFixed(2)}</TableCell>
                  </TableRow>
                  {/* Additional Services for this coach class */}
                  {!coachClass.additionalServicesIncluded && extras.filter(extra => extra.enabled).map((extra) => (
                    <TableRow key={`${coachClass.id}-${extra.id}`} className="bg-muted/20">
                      <TableCell colSpan={2} className="pl-8">+ {extra.name}</TableCell>
                      <TableCell className="text-right">{extra.days} days at {currencySymbol}{extra.rate}</TableCell>
                      <TableCell className="text-right">{currencySymbol}{(extra.rate * extra.days).toFixed(2)}</TableCell>
                      <TableCell className="text-right">$ {(extra.rate * extra.days * coachingDetails.exchangeRate).toFixed(2)}</TableCell>
                      <TableCell className="text-right">$ {(extra.rate * extra.days * coachingDetails.exchangeRate * coachingDetails.markupRate).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
          })}
        </TableBody>
        <TableFooter>
          <TableRow className="border-t-2 border-gray-300">
            <TableCell colSpan={2} className="font-bold">TOTAL</TableCell>
            <TableCell className="text-right font-bold">{currencySymbol}{summaryTotals.totalForeignCurrency.toFixed(2)}</TableCell>
            <TableCell className="text-right font-bold">{currencySymbol}{summaryTotals.totalForeignNet.toFixed(2)}</TableCell>
            <TableCell className="text-right font-bold">$ {summaryTotals.totalUSDNet.toFixed(2)}</TableCell>
            <TableCell className="text-right font-bold">$ {summaryTotals.totalUSDSell.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CoachSummarySection;
