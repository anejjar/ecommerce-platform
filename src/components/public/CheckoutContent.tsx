'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Lock, ShoppingBag, MapPin, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { clearCart } from '@/lib/redux/features/cartSlice';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useCurrency } from '@/hooks/useCurrency';
import { RegionSelect } from './RegionSelect';
import { CitySelect } from './CitySelect';
import { AddressAutocomplete } from './AddressAutocomplete';
import { CheckoutSettings, DEFAULT_FIELD_ORDER } from '@/types/checkout-settings';
import { CountdownTimer } from '@/components/checkout/CountdownTimer';
import { FreeShippingBar } from '@/components/checkout/FreeShippingBar';
import { TestimonialsCarousel } from '@/components/checkout/TestimonialsCarousel';
import { RecentPurchasePopup } from '@/components/checkout/RecentPurchasePopup';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import {
  TrustBadges,
  SecuritySeals,
  MoneyBackGuarantee,
  CustomerServiceDisplay,
  TrustRating,
  OrderCountTicker,
} from '@/components/checkout/TrustElements';

export function CheckoutContent() {
  const t = useTranslations();
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { format } = useCurrency();

  // Feature flags
  const checkoutCustomizationEnabled = useFeatureFlag('checkout_customization');

  // Checkout settings
  const [checkoutSettings, setCheckoutSettings] = useState<CheckoutSettings | null>(null);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // Region and city selection
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');

  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    country: 'Morocco',
    phone: '',
    orderNotes: '',
    // Phase 2: Additional standard fields
    alternativePhone: '',
    deliveryInstructions: '',
    giftMessage: '',
    deliveryDate: '',
  });

  // Phase 2: Custom fields data
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, any>>({});

  // Order summary collapsible state
  const [orderSummaryCollapsed, setOrderSummaryCollapsed] = useState(false);

  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    id: string;
    code: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number;
    discountAmount: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);

  // Phase 1: Dynamic styling based on settings
  const pageStyles = useMemo(() => {
    if (!checkoutSettings || !checkoutCustomizationEnabled) return {};

    const styles: React.CSSProperties = {};

    // Font family
    const fontFamilyMap = {
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      inter: '"Inter", sans-serif',
      roboto: '"Roboto", sans-serif',
      opensans: '"Open Sans", sans-serif',
    };
    if (checkoutSettings.fontFamily) {
      styles.fontFamily = fontFamilyMap[checkoutSettings.fontFamily];
    }

    return styles;
  }, [checkoutSettings, checkoutCustomizationEnabled]);

  const containerClass = useMemo(() => {
    if (!checkoutSettings || !checkoutCustomizationEnabled) return 'container mx-auto px-4 py-8';
    const widthMap = {
      narrow: 'max-w-4xl mx-auto px-4 py-8',
      normal: 'container mx-auto px-4 py-8',
      wide: 'max-w-7xl mx-auto px-4 py-8',
    };
    return widthMap[checkoutSettings.pageWidth || 'normal'];
  }, [checkoutSettings, checkoutCustomizationEnabled]);

  const buttonClass = useMemo(() => {
    if (!checkoutSettings || !checkoutCustomizationEnabled) return '';
    const buttonStyleMap = {
      rounded: 'rounded-md',
      square: 'rounded-none',
      pill: 'rounded-full',
    };
    return buttonStyleMap[checkoutSettings.buttonStyle || 'rounded'];
  }, [checkoutSettings, checkoutCustomizationEnabled]);

  // Secondary color styles for borders, accents, and secondary elements
  const secondaryColorStyles = useMemo(() => {
    if (!checkoutSettings || !checkoutCustomizationEnabled || !checkoutSettings.secondaryColor) {
      return {};
    }
    return {
      borderColor: checkoutSettings.secondaryColor,
      color: checkoutSettings.secondaryColor,
    };
  }, [checkoutSettings, checkoutCustomizationEnabled]);

  // Field order - determines the order fields should be displayed
  // Note: Full implementation requires form refactoring to render fields dynamically
  const fieldOrder = useMemo(() => {
    if (checkoutCustomizationEnabled && checkoutSettings?.fieldOrder && checkoutSettings.fieldOrder.length > 0) {
      return checkoutSettings.fieldOrder;
    }
    return DEFAULT_FIELD_ORDER;
  }, [checkoutSettings, checkoutCustomizationEnabled]);

  // Phase 2: Helper functions for custom field labels and placeholders
  const getFieldLabel = (fieldName: string, defaultLabel: string) => {
    if (checkoutCustomizationEnabled && checkoutSettings?.fieldLabels && checkoutSettings.fieldLabels[fieldName as keyof typeof checkoutSettings.fieldLabels]) {
      return checkoutSettings.fieldLabels[fieldName as keyof typeof checkoutSettings.fieldLabels];
    }
    return defaultLabel;
  };

  const getFieldPlaceholder = (fieldName: string, defaultPlaceholder?: string) => {
    if (checkoutCustomizationEnabled && checkoutSettings?.fieldPlaceholders && checkoutSettings.fieldPlaceholders[fieldName as keyof typeof checkoutSettings.fieldPlaceholders]) {
      return checkoutSettings.fieldPlaceholders[fieldName as keyof typeof checkoutSettings.fieldPlaceholders];
    }
    return defaultPlaceholder || '';
  };

  // Fetch checkout settings
  useEffect(() => {
    fetchCheckoutSettings();
  }, []);

  const fetchCheckoutSettings = async () => {
    try {
      const response = await fetch('/api/checkout-settings');
      if (response.ok) {
        const data = await response.json();
        setCheckoutSettings(data);
      }
    } catch (error) {
      console.error('Error fetching checkout settings:', error);
    }
  };

  // Fetch saved addresses for logged-in users
  useEffect(() => {
    if (session?.user) {
      fetchSavedAddresses();
    }
  }, [session]);

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch('/api/account/addresses');
      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data || []);

        // Auto-select default address
        const defaultAddress = data.find((addr: any) => addr.isDefault);
        if (defaultAddress && !useNewAddress) {
          handleSelectSavedAddress(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
    }
  };

  const handleSelectSavedAddress = (addressId: string) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setUseNewAddress(false);
      setFormData({
        ...formData,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || '',
        address: address.address1,
        address2: address.address2 || '',
        city: address.city,
        state: address.state || '',
        country: address.country,
        phone: address.phone || '',
      });
    }
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId(null);
    setFormData({
      email: session?.user?.email || formData.email,
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      country: 'Morocco',
      phone: '',
      orderNotes: '',
    });
    setSelectedRegionId('');
  };

  const handleAddressAutocompleteSelect = (addressData: any) => {
    setFormData({
      ...formData,
      address: addressData.address,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 10;
  const totalBeforeDiscount = subtotal + tax + shipping;
  const total = appliedDiscount
    ? Math.max(0, totalBeforeDiscount - appliedDiscount.discountAmount)
    : totalBeforeDiscount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsCheckingDiscount(true);
    setDiscountError('');

    try {
      const response = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode,
          cartTotal: subtotal,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAppliedDiscount(data);
        toast.success(t('checkout.discountApplied'));
      } else {
        setDiscountError(data.error || t('checkout.invalidDiscount'));
        setAppliedDiscount(null);
      }
    } catch (error) {
      setDiscountError(t('checkout.failedToApplyDiscount'));
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

  // Render order summary content (reusable function)
  const renderOrderSummaryContent = () => (
    <>
      {/* Phase 4: Trust Badges - Sidebar Position */}
      {checkoutCustomizationEnabled && checkoutSettings?.trustBadges && checkoutSettings.trustBadges.length > 0 && (
        <TrustBadges
          badges={checkoutSettings.trustBadges.filter((b) => b.position === 'sidebar')}
        />
      )}

      {/* Phase 5: Upsell Products - Cart Position */}
      {checkoutCustomizationEnabled && 
       checkoutSettings?.showUpsells && 
       checkoutSettings.upsellProducts && 
       checkoutSettings.upsellProducts.length > 0 &&
       checkoutSettings.upsellPosition === 'cart' && (
        <UpsellProducts
          productIds={checkoutSettings.upsellProducts}
          title={checkoutSettings.upsellTitle || undefined}
          position="cart"
        />
      )}

      {/* Phase 5: Scarcity Message */}
      {checkoutCustomizationEnabled && checkoutSettings?.scarcityMessage && (
        <div
          className={`p-3 rounded-lg border ${checkoutSettings.urgencyBadgeStyle === 'danger'
            ? 'bg-red-50 border-red-200 text-red-800'
            : checkoutSettings.urgencyBadgeStyle === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}
        >
          <p className="text-sm font-medium">{checkoutSettings.scarcityMessage}</p>
        </div>
      )}

      {/* Phase 4: Security Seals */}
      {checkoutCustomizationEnabled && checkoutSettings?.showSecuritySeals && (
        <SecuritySeals />
      )}

      {/* Phase 4: Customer Service Display */}
      {checkoutCustomizationEnabled && checkoutSettings?.customerServiceDisplay && (
        <CustomerServiceDisplay
          text={checkoutSettings.customerServiceText || undefined}
          phone={checkoutSettings.customerServicePhone || undefined}
          email={checkoutSettings.customerServiceEmail || undefined}
        />
      )}

      {/* Cart Items */}
      <div className="space-y-3 mb-4 border-b pb-4">
        {cartItems.map((item) => (
          <div key={item.id}>
            <div className="flex gap-3">
              <div className="relative w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-sm text-gray-600">{t('checkout.qty')} {item.quantity}</p>

                {/* Phase 5: Low Stock Warning */}
                {checkoutCustomizationEnabled && checkoutSettings?.showLowStock &&
                  checkoutSettings.lowStockThreshold &&
                  item.stock &&
                  item.stock <= checkoutSettings.lowStockThreshold && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-orange-600 text-xs">⚠️</span>
                      <p className="text-xs text-orange-600 font-medium">
                        {checkoutSettings.lowStockText?.replace('X', item.stock.toString()) || `Only ${item.stock} left!`}
                      </p>
                    </div>
                  )}
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {format(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phase 5: Loyalty Points */}
      {checkoutCustomizationEnabled && checkoutSettings?.showLoyaltyPoints && checkoutSettings.loyaltyPointsText && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">{checkoutSettings.loyaltyPointsText}</p>
        </div>
      )}

      {/* Phase 5: Gift with Purchase */}
      {checkoutCustomizationEnabled && checkoutSettings?.showGiftWithPurchase &&
        checkoutSettings.giftThreshold &&
        subtotal >= checkoutSettings.giftThreshold && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-purple-600">🎁</span>
              <p className="text-sm text-purple-800">{checkoutSettings.giftDescription}</p>
            </div>
          </div>
        )}

      {/* Phase 5: Referral Discount */}
      {checkoutCustomizationEnabled && checkoutSettings?.referralDiscountEnabled && checkoutSettings.referralDiscountText && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <p className="text-sm text-indigo-800">{checkoutSettings.referralDiscountText}</p>
        </div>
      )}

      {/* Discount Code - Position controlled by Phase 5 settings */}
      <div className={`border-b pb-4 ${checkoutSettings?.discountFieldPosition === 'top' ? 'order-first' : checkoutSettings?.discountFieldPosition === 'bottom' ? 'order-last' : ''
        }`}>
        <Label htmlFor="discountCode" className="mb-2 block">
          {t('checkout.discountCode')}
        </Label>
        <div className="flex gap-2">
          <Input
            id="discountCode"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder={t('checkout.enterCode')}
            disabled={!!appliedDiscount}
          />
          {appliedDiscount ? (
            <Button
              type="button"
              variant="outline"
              onClick={removeDiscount}
              className="shrink-0"
              style={checkoutCustomizationEnabled && checkoutSettings?.secondaryColor ? {
                borderColor: checkoutSettings.secondaryColor,
                color: checkoutSettings.secondaryColor,
              } : {}}
            >
              {t('cart.remove')}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleApplyDiscount}
              disabled={isCheckingDiscount || !discountCode}
              className="shrink-0"
            >
              {t('checkout.apply')}
            </Button>
          )}
        </div>
        {discountError && (
          <p className="text-sm text-red-500 mt-1">{discountError}</p>
        )}
        {appliedDiscount && (
          <p className="text-sm text-green-600 mt-1">
            {t('checkout.discountAppliedLabel')} {appliedDiscount.code}
          </p>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('cart.subtotal')}</span>
          <span className="font-medium">{format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('cart.tax')} (10%)</span>
          <span className="font-medium">{format(tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('cart.shipping')}</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">{t('cart.free')}</span>
            ) : (
              format(shipping)
            )}
          </span>
        </div>
        {appliedDiscount && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>{t('checkout.discount')}</span>
            <span>-{format(appliedDiscount.discountAmount)}</span>
          </div>
        )}
      </div>

      <div 
        className="border-t pt-4 mb-6"
        style={checkoutCustomizationEnabled && checkoutSettings?.secondaryColor ? {
          borderTopColor: checkoutSettings.secondaryColor,
        } : {}}
      >
        <div className="flex justify-between text-lg font-bold">
          <span>{t('cart.total')}</span>
          <span>{format(total)}</span>
        </div>
      </div>

              {/* Enhanced Place Order Button */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  size="lg"
                  className={`w-full text-lg font-bold py-6 shadow-lg hover:shadow-xl transition-all ${buttonClass}`}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: checkoutSettings?.primaryColor || undefined,
                    borderColor: checkoutSettings?.primaryColor || undefined,
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      {t('checkout.placingOrder')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      {t('checkout.placeOrder')} - {format(total)}
                    </span>
                  )}
                </Button>
                
                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Secure Checkout</span>
                  <span className="text-gray-400">•</span>
                  <span>SSL Encrypted</span>
                </div>

                <div className="text-xs text-center text-gray-600">
                  <p>{t('checkout.agreeToTerms')}</p>
                  <p>
                    <Link href="/terms" className="underline hover:text-primary">
                      {t('footer.terms')}
                    </Link>
                  </p>
                </div>
              </div>
    </>
  );

  // Render order summary wrapper
  const renderOrderSummary = (sticky: boolean = true) => (
    <div className={`bg-white rounded-lg shadow-sm p-6 space-y-6 ${sticky ? 'sticky top-24' : ''}`}>
      <h2 className="text-xl font-bold">{t('cart.orderSummary')}</h2>
      {renderOrderSummaryContent()}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email for guest checkout
    if (!session && !formData.email) {
      toast.error(t('checkout.enterEmail'));
      return;
    }

    // Validate password if creating account
    if (!session && createAccount && password.length < 6) {
      toast.error(t('checkout.passwordLength'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variantId: item.variantId || null,
          })),
          shippingAddress: {
            address1: formData.address,
            address2: formData.address2,
            company: formData.company,
            city: formData.city,
            state: formData.state,
            country: formData.country,
          },
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            // Phase 2: Additional fields
            alternativePhone: formData.alternativePhone,
          },
          orderNotes: formData.orderNotes,
          // Phase 2: Additional standard fields
          deliveryInstructions: formData.deliveryInstructions,
          giftMessage: formData.giftMessage,
          deliveryDate: formData.deliveryDate,
          // Phase 2: Custom fields
          customFields: customFieldsData,
          isGuest: !session,
          createAccount: !session && createAccount,
          password: !session && createAccount ? password : undefined,
          discountCodeId: appliedDiscount?.id,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        dispatch(clearCart());
        toast.success(t('checkout.orderSuccess'));
        router.push(`/order-confirmation/${order.orderNumber}`);
      } else {
        const error = await response.json();
        toast.error(error.error || t('checkout.orderFailed'));
      }
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('cart.emptyCart')}</h2>
            <p className="text-gray-600 mb-6">
              {t('cart.addProducts')}
            </p>
            <Link href="/shop">
              <Button size="lg">{t('cart.continueShopping')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div style={pageStyles}>
      {/* Phase 5: Countdown Timer */}
      {checkoutCustomizationEnabled && checkoutSettings?.showCountdownTimer && checkoutSettings.countdownEndDate && (
        <CountdownTimer
          endDate={new Date(checkoutSettings.countdownEndDate)}
          text={checkoutSettings.countdownText || undefined}
        />
      )}

      {/* Phase 5: Promotional Banners - Top Position */}
      {checkoutCustomizationEnabled && checkoutSettings?.promotionalBanners?.filter((b) => b.position === 'top').map((banner) => (
        <div
          key={banner.id}
          className={`p-4 border-b ${banner.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : banner.type === 'warning'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : banner.type === 'danger'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
        >
          <div className="container mx-auto px-4 flex items-center justify-between">
            <p className="text-sm font-medium">{banner.message}</p>
            {banner.link && banner.linkText && (
              <Link href={banner.link} className="text-sm font-semibold underline">
                {banner.linkText}
              </Link>
            )}
          </div>
        </div>
      ))}

      <div className={containerClass}>
        {/* Logo Display - Phase 1 */}
        {checkoutCustomizationEnabled && checkoutSettings?.logoUrl && (
          <div className="mb-6 flex justify-center">
            <Image
              src={checkoutSettings.logoUrl}
              alt="Store Logo"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">{t('cart.checkout')}</h1>

        {/* Checkout Progress Indicator - Only show if customization enabled and configured */}
        {checkoutCustomizationEnabled && 
         checkoutSettings?.progressStyle && 
         checkoutSettings.progressStyle !== 'none' &&
         checkoutSettings?.checkoutLayout === 'multi-step' && (
          <div className="mb-8 bg-white rounded-lg p-4 md:p-6 shadow-sm">
            {checkoutSettings.progressStyle === 'steps' ? (
              <CheckoutProgress
                currentStep={0}
                steps={['Information', 'Shipping', 'Payment', 'Review']}
              />
            ) : checkoutSettings.progressStyle === 'bar' ? (
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Checkout Progress</span>
                  <span className="text-sm text-gray-500">Step 1 of 4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: '25%' }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Phase 4: Trust Rating & Order Count */}
        {checkoutCustomizationEnabled && (checkoutSettings?.showTrustRating || checkoutSettings?.showOrderCount) && (
          <div className="mb-6 flex flex-wrap gap-4 justify-center">
            {checkoutSettings.showTrustRating && checkoutSettings.trustRatingScore && (
              <TrustRating
                score={Number(checkoutSettings.trustRatingScore)}
                count={checkoutSettings.trustRatingCount || undefined}
              />
            )}
            {checkoutSettings.showOrderCount && (
              <OrderCountTicker text={checkoutSettings.orderCountText || undefined} />
            )}
          </div>
        )}

        {/* Phase 4: Trust Badges - Header Position */}
        {checkoutCustomizationEnabled && checkoutSettings?.trustBadges && checkoutSettings.trustBadges.length > 0 && (
          <TrustBadges
            badges={checkoutSettings.trustBadges.filter((b) => b.position === 'header')}
          />
        )}

        {/* Custom Checkout Banner */}
        {checkoutSettings?.checkoutBanner && (
          <div
            className={`mb-6 p-4 rounded-lg border ${checkoutSettings.checkoutBannerType === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : checkoutSettings.checkoutBannerType === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
          >
            <p>{checkoutSettings.checkoutBanner}</p>
          </div>
        )}

        {/* Phase 5: Free Shipping Progress Bar */}
        {checkoutCustomizationEnabled && checkoutSettings?.showFreeShippingBar && checkoutSettings.freeShippingThreshold && (
          <FreeShippingBar
            currentAmount={subtotal}
            threshold={checkoutSettings.freeShippingThreshold}
            text={checkoutSettings.freeShippingBarText || undefined}
          />
        )}

        {/* Phase 5: Promotional Banners - Middle Position */}
        {checkoutCustomizationEnabled && checkoutSettings?.promotionalBanners?.filter((b) => b.position === 'middle').map((banner) => (
          <div
            key={banner.id}
            className={`mb-6 p-4 rounded-lg border ${banner.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : banner.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : banner.type === 'danger'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{banner.message}</p>
              {banner.link && banner.linkText && (
                <Link href={banner.link} className="text-sm font-semibold underline ml-4">
                  {banner.linkText}
                </Link>
              )}
            </div>
          </div>
        ))}

      <form onSubmit={handleSubmit}>
        {/* Order Summary - Top Position */}
        {checkoutCustomizationEnabled && checkoutSettings?.orderSummaryPosition === 'top' && (
          <div className="mb-8">
            {renderOrderSummary(false)}
          </div>
        )}

        {/* Order Summary - Collapsible Position */}
        {checkoutCustomizationEnabled && checkoutSettings?.orderSummaryPosition === 'collapsible' && (
          <div className="mb-8 bg-white rounded-lg shadow-sm">
            <button
              type="button"
              onClick={() => setOrderSummaryCollapsed(!orderSummaryCollapsed)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-bold">{t('cart.orderSummary')}</h2>
              {orderSummaryCollapsed ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </button>
            {!orderSummaryCollapsed && (
              <div className="px-6 pb-6">
                {renderOrderSummaryContent()}
              </div>
            )}
          </div>
        )}

        <div className={`grid gap-8 ${
          checkoutCustomizationEnabled && checkoutSettings?.orderSummaryPosition === 'top' 
            ? 'lg:grid-cols-1' 
            : checkoutCustomizationEnabled && checkoutSettings?.orderSummaryPosition === 'collapsible'
            ? 'lg:grid-cols-1'
            : 'lg:grid-cols-3'
        }`}>
          {/* Checkout Form */}
          <div className={checkoutCustomizationEnabled && checkoutSettings?.orderSummaryPosition === 'right' ? 'lg:col-span-2' : checkoutCustomizationEnabled && (checkoutSettings?.orderSummaryPosition === 'top' || checkoutSettings?.orderSummaryPosition === 'collapsible') ? 'lg:col-span-1' : 'lg:col-span-2'}>
            {/* Contact Information */}
            <div 
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
              style={checkoutCustomizationEnabled && checkoutSettings?.secondaryColor ? {
                borderLeft: `4px solid ${checkoutSettings.secondaryColor}`
              } : {}}
            >
              <h2 className="text-xl font-bold mb-4">{t('checkout.contactInfo')}</h2>

              {!session && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="text-blue-800">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link href="/auth/signin?callbackUrl=/checkout" className="font-semibold underline">
                      {t('auth.signIn')}
                    </Link>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">{getFieldLabel('email', t('checkout.email'))}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={getFieldPlaceholder('email')}
                    required
                    readOnly={!!session?.user?.email}
                    className={`${buttonClass} focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                  />
                </div>

                {!session && createAccount && (
                  <div>
                    <Label htmlFor="password">{t('checkout.password')}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={createAccount}
                      minLength={6}
                    />
                  </div>
                )}

                {!session && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="createAccount"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      style={checkoutCustomizationEnabled && checkoutSettings?.secondaryColor ? {
                        accentColor: checkoutSettings.secondaryColor,
                      } : {}}
                    />
                    <Label htmlFor="createAccount" className="font-normal cursor-pointer">
                      {t('checkout.createAccount')}
                    </Label>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Addresses (for logged-in users) */}
            {session && savedAddresses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Saved Addresses</h2>
                  {savedAddresses.find(addr => addr.isDefault) && !useNewAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const defaultAddr = savedAddresses.find(addr => addr.isDefault);
                        if (defaultAddr) handleSelectSavedAddress(defaultAddr.id);
                      }}
                      className="gap-2"
                      style={checkoutCustomizationEnabled && checkoutSettings?.secondaryColor ? {
                        borderColor: checkoutSettings.secondaryColor,
                        color: checkoutSettings.secondaryColor,
                      } : {}}
                    >
                      <Zap className="h-4 w-4" />
                      Use Default Address
                    </Button>
                  )}
                </div>

                <RadioGroup
                  value={useNewAddress ? 'new' : selectedAddressId || ''}
                  onValueChange={(value) => {
                    if (value === 'new') {
                      handleUseNewAddress();
                    } else {
                      handleSelectSavedAddress(value);
                    }
                  }}
                  className="space-y-3"
                >
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === address.id && !useNewAddress
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => handleSelectSavedAddress(address.id)}
                    >
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={address.id} className="font-semibold cursor-pointer">
                            {address.firstName} {address.lastName}
                          </Label>
                          {address.isDefault && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address1}
                          {address.address2 && `, ${address.address2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        {address.phone && (
                          <p className="text-sm text-gray-600">{address.phone}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${useNewAddress
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={handleUseNewAddress}
                  >
                    <RadioGroupItem value="new" id="new-address" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="new-address" className="font-semibold cursor-pointer flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Use a new address
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Enter a different shipping address
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Shipping Address */}
            <div 
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6 transition-shadow hover:shadow-lg"
              style={checkoutCustomizationEnabled && checkoutSettings?.secondaryColor ? {
                borderLeft: `4px solid ${checkoutSettings.secondaryColor}`
              } : {}}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</span>
                {t('checkout.shippingAddress')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{getFieldLabel('firstName', t('checkout.firstName'))}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={getFieldPlaceholder('firstName')}
                    className={buttonClass}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{getFieldLabel('lastName', t('checkout.lastName'))}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={getFieldPlaceholder('lastName')}
                    className={buttonClass}
                    required
                  />
                </div>

                {/* Company Field - Conditional */}
                {checkoutSettings?.showCompany && (
                  <div className="col-span-2">
                    <Label htmlFor="company">{getFieldLabel('company', 'Company (optional)')}</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={getFieldPlaceholder('company')}
                      className={buttonClass}
                    />
                  </div>
                )}

                {/* Address Field - Conditional based on feature flag */}
                <div className="col-span-2">
                  {checkoutCustomizationEnabled ? (
                    <AddressAutocomplete
                      value={formData.address}
                      onChange={(value) => setFormData({ ...formData, address: value })}
                      onAddressSelect={handleAddressAutocompleteSelect}
                      label={t('checkout.address')}
                      required
                    />
                  ) : (
                    <>
                      <Label htmlFor="address">{t('checkout.address')}</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address"
                        required
                      />
                    </>
                  )}
                </div>

                {/* Region Selection - Only shown when autocomplete is disabled */}
                {!checkoutCustomizationEnabled && (
                  <div>
                    <RegionSelect
                      value={selectedRegionId}
                      onChange={(value) => {
                        setSelectedRegionId(value);
                        // Clear city when region changes
                        setFormData({ ...formData, city: '', state: value });
                      }}
                      label="Region"
                      required
                    />
                  </div>
                )}

                {/* City Field - Conditional based on feature flag */}
                <div>
                  {checkoutCustomizationEnabled ? (
                    <>
                      <Label htmlFor="city">{t('checkout.city')}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </>
                  ) : (
                    <CitySelect
                      value={formData.city}
                      onChange={(value) => setFormData({ ...formData, city: value })}
                      regionId={selectedRegionId}
                      label={t('checkout.city')}
                      required
                    />
                  )}
                </div>

                {/* State field - Only shown when autocomplete is enabled */}
                {checkoutCustomizationEnabled && (
                  <div>
                    <Label htmlFor="state">{t('checkout.state')}</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Address Line 2 - Conditional */}
                {checkoutSettings?.showAddressLine2 && (
                  <div className="col-span-2">
                    <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="address2"
                      name="address2"
                      value={formData.address2}
                      onChange={handleChange}
                    />
                  </div>
                )}


                {/* Phone Field - Conditional */}
                {checkoutSettings?.showPhone && (
                  <div>
                    <Label htmlFor="phone">{getFieldLabel('phone', 'Phone Number')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={getFieldPlaceholder('phone')}
                      className={buttonClass}
                      required={checkoutSettings?.requirePhone}
                    />
                  </div>
                )}

                {/* Phase 2: Alternative Phone - Conditional */}
                {checkoutSettings?.showAlternativePhone && (
                  <div>
                    <Label htmlFor="alternativePhone">{getFieldLabel('alternativePhone', 'Alternative Phone')}</Label>
                    <Input
                      id="alternativePhone"
                      name="alternativePhone"
                      type="tel"
                      value={formData.alternativePhone}
                      onChange={handleChange}
                      placeholder={getFieldPlaceholder('alternativePhone')}
                      className={buttonClass}
                    />
                  </div>
                )}

                {/* Phase 2: Delivery Date - Conditional */}
                {checkoutSettings?.showDeliveryDate && (
                  <div className="col-span-2">
                    <Label htmlFor="deliveryDate">{getFieldLabel('deliveryDate', 'Preferred Delivery Date')}</Label>
                    <Input
                      id="deliveryDate"
                      name="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      className={buttonClass}
                    />
                  </div>
                )}

                {/* Phase 2: Delivery Instructions - Conditional */}
                {checkoutSettings?.showDeliveryInstructions && (
                  <div className="col-span-2">
                    <Label htmlFor="deliveryInstructions">
                      {checkoutSettings?.deliveryInstructionsLabel || getFieldLabel('deliveryInstructions', 'Delivery Instructions')}
                    </Label>
                    <textarea
                      id="deliveryInstructions"
                      name="deliveryInstructions"
                      value={formData.deliveryInstructions}
                      onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                      className={`w-full min-h-[80px] px-3 py-2 border ${buttonClass}`}
                      placeholder={getFieldPlaceholder('deliveryInstructions', 'e.g., Leave at front door')}
                    />
                  </div>
                )}

                {/* Phase 2: Gift Message - Conditional */}
                {checkoutSettings?.showGiftMessage && (
                  <div className="col-span-2">
                    <Label htmlFor="giftMessage">
                      {checkoutSettings?.giftMessageLabel || getFieldLabel('giftMessage', 'Gift Message')}
                    </Label>
                    <textarea
                      id="giftMessage"
                      name="giftMessage"
                      value={formData.giftMessage}
                      onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
                      className={`w-full min-h-[80px] px-3 py-2 border ${buttonClass}`}
                      placeholder={getFieldPlaceholder('giftMessage', 'Add a personalized gift message...')}
                    />
                  </div>
                )}

                {/* Order Notes - Conditional */}
                {checkoutSettings?.enableOrderNotes && (
                  <div className="col-span-2">
                    <Label htmlFor="orderNotes">
                      {checkoutSettings?.orderNotesLabel || getFieldLabel('orderNotes', 'Order notes (optional)')}
                    </Label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                      className={`w-full min-h-[80px] px-3 py-2 border ${buttonClass}`}
                      placeholder={getFieldPlaceholder('orderNotes', 'Any special instructions for your order...')}
                    />
                  </div>
                )}

                {/* Phase 2: Custom Fields */}
                {checkoutSettings?.customFields && checkoutSettings.customFields.length > 0 && (
                  <>
                    {checkoutSettings.customFields.map((field) => (
                      <div key={field.id} className={field.type === 'textarea' || field.type === 'select' ? 'col-span-2' : ''}>
                        <Label htmlFor={field.id}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.type === 'text' && (
                          <Input
                            id={field.id}
                            value={customFieldsData[field.id] || ''}
                            onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.id]: e.target.value })}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={buttonClass}
                          />
                        )}
                        {field.type === 'textarea' && (
                          <textarea
                            id={field.id}
                            value={customFieldsData[field.id] || ''}
                            onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.id]: e.target.value })}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={`w-full min-h-[80px] px-3 py-2 border ${buttonClass}`}
                          />
                        )}
                        {field.type === 'select' && (
                          <select
                            id={field.id}
                            value={customFieldsData[field.id] || ''}
                            onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.id]: e.target.value })}
                            required={field.required}
                            className={`w-full px-3 py-2 border ${buttonClass}`}
                          >
                            <option value="">Select an option...</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                        {field.type === 'checkbox' && (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="checkbox"
                              id={field.id}
                              checked={customFieldsData[field.id] || false}
                              onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.id]: e.target.checked })}
                              className="w-4 h-4"
                              required={field.required}
                            />
                            <Label htmlFor={field.id} className="font-normal cursor-pointer">
                              {field.placeholder || field.label}
                            </Label>
                          </div>
                        )}
                        {field.type === 'date' && (
                          <Input
                            type="date"
                            id={field.id}
                            value={customFieldsData[field.id] || ''}
                            onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.id]: e.target.value })}
                            required={field.required}
                            className={buttonClass}
                          />
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Payment Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <Lock className="w-4 h-4 inline mr-1" />
                <strong>{t('common.note')}</strong> {t('checkout.paymentNote')}
              </p>
            </div>
          </div>

          {/* Order Summary - Right Position (default or when position is 'right') */}
          {(!checkoutCustomizationEnabled || !checkoutSettings?.orderSummaryPosition || checkoutSettings.orderSummaryPosition === 'right') && (
            <div className="lg:col-span-1">
              {renderOrderSummary(true)}
            </div>
          )}
        </div>
      </form>

      {/* Phase 5: Upsell Products - Below Form Position */}
      {checkoutCustomizationEnabled && 
       checkoutSettings?.showUpsells && 
       checkoutSettings.upsellProducts && 
       checkoutSettings.upsellProducts.length > 0 &&
       checkoutSettings.upsellPosition === 'below-form' && (
        <UpsellProducts
          productIds={checkoutSettings.upsellProducts}
          title={checkoutSettings.upsellTitle || undefined}
          position="below-form"
        />
      )}

      {/* Phase 5: Upsell Products - Modal Position */}
      {checkoutCustomizationEnabled && 
       checkoutSettings?.showUpsells && 
       checkoutSettings.upsellProducts && 
       checkoutSettings.upsellProducts.length > 0 &&
       checkoutSettings.upsellPosition === 'modal' && (
        <UpsellProducts
          productIds={checkoutSettings.upsellProducts}
          title={checkoutSettings.upsellTitle || undefined}
          position="modal"
        />
      )}

      {/* Phase 4: Money-Back Guarantee */}
      {checkoutCustomizationEnabled && checkoutSettings?.moneyBackGuarantee && (
        <div className="mt-8">
          <MoneyBackGuarantee text={checkoutSettings.moneyBackGuarantee} />
        </div>
      )}

      {/* Phase 4: Testimonials Carousel */}
      {checkoutCustomizationEnabled && checkoutSettings?.showTestimonials &&
        checkoutSettings.testimonials &&
        checkoutSettings.testimonials.length > 0 && (
          <div className="mt-8">
            <TestimonialsCarousel testimonials={checkoutSettings.testimonials} />
          </div>
        )}

      {/* Phase 4: Trust Badges - Footer Position */}
      {checkoutCustomizationEnabled && checkoutSettings?.trustBadges && checkoutSettings.trustBadges.length > 0 && (
        <div className="mt-8">
          <TrustBadges
            badges={checkoutSettings.trustBadges.filter((b) => b.position === 'footer')}
          />
        </div>
      )}

      {/* Phase 5: Promotional Banners - Bottom Position */}
      {checkoutCustomizationEnabled && checkoutSettings?.promotionalBanners?.filter((b) => b.position === 'bottom').map((banner) => (
        <div
          key={banner.id}
          className={`mt-6 p-4 rounded-lg border ${banner.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : banner.type === 'warning'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : banner.type === 'danger'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{banner.message}</p>
            {banner.link && banner.linkText && (
              <Link href={banner.link} className="text-sm font-semibold underline ml-4">
                {banner.linkText}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Phase 4: Recent Purchase Popup */}
    {checkoutCustomizationEnabled && checkoutSettings?.showRecentPurchases && (
      <RecentPurchasePopup delay={checkoutSettings.recentPurchaseDelay || 5000} />
    )}
    </div>
  );
}
