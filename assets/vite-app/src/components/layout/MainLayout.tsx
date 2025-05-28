
import React, { ReactNode } from 'react';
import Header from './Header';
import PhaseNavigation from './PhaseNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <PhaseNavigation />
      <main className="flex-grow container mx-auto py-6 px-4">
        {children}
      </main>
      <footer className="bg-travel-blue-dark text-white py-4 text-center">
        <p className="text-sm">© 2025 Group Travel Quote Builder - Internal Tool</p>
      </footer>
    </div>
  );
};

export default MainLayout;
