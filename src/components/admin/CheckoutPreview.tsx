'use client';

import { CheckoutSettings } from '@/types/checkout-settings';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, CreditCard, AlertTriangle, Gift } from 'lucide-react';
import { useState } from 'react';
import { CountdownTimer } from '@/components/checkout/CountdownTimer';
import { FreeShippingBar } from '@/components/checkout/FreeShippingBar';
import { TestimonialsCarousel } from '@/components/checkout/TestimonialsCarousel';
import { RecentPurchasePopup } from '@/components/checkout/RecentPurchasePopup';
import {
  TrustBadges,
  SecuritySeals,
  MoneyBackGuarantee,
  CustomerServiceDisplay,
  TrustRating,
  OrderCountTicker,
} from '@/components/checkout/TrustElements';

interface CheckoutPreviewProps {
  settings: CheckoutSettings;
  viewMode: 'desktop' | 'tablet' | 'mobile';
}

export function CheckoutPreview({ settings, viewMode }: CheckoutPreviewProps) {
  const [orderSummaryCollapsed, setOrderSummaryCollapsed] = useState(false);

  const widthClass = {
    narrow: 'max-w-3xl',
    normal: 'max-w-5xl',
    wide: 'max-w-7xl',
  }[settings.pageWidth || 'normal'];

  const buttonStyleClass = {
    rounded: 'rounded-md',
    square: 'rounded-none',
    pill: 'rounded-full',
  }[settings.buttonStyle || 'rounded'];

  const fontClass = {
    system: 'font-sans',
    inter: 'font-inter',
    roboto: 'font-roboto',
    opensans: 'font-opensans',
  }[settings.fontFamily || 'system'];

  const viewModeClass = {
    desktop: 'w-full',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm',
  }[viewMode];

  const primaryColor = settings.primaryColor || '#000000';
  const secondaryColor = settings.secondaryColor || '#666666';

  return (
    <div className={`${viewModeClass} mx-auto transition-all duration-300`}>
      <style jsx global>{`
        .checkout-preview-primary {
          background-color: ${primaryColor};
          color: white;
        }
        .checkout-preview-text {
          color: ${secondaryColor};
        }
        .checkout-preview-border {
          border-color: ${primaryColor};
        }
      `}</style>

      <div className={`${fontClass} bg-background min-h-screen p-4`}>
        {/* Header with Logo */}
        {settings.logoUrl && (
          <div className="mb-6 text-center">
            <img
              src={settings.logoUrl}
              alt="Store Logo"
              className="h-12 mx-auto object-contain"
            />
          </div>
        )}

        {/* Trust Badges - Header */}
        {settings.trustBadges && settings.trustBadges.length > 0 && (
          <TrustBadges badges={settings.trustBadges} position="header" />
        )}

        {/* Countdown Timer */}
        {settings.showCountdownTimer && settings.countdownEndDate && (
          <div className="mb-6">
            <CountdownTimer
              endDate={new Date(settings.countdownEndDate)}
              text={settings.countdownText || undefined}
            />
          </div>
        )}

        {/* Order Count Ticker */}
        {settings.showOrderCount && (
          <div className="mb-6">
            <OrderCountTicker show={settings.showOrderCount} text={settings.orderCountText || undefined} />
          </div>
        )}

        {/* Trust Rating */}
        {settings.showTrustRating && (
          <div className="mb-6">
            <TrustRating
              show={settings.showTrustRating}
              score={settings.trustRatingScore || undefined}
              count={settings.trustRatingCount || undefined}
            />
          </div>
        )}

        {/* Checkout Banner */}
        {settings.checkoutBanner && (
          <Alert
            className={`mb-6 ${
              settings.checkoutBannerType === 'success' ? 'border-green-500 bg-green-50' :
              settings.checkoutBannerType === 'warning' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}
          >
            <AlertDescription>{settings.checkoutBanner}</AlertDescription>
          </Alert>
        )}

        {/* Promotional Banners */}
        {settings.promotionalBanners && settings.promotionalBanners.filter(b => b.position === 'top').map((banner) => (
          <Alert
            key={banner.id}
            className={`mb-6 ${
              banner.type === 'success' ? 'border-green-500 bg-green-50' :
              banner.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
              banner.type === 'danger' ? 'border-red-500 bg-red-50' :
              'border-blue-500 bg-blue-50'
            }`}
          >
            <AlertDescription>
              {banner.message}
              {banner.link && banner.linkText && (
                <a href={banner.link} className="ml-2 underline font-semibold">
                  {banner.linkText}
                </a>
              )}
            </AlertDescription>
          </Alert>
        ))}

        {/* Free Shipping Progress Bar */}
        {settings.showFreeShippingBar && settings.freeShippingThreshold && (
          <div className="mb-6">
            <FreeShippingBar
              currentTotal={99}
              threshold={Number(settings.freeShippingThreshold)}
              text={settings.freeShippingBarText || undefined}
            />
          </div>
        )}

        {/* Progress Steps (if multi-step) */}
        {settings.checkoutLayout === 'multi-step' && settings.progressStyle !== 'none' && (
          <div className="mb-8">
            {settings.progressStyle === 'steps' ? (
              <div className="flex justify-between items-center">
                {['Information', 'Shipping', 'Payment'].map((step, index) => (
                  <div key={step} className="flex-1 flex items-center">
                    <div className={`flex items-center ${index === 0 ? 'checkout-preview-primary' : 'bg-gray-200'} rounded-full px-4 py-2 text-sm`}>
                      <span className="font-semibold">{index + 1}</span>
                      <span className="ml-2">{step}</span>
                    </div>
                    {index < 2 && <div className="flex-1 h-0.5 bg-gray-200 mx-2" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="checkout-preview-primary h-2 rounded-full" style={{ width: '33%' }} />
              </div>
            )}
          </div>
        )}

        <div className={`${widthClass} mx-auto`}>
          <div className={`grid ${settings.orderSummaryPosition === 'right' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
            {/* Order Summary - Top Position */}
            {settings.orderSummaryPosition === 'top' && (
              <div className="md:col-span-2">
                <OrderSummary settings={settings} />
              </div>
            )}

            {/* Checkout Form */}
            <div className={settings.orderSummaryPosition === 'right' ? '' : 'md:col-span-2'}>
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Checkout Information</h2>

                <div className="space-y-4">
                  {/* Render fields in custom order */}
                  {(settings.fieldOrder || [
                    'email', 'firstName', 'lastName', 'company', 'phone', 'alternativePhone',
                    'address', 'address2', 'city', 'state', 'country',
                    'deliveryDate', 'deliveryInstructions', 'giftMessage', 'orderNotes'
                  ]).map((fieldName) => renderField(fieldName, settings))}

                  {/* Custom Fields */}
                  {settings.customFields && settings.customFields.length > 0 && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold mb-3">Additional Information</h3>
                      </div>
                      {settings.customFields.map((field) => (
                        <div key={field.id}>
                          <Label>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          {field.type === 'textarea' ? (
                            <Textarea placeholder={field.placeholder} className="mt-1" />
                          ) : field.type === 'select' ? (
                            <select className="w-full mt-1 p-2 border rounded-md">
                              <option value="">Select...</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'checkbox' ? (
                            <div className="flex items-center mt-2">
                              <input type="checkbox" className="mr-2" />
                              <span className="text-sm">{field.placeholder}</span>
                            </div>
                          ) : (
                            <Input
                              type={field.type === 'date' ? 'date' : 'text'}
                              placeholder={field.placeholder}
                              className="mt-1"
                            />
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Payment Section */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </h3>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <p className="text-sm checkout-preview-text">Payment gateway preview</p>
                  </div>
                </div>

                {/* Low Stock Warning */}
                {settings.showLowStock && (
                  <Alert className="mt-4 border-orange-500 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      {settings.lowStockText || 'Only 3 items left in stock!'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Gift with Purchase */}
                {settings.showGiftWithPurchase && settings.giftThreshold && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Gift className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-purple-900 mb-1">
                          Free Gift with Purchase!
                        </p>
                        <p className="text-sm text-purple-800">
                          {settings.giftDescription ||
                            `Spend ${Number(settings.giftThreshold).toFixed(2)} MAD or more and get a free gift!`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loyalty Points */}
                {settings.showLoyaltyPoints && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-medium text-amber-900">
                      {settings.loyaltyPointsText || '⭐ Earn 99 loyalty points with this order!'}
                    </p>
                  </div>
                )}

                {/* Trust Badges - Payment */}
                {settings.trustBadges && settings.trustBadges.length > 0 && (
                  <div className="mt-4">
                    <TrustBadges badges={settings.trustBadges} position="payment" />
                  </div>
                )}

                {/* Security Seals */}
                {settings.showSecuritySeals && (
                  <div className="mt-4">
                    <SecuritySeals show={settings.showSecuritySeals} />
                  </div>
                )}

                <Button
                  className={`w-full mt-6 ${buttonStyleClass} checkout-preview-primary`}
                  size="lg"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Complete Order
                </Button>

                {/* Money Back Guarantee */}
                {settings.moneyBackGuarantee && (
                  <div className="mt-4">
                    <MoneyBackGuarantee message={settings.moneyBackGuarantee} />
                  </div>
                )}

                {/* Customer Service */}
                {settings.customerServiceDisplay && (
                  <div className="mt-4">
                    <CustomerServiceDisplay
                      show={settings.customerServiceDisplay}
                      text={settings.customerServiceText || undefined}
                      phone={settings.customerServicePhone || undefined}
                      email={settings.customerServiceEmail || undefined}
                    />
                  </div>
                )}
              </Card>

              {/* Testimonials */}
              {settings.showTestimonials && settings.testimonials && settings.testimonials.length > 0 && (
                <div className="mt-6">
                  <TestimonialsCarousel testimonials={settings.testimonials} />
                </div>
              )}

              {/* Trust Badges - Footer */}
              {settings.trustBadges && settings.trustBadges.length > 0 && (
                <div className="mt-6">
                  <TrustBadges badges={settings.trustBadges} position="footer" />
                </div>
              )}
            </div>

            {/* Order Summary - Right Position */}
            {settings.orderSummaryPosition === 'right' && (
              <div>
                <OrderSummary settings={settings} />
              </div>
            )}

            {/* Order Summary - Collapsible */}
            {settings.orderSummaryPosition === 'collapsible' && (
              <div className="md:col-span-2">
                <button
                  onClick={() => setOrderSummaryCollapsed(!orderSummaryCollapsed)}
                  className="w-full p-4 border rounded-lg flex justify-between items-center mb-4 hover:bg-gray-50"
                >
                  <span className="font-semibold">Order Summary</span>
                  <span>{orderSummaryCollapsed ? '▼' : '▲'}</span>
                </button>
                {!orderSummaryCollapsed && <OrderSummary settings={settings} />}
              </div>
            )}
          </div>
        </div>

        {/* Recent Purchase Popup */}
        <RecentPurchasePopup
          show={settings.showRecentPurchases}
          delay={settings.recentPurchaseDelay || 5000}
        />
      </div>
    </div>
  );
}

function renderField(fieldName: string, settings: CheckoutSettings) {
  // Check if field should be shown
  const shouldShow = (field: string): boolean => {
    switch (field) {
      case 'phone': return settings.showPhone;
      case 'company': return settings.showCompany;
      case 'address2': return settings.showAddressLine2;
      case 'alternativePhone': return settings.showAlternativePhone;
      case 'deliveryInstructions': return settings.showDeliveryInstructions;
      case 'giftMessage': return settings.showGiftMessage;
      case 'deliveryDate': return settings.showDeliveryDate;
      case 'orderNotes': return settings.enableOrderNotes;
      default: return true;
    }
  };

  if (!shouldShow(fieldName)) return null;

  const label = settings.fieldLabels?.[fieldName as keyof typeof settings.fieldLabels] || getDefaultLabel(fieldName);
  const placeholder = settings.fieldPlaceholders?.[fieldName as keyof typeof settings.fieldPlaceholders] || '';
  const isRequired = fieldName === 'phone' && settings.requirePhone;

  return (
    <div key={fieldName}>
      <Label>
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {['orderNotes', 'deliveryInstructions', 'giftMessage'].includes(fieldName) ? (
        <Textarea placeholder={placeholder} className="mt-1" />
      ) : (
        <Input
          type={fieldName === 'email' ? 'email' : fieldName === 'deliveryDate' ? 'date' : 'text'}
          placeholder={placeholder}
          className="mt-1"
        />
      )}
    </div>
  );
}

function getDefaultLabel(fieldName: string): string {
  const labels: Record<string, string> = {
    email: 'Email Address',
    firstName: 'First Name',
    lastName: 'Last Name',
    company: 'Company',
    phone: 'Phone Number',
    alternativePhone: 'Alternative Phone',
    address: 'Address',
    address2: 'Address Line 2',
    city: 'City',
    state: 'Region',
    country: 'Country',
    deliveryDate: 'Preferred Delivery Date',
    deliveryInstructions: 'Delivery Instructions',
    giftMessage: 'Gift Message',
    orderNotes: 'Order Notes',
  };
  return labels[fieldName] || fieldName;
}

function OrderSummary({ settings }: { settings: CheckoutSettings }) {
  return (
    <Card className="p-6 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-200 rounded" />
            <div>
              <p className="font-medium">Sample Product</p>
              <p className="text-sm text-gray-500">Qty: 1</p>
            </div>
          </div>
          <span className="font-semibold">99.00 MAD</span>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>99.00 MAD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{settings.defaultShippingCost} MAD</span>
          </div>
          {settings.freeShippingThreshold && (
            <div className="text-xs text-green-600 py-1">
              Add {(settings.freeShippingThreshold - 99).toFixed(2)} MAD more for free shipping!
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{(99 + Number(settings.defaultShippingCost)).toFixed(2)} MAD</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
