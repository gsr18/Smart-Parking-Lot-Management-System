import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/useAuthStore';
import { Header } from './components/common/Header';
import { ShiftBanner } from './components/staff/ShiftBanner';
import { CommandPalette } from './components/common/CommandPalette';
import { AiChatDrawer } from './components/ai/AiChatDrawer';
import { CheckInModal } from './components/parking/CheckInModal';
import { CheckOutModal } from './components/parking/CheckOutModal';
import { ReceiptModal } from './components/parking/ReceiptModal';
import { CheckOutResponse } from './types';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ParkingPage } from './pages/ParkingPage';
import { SlotsPage } from './pages/SlotsPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { ReportsPage } from './pages/ReportsPage';
import { WatchlistPage } from './pages/WatchlistPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, initialize } = useAuthStore();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<CheckOutResponse | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsCheckInOpen(true);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsCheckOutOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-vibrant-canvas text-slate-100 font-sans antialiased flex flex-col">
      {/* Top Header Navigation */}
      <Header
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenCheckOut={() => setIsCheckOutOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 overflow-y-auto space-y-4 sm:space-y-6">
        <ShiftBanner />

        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/parking" element={<ParkingPage />} />
          <Route path="/slots" element={<SlotsPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <AiChatDrawer />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenCheckOut={() => setIsCheckOutOut(true)}
      />

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSuccess={() => queryClient.invalidateQueries()}
      />

      <CheckOutModal
        isOpen={isCheckOutOpen}
        onClose={() => setIsCheckOutOpen(false)}
        onSuccess={(receipt) => {
          queryClient.invalidateQueries();
          setActiveReceipt(receipt);
        }}
      />

      <ReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        receipt={activeReceipt}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '12px',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
