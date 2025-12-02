'use client';

import { Link } from '@/navigation';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { removeFromCart, updateQuantity } from '@/lib/redux/features/cartSlice';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/hooks/useCurrency';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { handleImageError } from '@/lib/image-utils';

export function CartContent() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { format } = useCurrency();
  const { theme } = useTheme();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const total = subtotal + tax + shipping;

  const primaryColor = theme?.colors?.primary ?? '#111827';

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart(itemId));
    toast.success(t('cart.itemRemoved'), { duration: 2000 });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove(itemId);
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
        <div className="max-w-md mx-auto text-center">
          <div className="bg-card border border-border rounded-lg p-12 md:p-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-medium mb-3">{t('cart.emptyCart')}</h2>
            <p className="text-muted-foreground mb-8">
              {t('cart.addProducts')}
            </p>
            <Link href="/shop">
              <Button size="lg" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>
                {t('cart.continueShopping')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
      <h1 className="text-3xl md:text-4xl font-medium mb-8 md:mb-12">{t('cart.title')}</h1>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-4 md:gap-6 p-6 animate-subtle-lift"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.productId || '#'}`}
                  className="relative w-24 h-24 md:w-28 md:h-28 bg-muted rounded-lg overflow-hidden flex-shrink-0 group"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="112px"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-dashed border-muted-foreground/20 rounded" />
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.productId || '#'}`}>
                    <h3 className="font-medium text-base md:text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  {item.variantName && (
                    <p className="text-sm text-muted-foreground mb-2">{item.variantName}</p>
                  )}
                  <p className="text-sm font-medium mb-4" style={{ color: primaryColor }}>
                    {format(item.price)} {t('cart.each')}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium border-x border-border min-w-[60px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-destructive hover:text-destructive/80 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">{t('cart.remove')}</span>
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-medium text-lg" style={{ color: primaryColor }}>
                    {format(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link href="/shop">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                {t('cart.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-6">{t('cart.orderSummary')}</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span className="font-medium">{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('cart.tax')} (10%)</span>
                <span className="font-medium">{format(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('cart.shipping')}</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">{t('cart.free')}</span>
                  ) : (
                    format(shipping)
                  )}
                </span>
              </div>
              {subtotal < 50 && (
                <p className="text-xs text-muted-foreground pt-2">
                  {t('cart.freeShippingProgress', { amount: format(50 - subtotal) })}
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between text-lg font-medium">
                <span>{t('cart.total')}</span>
                <span style={{ color: primaryColor }}>{format(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>
                {t('cart.proceedToCheckout')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
              <p>✓ {t('cart.trustBadges.secureCheckout')}</p>
              <p>✓ {t('cart.freeReturns')}</p>
              <p>✓ {t('cart.shippingTime')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
