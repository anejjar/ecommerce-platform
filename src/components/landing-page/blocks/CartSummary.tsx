'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslations } from 'next-intl';

interface CartSummaryConfig {
  showItemCount?: boolean;
  showSubtotal?: boolean;
  showTotal?: boolean;
  showCheckoutButton?: boolean;
  layout?: 'inline' | 'drawer';
  maxItems?: number;
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface CartSummaryProps {
  config: CartSummaryConfig;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ config }) => {
  const t = useTranslations();
  const { format } = useCurrency();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [shippingSettings, setShippingSettings] = useState<any>(null);

  // Fetch shipping settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/checkout-settings');
        if (response.ok) {
          const data = await response.json();
          setShippingSettings(data.shippingSettings);
        }
      } catch (error) {
        console.error('Error fetching shipping settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const {
    showItemCount = true,
    showSubtotal = true,
    showTotal = true,
    showCheckoutButton = true,
    layout = 'inline',
    maxItems = 5,
    paddingTop = '40px',
    paddingBottom = '40px',
    backgroundColor = '#ffffff',
    maxWidth = '400px',
  } = config;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate tax based on admin settings
  const taxEnabled = shippingSettings?.tax_enable === 'true';
  const taxRate = parseFloat(shippingSettings?.tax_rate_default || '0') / 100;
  const tax = taxEnabled ? subtotal * taxRate : 0;

  // Calculate shipping based on admin settings
  const freeShippingEnabled = shippingSettings?.shipping_enable_free === 'true';
  const freeShippingThreshold = parseFloat(shippingSettings?.shipping_free_threshold || '0');
  const flatRateEnabled = shippingSettings?.shipping_enable_flat_rate === 'true';
  const flatRateAmount = parseFloat(shippingSettings?.shipping_flat_rate || '0');

  let shipping = 0;
  if (freeShippingEnabled && subtotal >= freeShippingThreshold) {
    shipping = 0; // Free shipping
  } else if (flatRateEnabled) {
    shipping = flatRateAmount; // Flat rate shipping
  }

  const total = subtotal + tax + shipping;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const displayItems = cartItems.slice(0, maxItems);

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="w-full"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center" style={{ maxWidth }}>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('cart.emptyCart')}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('cart.addProducts')}
              </p>
              <Link href="/shop">
                <Button size="sm">{t('cart.continueShopping')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop,
        paddingBottom,
        backgroundColor,
      }}
      className="w-full"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto" style={{ maxWidth }}>
          <div className="bg-white rounded-lg shadow-sm p-6">
            {showItemCount && (
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-600">
                  {itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')}
                </p>
              </div>
            )}

            {layout === 'inline' && displayItems.length > 0 && (
              <div className="mb-4 space-y-2 max-h-64 overflow-y-auto">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{item.name}</span>
                    <span className="ml-2 font-medium">{format(item.price * item.quantity)}</span>
                  </div>
                ))}
                {cartItems.length > maxItems && (
                  <p className="text-xs text-gray-500 text-center">
                    +{cartItems.length - maxItems} more {t('cart.items')}
                  </p>
                )}
              </div>
            )}

            {showSubtotal && (
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="font-medium">{format(subtotal)}</span>
              </div>
            )}

            {showTotal && (
              <div className="mb-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span>{format(total)}</span>
                </div>
              </div>
            )}

            {showCheckoutButton && (
              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full">
                  {t('cart.proceedToCheckout')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

