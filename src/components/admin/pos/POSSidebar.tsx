'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Home,
  ShoppingBag,
  BarChart3,
  Settings,
  RotateCcw,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const sidebarItems = [
  { icon: Home, label: 'Home', path: '/admin/pos' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/pos/orders' },
  { icon: BarChart3, label: 'Reports', path: '/admin/pos/reports' },
  { icon: Settings, label: 'Settings', path: '/admin/pos/settings' },
];

export function POSSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);

  const handleItemClick = (path: string) => {
    setActiveItem(path);
    router.push(path);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <aside className="w-16 border-r bg-background flex flex-col items-center py-4 gap-2">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
              'h-12 w-12 rounded-lg',
              isActive && 'bg-primary text-primary-foreground'
            )}
            onClick={() => handleItemClick(item.path)}
            title={item.label}
          >
            <Icon className="h-5 w-5" />
          </Button>
        );
      })}
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-lg"
        onClick={() => window.location.reload()}
        title="Refresh"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-lg"
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </aside>
  );
}

