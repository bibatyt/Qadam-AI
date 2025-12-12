import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initFirebase, logPageView } from '@/lib/firebase';

const pageNames: Record<string, string> = {
  '/': 'Landing',
  '/auth': 'Authentication',
  '/onboarding': 'Onboarding',
  '/dashboard': 'Dashboard',
  '/path': 'Path',
  '/counselor': 'AI Counselor',
  '/settings': 'Settings',
  '/essay': 'Essay Engine',
  '/reviews': 'Reviews',
};

export const useAnalytics = (): void => {
  const location = useLocation();

  useEffect(() => {
    initFirebase();
  }, []);

  useEffect(() => {
    const pageName = pageNames[location.pathname] || location.pathname;
    logPageView(pageName);
  }, [location.pathname]);
};
