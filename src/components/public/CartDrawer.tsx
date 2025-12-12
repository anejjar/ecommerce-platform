'use client';

import { useRouter } from '@/navigation';
import { Link } from '@/navigation';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeCart, removeFromCart, updateQuantity } from '@/lib/redux/features/cartSlice';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/image-utils';

export function CartDrawer() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const { theme } = useTheme();
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const { format } = useCurrency();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const primaryColor = theme?.colors?.primary ?? '#111827';

  // Fetch recommended products when cart is empty
  useEffect(() => {
    if (isOpen && items.length === 0) {
      fetchRecommendedProducts();
    }
  }, [isOpen, items.length]);

  const fetchRecommendedProducts = async () => {
    try {
      const response = await fetch('/api/products/public-search?q=&limit=4');
      if (response.ok) {
        const data = await response.json();
        setRecommendedProducts(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    router.push('/checkout');
  };

  const handleViewCart = () => {
    dispatch(closeCart());
    router.push('/cart');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-lg z-50 transform transition-transform duration-300 ease-in-out',
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full sm:translate-x-full',
          'sm:top-0 bottom-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-medium">
                {t('cart.title')}
              </h2>
              {itemCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')}
                </p>
              )}
            </div>
            <button
              onClick={() => dispatch(closeCart())}
              className="p-2 hover:bg-muted rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                <div className="mb-6">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t('cart.emptyCart')}</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm">{t('cart.addProducts')}</p>
                
                {/* Recommended Products */}
                {recommendedProducts.length > 0 && (
                  <div className="w-full max-w-sm">
                    <p className="text-sm font-medium mb-4">
                      You might like
                    </p>
                    <div className="space-y-3">
                      {recommendedProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={() => dispatch(closeCart())}
                          className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
                        >
                          <div className="relative w-16 h-16 bg-background rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.images[0]?.url || PLACEHOLDER_PRODUCT_IMAGE}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="64px"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = PLACEHOLDER_PRODUCT_IMAGE;
                              }}
                              unoptimized={product.images[0]?.url?.startsWith('data:') || false}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </p>
                            <p className="text-sm font-medium mt-0.5" style={{ color: primaryColor }}>
                              {format(Number(product.price))}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/shop"
                      onClick={() => dispatch(closeCart())}
                      className="mt-6 block w-full"
                    >
                      <Button className="w-full" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>
                        {t('shop.browseAll')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border last:border-0 animate-subtle-lift"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.productId || '#'}`}
                      onClick={() => dispatch(closeCart())}
                      className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 group"
                    >
                      <Image
                        src={item.image || PLACEHOLDER_PRODUCT_IMAGE}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="80px"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = PLACEHOLDER_PRODUCT_IMAGE;
                        }}
                        unoptimized={item.image?.startsWith('data:') || false}
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.productId || '#'}`}
                        onClick={() => dispatch(closeCart())}
                        className="block"
                      >
                        <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground mb-2">{item.variantName}</p>
                      )}
                      <p className="text-sm font-medium mb-3" style={{ color: primaryColor }}>
                        {format(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-background rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-background rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="ml-auto text-destructive hover:text-destructive/80 text-xs font-medium transition-colors"
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-sm" style={{ color: primaryColor }}>
                        {format(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border bg-card p-6 space-y-4 sticky bottom-0">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">{t('cart.subtotal')}:</span>
                <span className="text-xl font-medium" style={{ color: primaryColor }}>{format(subtotal)}</span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {t('cart.shippingTaxesCalculated')}
              </p>

              {/* Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                  style={{ backgroundColor: primaryColor, color: '#ffffff' }}
                >
                  {t('cart.checkout')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleViewCart}
                  variant="outline"
                  className="w-full h-11"
                  size="lg"
                >
                  {t('cart.viewCart')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
