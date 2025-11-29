'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Customer {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  _count?: {
    orders: number;
  };
}

interface CustomerSearchProps {
  onSelect: (customer: Customer | null) => void;
  selectedCustomer?: Customer | null;
  className?: string;
}

export function CustomerSearch({ onSelect, selectedCustomer, className }: CustomerSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (searchQuery.length < 2) {
      setCustomers([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/pos/customers?q=${encodeURIComponent(searchQuery)}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error('Error searching customers:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelect(null);
    setSearchQuery('');
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">Customer</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-between h-12',
              !selectedCustomer && 'text-muted-foreground'
            )}
          >
            {selectedCustomer ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedCustomer.image || ''} />
                  <AvatarFallback>
                    {selectedCustomer.name?.charAt(0) || selectedCustomer.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">
                  {selectedCustomer.name || selectedCustomer.email}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Search customer...</span>
              </div>
            )}
            {selectedCustomer && (
              <X
                className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search by name or email..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : customers.length === 0 && searchQuery.length >= 2 ? (
                <CommandEmpty>No customers found.</CommandEmpty>
              ) : customers.length === 0 ? (
                <CommandEmpty>Type at least 2 characters to search...</CommandEmpty>
              ) : (
                <CommandGroup>
                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.id}
                      onSelect={() => handleSelect(customer)}
                      className="flex items-center gap-3 p-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={customer.image || ''} />
                        <AvatarFallback>
                          {customer.name?.charAt(0) || customer.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{customer.name || 'No name'}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {customer.email}
                          {customer._count && customer._count.orders > 0 && (
                            <span> • {customer._count.orders} orders</span>
                          )}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

