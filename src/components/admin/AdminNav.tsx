'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  name: string;
  href: string;
  requiresFeature?: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Categories', href: '/admin/categories' },
  { name: 'Reviews', href: '/admin/reviews' },
  { name: 'Discounts', href: '/admin/discounts' },
  { name: 'Email Campaigns', href: '/admin/marketing/email-campaigns', requiresFeature: 'email_campaigns' },
  { name: 'SEO Tools', href: '/admin/seo-tools', requiresFeature: 'seo_toolkit' },
];

const settingsPages = [
  { name: 'SEO', href: '/admin/settings/seo' },
  { name: 'Translations', href: '/admin/settings/translations' },
  { name: 'General', href: '/admin/settings/general' },
  { name: 'Email', href: '/admin/settings/email' },
  { name: 'Shipping', href: '/admin/settings/shipping' },
  { name: 'Social Media', href: '/admin/settings/social' },
  { name: 'Appearance', href: '/admin/settings/appearance' },
  { name: 'Stock Alerts', href: '/admin/settings/stock-alerts' },
];

export function AdminNav() {
  const pathname = usePathname();
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkFeatures = async () => {
      const featuresToCheck = navigation
        .filter(item => item.requiresFeature)
        .map(item => item.requiresFeature!);

      if (featuresToCheck.length === 0) return;

      const results = await Promise.all(
        featuresToCheck.map(async (feature) => {
          try {
            const response = await fetch(`/api/features/check?feature=${feature}`);
            const data = await response.json();
            return { feature, enabled: data.enabled };
          } catch (error) {
            return { feature, enabled: false };
          }
        })
      );

      const enabled = new Set(
        results.filter(r => r.enabled).map(r => r.feature)
      );
      setEnabledFeatures(enabled);
    };

    checkFeatures();
  }, []);

  const visibleNavigation = navigation.filter(item =>
    !item.requiresFeature || enabledFeatures.has(item.requiresFeature)
  );

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/admin/dashboard" className="text-xl font-bold">
                E-Commerce Admin
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {visibleNavigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium gap-1 ${pathname?.startsWith('/admin/settings')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    Settings
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {settingsPages.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="w-full cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Admin Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/admin/login' })}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
