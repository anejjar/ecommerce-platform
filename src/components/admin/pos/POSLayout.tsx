'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { POSHeader } from './POSHeader';
import { POSSidebar } from './POSSidebar';
import { SalesAnalytics } from './SalesAnalytics';
import { HeldOrdersList } from './HeldOrdersList';
import { MenuItems } from './MenuItems';
import { OrderSummary } from './OrderSummary';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setLocation, setCashier } from '@/lib/redux/features/posSlice';
import toast from 'react-hot-toast';

export function POSLayout() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const locationId = useAppSelector((state) => state.pos.locationId);
  const cashierId = useAppSelector((state) => state.pos.cashierId);
  const [isLoading, setIsLoading] = useState(true);
  const [locationName, setLocationName] = useState<string | null>(null);
  const placeOrderRef = useRef<() => void>();

  useEffect(() => {
    // Initialize location and cashier from current user
    const initializePOS = async () => {
      try {
        // Try to get current user's cashier record
        const response = await fetch('/api/pos/cashiers/me');
        if (response.ok) {
          const cashier = await response.json();
          if (cashier) {
            dispatch(setLocation(cashier.locationId));
            dispatch(setCashier(cashier.id));
            setLocationName(cashier.location?.name || null);
          }
        } else if (response.status === 404) {
          // No cashier record found - try to get first available location and cashier
          const [locationsRes, cashiersRes] = await Promise.all([
            fetch('/api/pos/locations'),
            fetch('/api/pos/cashiers'),
          ]);

          if (locationsRes.ok && cashiersRes.ok) {
            const locations = await locationsRes.json();
            const cashiers = await cashiersRes.json();

            // Set first active location if available
            const activeLocation = locations?.find((loc: any) => loc.isActive);
            if (activeLocation) {
              dispatch(setLocation(activeLocation.id));
              setLocationName(activeLocation.name);

              // Set first active cashier for this location
              const locationCashier = cashiers?.find(
                (cashier: any) => cashier.locationId === activeLocation.id && cashier.isActive
              );
              if (locationCashier) {
                dispatch(setCashier(locationCashier.id));
              } else if (cashiers?.length > 0 && cashiers[0]?.isActive) {
                // Fallback to first active cashier
                dispatch(setCashier(cashiers[0].id));
              }
            } else {
              toast.error('No active location found. Please create a location first.');
            }
          }
        } else {
          toast.error('Failed to load POS session');
        }
      } catch (error) {
        console.error('Error initializing POS:', error);
        toast.error('Failed to initialize POS session');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      initializePOS();
    } else {
      setIsLoading(false);
    }
  }, [session, dispatch]);

  const handlePlaceOrder = () => {
    // This will be called by OrderSummary via ref
    placeOrderRef.current?.();
  };

  const handlePaymentSelect = (method: 'CASH' | 'CARD' | 'DIGITAL_WALLET') => {
    // Payment selection handled in OrderSummary
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading POS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <KeyboardShortcuts
        onPlaceOrder={handlePlaceOrder}
        onPaymentSelect={handlePaymentSelect}
        enabled={true}
      />
      <POSHeader locationName={locationName} />
      <div className="flex flex-1 overflow-hidden">
        <POSSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <HeldOrdersList />
            <SalesAnalytics />
            <div className="mt-6">
              <MenuItems />
            </div>
          </div>
        </div>
        <OrderSummary />
      </div>
    </div>
  );
}

