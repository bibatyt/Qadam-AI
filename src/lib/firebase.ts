import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_zqv--Dqpm6GuzmCMHsC27FCERVAZPyw",
  authDomain: "qadam-ai.firebaseapp.com",
  projectId: "qadam-ai",
  storageBucket: "qadam-ai.firebasestorage.app",
  messagingSenderId: "1028123082374",
  appId: "1:1028123082374:web:cd971c74a3e4a1f0ae5b07",
  measurementId: "G-PRZC1PGKDY"
};

let analytics: Analytics | null = null;
let initialized = false;

export const initFirebase = (): void => {
  if (typeof window !== 'undefined' && !initialized) {
    const app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    initialized = true;
    firebaseLogEvent(analytics, 'app_open');
  }
};

export const logEvent = (eventName: string, params?: Record<string, string | number | boolean>): void => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

export const logPageView = (pageName: string): void => {
  if (analytics) {
    firebaseLogEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }
};
