import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useAnalytics } from "@/hooks/useAnalytics";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Reviews from "./pages/Reviews";
import Dashboard from "./pages/Dashboard";
import Counselor from "./pages/Counselor";
import Path from "./pages/Path";
import Settings from "./pages/Settings";
import EssayEngine from "./pages/EssayEngine";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  useAnalytics();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/path" element={<Path />} />
                    <Route path="/counselor" element={<Counselor />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/essay" element={<EssayEngine />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
