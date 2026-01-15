import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// MVP Pages
import LandingPage from "./pages/mvp/LandingPage";
import AuthPage from "./pages/mvp/AuthPage";
import ResetPassword from "./pages/mvp/ResetPassword";
import StudentOnboarding from "./pages/mvp/StudentOnboarding";
import MyPath from "./pages/mvp/MyPath";
import ParentDashboard from "./pages/mvp/ParentDashboard";
import SettingsPage from "./pages/mvp/SettingsPage";
import ReadinessPage from "./pages/mvp/ReadinessPage";
import FeedbackPage from "./pages/mvp/FeedbackPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/readiness" element={<ReadinessPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/student-onboarding" element={<StudentOnboarding />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/my-path" element={<MyPath />} />
              <Route path="/parent-dashboard" element={<ParentDashboard />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
