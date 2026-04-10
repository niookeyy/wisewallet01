import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DebtHealthProvider } from "@/contexts/DebtHealthContext";
import { PendingTransactionsProvider } from "@/contexts/PendingTransactionsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LeakTrackerPage from "./pages/LeakTrackerPage";
import ScanPage from "./pages/ScanPage";
import SubsPage from "./pages/SubsPage";
import SavingsPage from "./pages/SavingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import CoolingPeriodScreen from "./pages/CoolingPeriodScreen";
import TransactionSuccessScreen from "./pages/TransactionSuccessScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hideNav = location.pathname === "/" || location.pathname === "/onboarding";

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/leak-tracker" element={<LeakTrackerPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/subs" element={<SubsPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/cooling/:id" element={<CoolingPeriodScreen />} />
          <Route path="/transaction-success" element={<TransactionSuccessScreen />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DebtHealthProvider>
        <PendingTransactionsProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AuthProvider>
        </PendingTransactionsProvider>
      </DebtHealthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
