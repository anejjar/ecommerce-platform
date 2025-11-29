'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setOrderType } from '@/lib/redux/features/posSlice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Package2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderType = 'DINE_IN' | 'TAKE_AWAY' | 'DELIVERY';

const orderTypes: { value: OrderType; label: string }[] = [
  { value: 'DINE_IN', label: 'Dine In' },
  { value: 'TAKE_AWAY', label: 'Take Away' },
  { value: 'DELIVERY', label: 'Deliver' },
];

interface POSHeaderProps {
  locationName?: string | null;
}

export function POSHeader({ locationName }: POSHeaderProps) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const currentOrderType = useAppSelector((state) => state.pos.orderType);
  const locationId = useAppSelector((state) => state.pos.locationId);

  return (
    <header className="h-20 border-b bg-background flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Package2 className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl">POS Terminal</span>
        </div>
        <div className="flex items-center gap-1 ml-4">
          {orderTypes.map((type) => (
            <Button
              key={type.value}
              variant={currentOrderType === type.value ? 'default' : 'outline'}
              size="lg"
              onClick={() => dispatch(setOrderType(type.value))}
              className={cn(
                'h-12 px-6 text-base font-semibold rounded-lg',
                currentOrderType === type.value && 'shadow-md'
              )}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        {locationId && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="text-sm font-semibold">{locationName || `ID: ${locationId.slice(0, 8)}...`}</div>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-12 px-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-sm font-semibold">{session?.user?.name || 'Admin'}</div>
                <div className="text-xs text-muted-foreground">Cashier</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

