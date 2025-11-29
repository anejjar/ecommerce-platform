'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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
import { Loader2, Package, Download, RefreshCw, Truck, Clock } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface ShippingInfo {
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  currency?: string;
  createdAt: string;
  shippingInfo?: ShippingInfo;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: Package },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: Package },
  // Uppercase variants (from database)
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: Package },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: Package },
};

// Default status config for unknown statuses
const defaultStatusConfig = { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Package };

// Helper function to get status config with fallback
const getStatusConfig = (status: string) => {
  return statusConfig[status] || statusConfig[status.toLowerCase()] || defaultStatusConfig;
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = filterStatus === 'all'
        ? '/api/account/orders'
        : `/api/account/orders?status=${filterStatus}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId: string) => {
    try {
      setReorderingId(orderId);
      const response = await fetch(`/api/account/orders/${orderId}/reorder`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reorder');
      }

      const data = await response.json();
      toast.success('Items added to cart!');

      // Optionally redirect to cart
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } catch (error) {
      toast.error('Failed to reorder. Please try again.');
      console.error('Error reordering:', error);
    } finally {
      setReorderingId(null);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await fetch('/api/account/orders/export?format=csv');

      if (!response.ok) {
        throw new Error('Failed to export orders');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Orders exported successfully!');
    } catch (error) {
      toast.error('Failed to export orders');
      console.error('Error exporting orders:', error);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency?: string) => {
    // Default to USD if currency is not provided or invalid
    const validCurrency = currency && currency.trim() ? currency.toUpperCase() : 'USD';
    
    // Validate currency code (must be 3 letters)
    const currencyCode = /^[A-Z]{3}$/.test(validCurrency) ? validCurrency : 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const renderDeliveryTimeline = (order: Order) => {
    if (!order.shippingInfo || order.status !== 'shipped') {
      return null;
    }

    const { trackingNumber, carrier, estimatedDelivery } = order.shippingInfo;

    return (
      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold text-purple-900">Tracking Information</h4>
        </div>
        <div className="space-y-1 text-sm">
          {carrier && (
            <p>
              <span className="font-medium">Carrier:</span> {carrier}
            </p>
          )}
          {trackingNumber && (
            <p>
              <span className="font-medium">Tracking Number:</span>{' '}
              <code className="bg-purple-100 px-2 py-1 rounded">{trackingNumber}</code>
            </p>
          )}
          {estimatedDelivery && (
            <p>
              <span className="font-medium">Estimated Delivery:</span>{' '}
              {formatDate(estimatedDelivery)}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-gray-600 mt-1">View and manage your orders</p>
        </div>
        <Button
          onClick={handleExport}
          disabled={exporting || orders.length === 0}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {exporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Orders
            </>
          )}
        </Button>
      </div>

      <div className="mb-6">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6 text-center">
              {filterStatus === 'all'
                ? "You haven't placed any orders yet."
                : `No ${filterStatus} orders found.`}
            </p>
            <Button onClick={() => router.push('/products')}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusConfig(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <CardDescription>
                        Placed on {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${statusInfo.color} flex items-center gap-1`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 pb-3 border-b last:border-b-0"
                        >
                          <img
                            src={item.productImage || '/placeholder.png'}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">
                              {item.productName}
                            </h4>
                            {item.variant && (
                              <p className="text-sm text-gray-600">
                                {item.variant}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × {formatCurrency(item.price, order.currency)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="pt-3 border-t">
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-700">
                          {order.shippingAddress.fullName}
                          <br />
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 && (
                            <>
                              <br />
                              {order.shippingAddress.addressLine2}
                            </>
                          )}
                          <br />
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.postalCode}
                          <br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    )}

                    {/* Delivery Timeline */}
                    {renderDeliveryTimeline(order)}

                    {/* Order Total and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Order Total</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(order.total, order.currency)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/account/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleReorder(order.id)}
                          disabled={
                            reorderingId === order.id ||
                            order.status === 'cancelled'
                          }
                        >
                          {reorderingId === order.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reorder
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
