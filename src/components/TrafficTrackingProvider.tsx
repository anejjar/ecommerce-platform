'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTrafficTracking } from '@/hooks/useTrafficTracking';

interface TrafficTrackingContextType {
  trackEvent: (eventType: string, eventData?: any, eventValue?: number) => Promise<void>;
  trackPageView: (force?: boolean) => Promise<void>;
  trackProductView: (productId: string) => Promise<void>;
  getSessionToken: () => string;
}

const TrafficTrackingContext = createContext<TrafficTrackingContextType | undefined>(
  undefined
);

/**
 * Provider component that wraps the app and provides tracking functions
 */
export function TrafficTrackingProvider({ children }: { children: ReactNode }) {
  const tracking = useTrafficTracking();

  return (
    <TrafficTrackingContext.Provider value={tracking}>
      {children}
    </TrafficTrackingContext.Provider>
  );
}

/**
 * Hook to access traffic tracking functions from any component
 * @example
 * const { trackEvent, trackProductView } = useTrafficTrackingContext();
 * trackEvent('ADD_TO_CART', { productId: '123', quantity: 2 }, 29.99);
 */
export function useTrafficTrackingContext() {
  const context = useContext(TrafficTrackingContext);
  if (context === undefined) {
    throw new Error(
      'useTrafficTrackingContext must be used within a TrafficTrackingProvider'
    );
  }
  return context;
}
