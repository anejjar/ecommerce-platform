'use client';

import Link from 'next/link';
import { User, Package, Settings, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountContentProps {
  user: {
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    _count: {
      orders: number;
    };
  };
}

export function AccountContent({ user }: AccountContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.name || 'User'}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.role === 'ADMIN' && (
              <div className="mt-2">
                <Link href="/admin">
                  <Button size="sm" variant="outline">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Package className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Total Orders</h3>
          <p className="text-3xl font-bold">{user._count.orders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Settings className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Account Status</h3>
          <p className="text-lg font-medium text-green-600">Active</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <User className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Account Type</h3>
          <p className="text-lg font-medium capitalize">{user.role.toLowerCase()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/account/orders">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Order History</h3>
              <p className="text-sm text-gray-600">
                View all your orders and track deliveries
              </p>
            </div>
          </Link>

          <Link href="/shop">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Continue Shopping</h3>
              <p className="text-sm text-gray-600">
                Browse our product catalog
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
