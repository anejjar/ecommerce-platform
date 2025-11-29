'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  MapPin,
  CreditCard,
  Settings,
  Download,
  UserX,
  ShoppingBag,
} from 'lucide-react';

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchOrderStats();
    }
  }, [status, router]);

  const fetchOrderStats = async () => {
    try {
      const response = await fetch('/api/account/orders/stats');
      if (response.ok) {
        const data = await response.json();
        setOrderStats(data);
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-gray-600">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      {/* Quick Stats */}
      {orderStats && (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.processing}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.shipped}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.delivered}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Account Management Links */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/account/orders">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Orders</CardTitle>
                  <p className="text-sm text-gray-600">View and track orders</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account/addresses">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Address Book</CardTitle>
                  <p className="text-sm text-gray-600">Manage addresses</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account/payment-methods">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Payment Methods</CardTitle>
                  <p className="text-sm text-gray-600">Saved payments</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account/preferences">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Preferences</CardTitle>
                  <p className="text-sm text-gray-600">Communication settings</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account/orders?export=true">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Download className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Export Data</CardTitle>
                  <p className="text-sm text-gray-600">Download order history</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account/delete">
          <Card className="hover:border-red-400 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Delete Account</CardTitle>
                  <p className="text-sm text-gray-600">Request account deletion</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
