'use client';

import { Link } from '@/navigation';
import { User, Package, Settings, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('account.dashboard')}</h1>

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
              {t('account.memberSince')} {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.role === 'ADMIN' && (
              <div className="mt-2">
                <Link href="/admin">
                  <Button size="sm" variant="outline">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    {t('header.adminPanel')}
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
          <h3 className="font-semibold text-lg mb-1">{t('account.totalOrders')}</h3>
          <p className="text-3xl font-bold">{user._count.orders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Settings className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">{t('account.accountStatus')}</h3>
          <p className="text-lg font-medium text-green-600">{t('account.active')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <User className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-lg mb-1">{t('account.accountType')}</h3>
          <p className="text-lg font-medium capitalize">{user.role.toLowerCase()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">{t('account.quickActions')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/account/orders">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">{t('account.orderHistory')}</h3>
              <p className="text-sm text-gray-600">
                {t('account.viewOrderHistoryDesc')}
              </p>
            </div>
          </Link>

          <Link href="/shop">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">{t('cart.continueShopping')}</h3>
              <p className="text-sm text-gray-600">
                {t('account.browseCatalogDesc')}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
