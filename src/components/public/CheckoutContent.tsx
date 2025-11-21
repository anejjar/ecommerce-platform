'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { clearCart } from '@/lib/redux/features/cartSlice';
import toast from 'react-hot-toast';

export function CheckoutContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    phone: '',
  });

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
        toast.success('Discount applied!');
      } else {
        setDiscountError(data.error || 'Invalid discount code');
        setAppliedDiscount(null);
      }
    } catch (error) {
      setDiscountError('Failed to apply discount');
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email for guest checkout
    if (!session && !formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    // Validate password if creating account
    if (!session && createAccount && password.length < 6) {
      toast.error('Password must be at least 6 characters');
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
            city: formData.city,
            state: formData.state,
            postalCode: formData.zip,
            country: formData.country,
          },
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          isGuest: !session,
          createAccount: !session && createAccount,
          password: !session && createAccount ? password : undefined,
          discountCodeId: appliedDiscount?.id,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push(`/order-confirmation/${order.orderNumber}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
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
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Add some products before checking out!
            </p>
            <Link href="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>

              {!session && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="text-blue-800">
                    Already have an account?{' '}
                    <Link href="/auth/signin?callbackUrl=/checkout" className="font-semibold underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly={!!session?.user?.email}
                  />
                </div>

                {!session && createAccount && (
                  <div>
                    <Label htmlFor="password">Password * (min 6 characters)</Label>
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
                    />
                    <Label htmlFor="createAccount" className="font-normal cursor-pointer">
                      Create an account for faster checkout next time
                    </Label>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">Postal Code *</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <Lock className="w-4 h-4 inline mr-1" />
                <strong>Note:</strong> Payment processing is not yet implemented. This is
                a demo checkout flow. Your order will be created with "PENDING" payment
                status.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 border-b pb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
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
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-4 border-b pb-4">
                <Label htmlFor="discountCode" className="mb-2 block">
                  Discount Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="discountCode"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter code"
                    disabled={!!appliedDiscount}
                  />
                  {appliedDiscount ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeDiscount}
                      className="shrink-0"
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyDiscount}
                      disabled={isCheckingDiscount || !discountCode}
                      className="shrink-0"
                    >
                      Apply
                    </Button>
                  )}
                </div>
                {discountError && (
                  <p className="text-sm text-red-500 mt-1">{discountError}</p>
                )}
                {appliedDiscount && (
                  <p className="text-sm text-green-600 mt-1">
                    Discount applied: {appliedDiscount.code}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-${appliedDiscount.discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>

              <div className="mt-4 text-xs text-center text-gray-600">
                <p>By placing your order, you agree to our</p>
                <p>
                  <Link href="/terms" className="underline">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
