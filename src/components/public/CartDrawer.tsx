'use client';

import { useRouter } from '@/navigation';
import { Link } from '@/navigation';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeCart, removeFromCart, updateQuantity } from '@/lib/redux/features/cartSlice';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCurrency } from '@/hooks/useCurrency';

export function CartDrawer() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const { format } = useCurrency();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer - Desktop: Right Side, Mobile: Bottom Sheet */}
      <div
        className={`fixed right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0 sm:translate-x-0 translate-y-0'
            : 'translate-x-full sm:translate-x-full translate-y-full sm:translate-y-0'
        } sm:top-0 bottom-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b bg-gradient-to-r from-amber-50 to-white">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {t('cart.title')}
              </h2>
              {itemCount > 0 && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')}
                </p>
              )}
            </div>
            <button
              onClick={() => dispatch(closeCart())}
              className="p-2 hover:bg-amber-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                <div className="relative mb-6">
                  <ShoppingBag className="w-20 h-20 text-gray-300 animate-pulse" />
                  <Sparkles className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('cart.emptyCart')}</h3>
                <p className="text-sm text-gray-600 mb-8 max-w-sm">{t('cart.addProducts')}</p>
                
                {/* Recommended Products */}
                {recommendedProducts.length > 0 && (
                  <div className="w-full max-w-sm">
                    <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      You might like
                    </p>
                    <div className="space-y-3">
                      {recommendedProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={() => dispatch(closeCart())}
                          className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors group"
                        >
                          <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-amber-300">
                                <span className="text-2xl">☕</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-amber-900 truncate text-sm">
                              {product.name}
                            </p>
                            <p className="text-sm font-bold text-amber-900">
                              {format(Number(product.price))}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/shop"
                      onClick={() => dispatch(closeCart())}
                      className="mt-6 block w-full"
                    >
                      <Button className="w-full bg-amber-800 hover:bg-amber-900">
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
                    className="flex gap-3 pb-4 border-b last:border-0 animate-in slide-in-from-right"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.productId || '#'}`}
                      onClick={() => dispatch(closeCart())}
                      className="relative w-20 h-20 bg-amber-50 rounded-lg overflow-hidden flex-shrink-0 group"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-300">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.productId || '#'}`}
                        onClick={() => dispatch(closeCart())}
                        className="block"
                      >
                        <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-amber-900 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      {item.variantName && (
                        <p className="text-xs text-gray-500 mb-1">{item.variantName}</p>
                      )}
                      <p className="text-sm font-semibold text-amber-900 mb-3">
                        {format(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-amber-100 rounded transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center active:scale-95"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-amber-900" />
                          </button>
                          <span className="w-8 text-center font-semibold text-amber-900">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-amber-100 rounded transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center active:scale-95"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-amber-900" />
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="ml-auto text-red-600 hover:text-red-700 text-xs font-medium transition-colors"
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-amber-900">
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
            <div className="border-t bg-gradient-to-t from-amber-50 to-white p-4 md:p-6 space-y-4 sticky bottom-0">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-gray-700">{t('cart.subtotal')}:</span>
                <span className="text-2xl font-bold text-amber-900">{format(subtotal)}</span>
              </div>

              <p className="text-xs text-gray-600 text-center">
                {t('cart.shippingTaxesCalculated')}
              </p>

              {/* Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold h-12 text-base shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  {t('cart.checkout')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleViewCart}
                  variant="outline"
                  className="w-full border-amber-300 text-amber-900 hover:bg-amber-50 h-11"
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
