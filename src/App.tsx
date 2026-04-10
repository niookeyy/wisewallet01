import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DebtHealthProvider } from "@/contexts/DebtHealthContext";
import { PendingTransactionsProvider } from "@/contexts/PendingTransactionsContext";
import BottomNav from "@/components/BottomNav";
import HomePage from "./pages/HomePage";
import LeakTrackerPage from "./pages/LeakTrackerPage";
import ScanPage from "./pages/ScanPage";
import SubsPage from "./pages/SubsPage";
import SavingsPage from "./pages/SavingsPage";
import CoolingPeriodScreen from "./pages/CoolingPeriodScreen";
import TransactionSuccessScreen from "./pages/TransactionSuccessScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DebtHealthProvider>
        <PendingTransactionsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="max-w-md mx-auto min-h-screen bg-background relative">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/leak-tracker" element={<LeakTrackerPage />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/subs" element={<SubsPage />} />
                <Route path="/savings" element={<SavingsPage />} />
                <Route path="/cooling/:id" element={<CoolingPeriodScreen />} />
                <Route path="/transaction-success" element={<TransactionSuccessScreen />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </div>
          </BrowserRouter>
          <SpeedInsights />
        </PendingTransactionsProvider>
      </DebtHealthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
