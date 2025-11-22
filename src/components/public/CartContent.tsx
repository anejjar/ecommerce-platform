'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { removeFromCart, updateQuantity } from '@/lib/redux/features/cartSlice';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export function CartContent() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const total = subtotal + tax + shipping;

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-6 border-b last:border-b-0"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  {item.variantName && (
                    <p className="text-sm text-gray-500 mb-1">{item.variantName}</p>
                  )}
                  <p className="text-gray-600 mb-3">
                    ${item.price.toFixed(2)} {t('cart.each')}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 font-medium border-x">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">{t('cart.remove')}</span>
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-4">
            <Link href="/shop">
              <Button variant="outline">← {t('cart.continueShopping')}</Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">{t('cart.orderSummary')}</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.tax')} (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">{t('cart.free')}</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {subtotal < 50 && (
                <p className="text-xs text-gray-500">
                  {t('cart.freeShippingProgress', { amount: (50 - subtotal).toFixed(2) })}
                </p>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full">
                {t('cart.proceedToCheckout')}
              </Button>
            </Link>

            <div className="mt-4 space-y-2 text-xs text-gray-600">
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
