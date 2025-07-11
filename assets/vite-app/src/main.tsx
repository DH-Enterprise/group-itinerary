import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get exchange rates passed from the server
const exchangeRates = (window as any).exchangeRates || [
  { code: 'USD', rate: 1.0 },
  { code: 'EUR', rate: 0.85 },
  { code: 'GBP', rate: 0.75 }
];

// Clean up the global variable
delete (window as any).exchangeRates;

createRoot(document.getElementById("root")!).render(
  <App exchangeRates={exchangeRates} />
);
