'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Mail, Clock, DollarSign, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AbandonedCart {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  guestName: string | null;
  cartSnapshot: string;
  totalValue: number;
  status: string;
  abandonedAt: Date;
  recoveredAt: Date | null;
  recoveryToken: string;
  discountCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    email: string;
  } | null;
  emails: {
    id: string;
    emailType: string;
    sentAt: Date;
  }[];
}

interface Stats {
  total: number;
  abandoned: number;
  recovered: number;
  expired: number;
  totalValue: number;
  recoveredValue: number;
  recoveryRate: number;
}

const statusColors: Record<string, string> = {
  ABANDONED: 'bg-yellow-100 text-yellow-800',
  RECOVERED: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

export default function AbandonedCartsPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')
    ) {
      router.push('/admin/dashboard');
    } else {
      fetchCarts();
      fetchStats();
    }
  }, [session, sessionStatus, router, filter]);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const url =
        filter === 'all'
          ? '/api/admin/abandoned-carts'
          : `/api/admin/abandoned-carts?status=${filter.toUpperCase()}`;
      const response = await fetch(url);

      if (response.status === 404) {
        toast.error('Abandoned cart feature is not enabled');
        router.push('/admin/dashboard');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch abandoned carts');

      const data = await response.json();
      setCarts(data);
    } catch (error) {
      console.error('Error fetching abandoned carts:', error);
      toast.error('Failed to load abandoned carts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/abandoned-carts/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCopyRecoveryLink = (token: string) => {
    const url = `${window.location.origin}/cart/recover/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Recovery link copied to clipboard!');
  };

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const filteredCarts = carts.filter((cart) => {
    if (filter === 'all') return true;
    return cart.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Abandoned Carts</h1>
          <p className="text-gray-600 mt-2">
            Track and recover abandoned shopping carts
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Carts</SelectItem>
              <SelectItem value="abandoned">Abandoned</SelectItem>
              <SelectItem value="recovered">Recovered</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => fetchCarts()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Abandoned
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.abandoned}</div>
              <p className="text-xs text-muted-foreground">
                ${stats.totalValue.toFixed(2)} in potential revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recovered
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.recovered}
              </div>
              <p className="text-xs text-muted-foreground">
                ${stats.recoveredValue.toFixed(2)} recovered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recovery Rate
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.recoveryRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expired
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats.expired}
              </div>
              <p className="text-xs text-muted-foreground">
                Older than 30 days
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Carts List */}
      {filteredCarts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No abandoned carts found</p>
            <p className="text-sm text-gray-400">
              {filter !== 'all'
                ? `No ${filter} carts at this time`
                : 'Abandoned carts will appear here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCarts.map((cart) => {
            const cartItems = JSON.parse(cart.cartSnapshot);
            const customerEmail = cart.user?.email || cart.guestEmail;
            const customerName = cart.user?.name || cart.guestName || 'Guest';

            return (
              <Card key={cart.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <span>{customerName}</span>
                        <Badge className={statusColors[cart.status]}>
                          {cart.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {customerEmail} • Abandoned{' '}
                        {formatDistanceToNow(new Date(cart.abandonedAt), {
                          addSuffix: true,
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        ${Number(cart.totalValue).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cartItems.length} item(s)
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Cart Items</h4>
                      <div className="space-y-2">
                        {cartItems.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Email History</h4>
                      <div className="space-y-2">
                        {cart.emails.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No emails sent yet
                          </p>
                        ) : (
                          cart.emails.map((email) => (
                            <div key={email.id} className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {email.emailType.replace('_', ' ')}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {formatDistanceToNow(new Date(email.sentAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {cart.discountCode && (
                        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                          <p className="text-xs text-green-600 mb-1">
                            Discount Code Offered:
                          </p>
                          <p className="text-sm font-bold text-green-700">
                            {cart.discountCode}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {cart.status === 'ABANDONED' && (
                    <div className="flex gap-2 mt-6 pt-4 border-t">
                      <Button
                        onClick={() => handleCopyRecoveryLink(cart.recoveryToken)}
                        variant="outline"
                        size="sm"
                      >
                        Copy Recovery Link
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
