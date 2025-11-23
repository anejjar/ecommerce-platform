'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { ShoppingCart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface RecoveryResult {
  status: string;
  discountCode?: string;
  message: string;
  redirectUrl: string;
}

export default function CartRecoveryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);
  const [result, setResult] = useState<RecoveryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recoverCart();
  }, []);

  const recoverCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/abandoned-cart/recover/${resolvedParams.token}`,
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to recover cart');
        return;
      }

      setResult(data);

      // Show success message with discount code if available
      if (data.discountCode) {
        toast.success(
          `Cart recovered! Use code ${data.discountCode} for 10% off!`,
          { duration: 5000 }
        );
      } else {
        toast.success('Cart recovered successfully!');
      }

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(data.redirectUrl || '/cart');
      }, 3000);
    } catch (err) {
      console.error('Error recovering cart:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Recovering Your Cart...</h2>
            <p className="text-gray-600">Please wait while we restore your items</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-center text-xl">
              Unable to Recover Cart
            </CardTitle>
            <CardDescription className="text-center">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Possible reasons:</strong>
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                <li>The recovery link has expired (older than 30 days)</li>
                <li>The cart has already been recovered</li>
                <li>The recovery link is invalid</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/shop')}
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => router.push('/cart')}
                variant="outline"
                className="flex-1"
              >
                View Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-xl">
              Cart Recovered Successfully!
            </CardTitle>
            <CardDescription className="text-center">
              Your items have been restored to your cart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.discountCode && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
                <p className="text-sm text-green-800 mb-2">
                  🎁 Special Offer for You!
                </p>
                <div className="bg-white rounded px-4 py-2 inline-block">
                  <p className="text-xs text-gray-600 mb-1">Discount Code:</p>
                  <p className="text-2xl font-bold text-green-600 tracking-wider">
                    {result.discountCode}
                  </p>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Save 10% on your order!
                </p>
              </div>
            )}

            <div className="text-center text-sm text-gray-600">
              <p>Redirecting you to checkout...</p>
              <div className="mt-2">
                <Loader2 className="h-5 w-5 text-gray-400 mx-auto animate-spin" />
              </div>
            </div>

            <Button
              onClick={() => router.push(result.redirectUrl || '/cart')}
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Go to Cart Now
            </Button>

            <div className="text-center">
              <Link
                href="/shop"
                className="text-sm text-blue-600 hover:underline"
              >
                Or continue shopping
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
