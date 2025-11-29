'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HeldOrder {
  id: string;
  orderNumber: string;
  orderType: string;
  total: number;
  status: string;
  location: {
    id: string;
    name: string;
  } | null;
  cashier: {
    id: string;
    user: {
      name: string | null;
    } | null;
  } | null;
  customer: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export function HeldOrdersList() {
  const locationId = useAppSelector((state) => state.pos.locationId);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<HeldOrder | null>(null);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);

  useEffect(() => {
    fetchHeldOrders();
    // Refresh every 5 seconds
    const interval = setInterval(fetchHeldOrders, 5000);
    return () => clearInterval(interval);
  }, [locationId]);

  const fetchHeldOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (locationId) {
        params.append('locationId', locationId);
      }

      const response = await fetch(`/api/pos/orders/held?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setHeldOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching held orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResume = async (order: HeldOrder) => {
    try {
      const response = await fetch(`/api/pos/orders/${order.id}/resume`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Order resumed');
        fetchHeldOrders();
        setIsResumeDialogOpen(false);
        setSelectedOrder(null);
        // TODO: Load order into cart
      } else {
        toast.error('Failed to resume order');
      }
    } catch (error) {
      console.error('Error resuming order:', error);
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this held order?')) return;

    try {
      const response = await fetch(`/api/pos/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Order deleted');
        fetchHeldOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('An error occurred');
    }
  };

  if (heldOrders.length === 0 && !isLoading) {
    return null;
  }

  return (
    <>
      <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <h3 className="font-semibold text-sm">Held Orders ({heldOrders.length})</h3>
          </div>
        </div>
        <ScrollArea className="max-h-[200px]">
          <div className="space-y-2">
            {heldOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-2 bg-background rounded border hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-semibold truncate">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    ${order.total.toFixed(2)} • {format(new Date(order.createdAt), 'HH:mm')}
                  </p>
                  {order.customer && (
                    <p className="text-xs text-muted-foreground truncate">
                      {order.customer.name || order.customer.email}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsResumeDialogOpen(true);
                    }}
                    title="Resume order"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(order.id)}
                    title="Delete order"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resume Held Order</DialogTitle>
            <DialogDescription>
              This will restore the order to active status. You can then complete the payment.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order:</span>
                <span className="font-semibold">{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold">${selectedOrder.total.toFixed(2)}</span>
              </div>
              {selectedOrder.customer && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold">
                    {selectedOrder.customer.name || selectedOrder.customer.email}
                  </span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResumeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedOrder && handleResume(selectedOrder)}
            >
              Resume Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

