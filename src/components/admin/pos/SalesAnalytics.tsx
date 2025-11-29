'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

interface ActiveOrder {
  id: string;
  orderNumber?: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export function SalesAnalytics() {
  const [currentPage, setCurrentPage] = useState(0);
  // Fetch active POS orders (not yet completed)
  const { data: ordersData, error, isLoading, mutate } = useSWR<ActiveOrder[]>(
    '/api/pos/orders?status=active',
    fetcher,
    {
      refreshInterval: 3000, // Poll every 3 seconds
      onError: (err) => {
        console.error('Error fetching POS orders:', err);
      },
    }
  );

  // Use the data directly (API already filters by status=active)
  const data = Array.isArray(ordersData) ? ordersData : [];

  useEffect(() => {
    // Refresh data periodically
    const interval = setInterval(() => {
      mutate();
    }, 3000);
    return () => clearInterval(interval);
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Sales Analytic</h2>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-64 animate-pulse">
              <CardContent className="p-4">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const orders = data || [];
  const ordersPerPage = 3;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = currentPage * ordersPerPage;
  const displayedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Sales Analytic {orders.length > 0 && `(${orders.length})`}
        </h2>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {displayedOrders.length > 0 ? (
          displayedOrders.map((order) => (
            <Card key={order.id} className="min-w-[240px] flex-shrink-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {order.orderNumber || `#${order.id.slice(-6)}`}
                  </CardTitle>
                  <Badge
                    variant={
                      order.status === 'READY' || order.status === 'DELIVERED'
                        ? 'default'
                        : 'secondary'
                    }
                    className="text-xs"
                  >
                    {order.status === 'READY' || order.status === 'DELIVERED' ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {order.status === 'READY' || order.status === 'DELIVERED'
                      ? 'Ready to serve'
                      : 'In Progress'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-3">
                  {order.itemCount} Items
                </div>
                <Button
                  size="sm"
                  variant={
                    order.status === 'READY' || order.status === 'DELIVERED'
                      ? 'default'
                      : 'outline'
                  }
                  className="w-full"
                >
                  {order.status === 'READY' || order.status === 'DELIVERED' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Ready to serve
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      In Progress
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="w-full">
            <CardContent className="p-6 text-center text-muted-foreground">
              No active orders
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

