'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import toast from 'react-hot-toast';
import { OrderNotes } from '@/components/admin/OrderNotes';
import { generatePackingSlip } from '@/lib/invoice-generator';
import { FileText, Package } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const statusOptions = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [invoiceFeatureEnabled, setInvoiceFeatureEnabled] = useState(false);
  const { format } = useCurrency();

  useEffect(() => {
    fetchOrder();
    checkInvoiceFeature();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setSelectedStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch order');
    } finally {
      setIsLoading(false);
    }
  };

  const checkInvoiceFeature = async () => {
    try {
      const response = await fetch('/api/features/enabled');
      if (response.ok) {
        const data = await response.json();
        setInvoiceFeatureEnabled(data.features?.includes('invoice_generator') || false);
      }
    } catch (error) {
      console.error('Failed to check invoice feature');
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      const response = await fetch(`/api/orders/${id}/invoice/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${order.orderNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Invoice downloaded successfully');
      } else {
        toast.error('Failed to generate invoice');
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to generate invoice');
    }
  };

  const handleDownloadPackingSlip = async () => {
    if (!order) return;
    try {
      await generatePackingSlip(order);
      toast.success('Packing slip downloaded successfully');
    } catch (error) {
      console.error('Failed to generate packing slip:', error);
      toast.error('Failed to generate packing slip');
    }
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        setOrder(updated);
        toast.success('Order status updated successfully');
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-gray-600 mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          {invoiceFeatureEnabled && (
            <>
              <Button
                variant="outline"
                onClick={handleDownloadInvoice}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadPackingSlip}
              >
                <Package className="w-4 h-4 mr-2" />
                Download Packing Slip
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Status</label>
              <Badge className={`ml-2 ${statusColors[order.status]}`}>
                {order.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Status</label>
              <Badge className={`ml-2 ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                  order.paymentStatus === 'REFUNDED' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                {order.paymentStatus}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Update Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleUpdateStatus}
              disabled={isUpdating || selectedStatus === order.status}
              className="w-full"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">
                {order.user?.name ||
                  (order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : 'Guest')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{order.user?.email || order.guestEmail || 'N/A'}</p>
            </div>
            {order.isGuest && (
              <div>
                <Badge className="bg-gray-100 text-gray-600">Guest Order</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            {order.shippingAddress ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p className="mt-2">Phone: {order.shippingAddress.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shipping address</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{format(Number(item.price))}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{format(Number(item.total))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 space-y-2 text-right">
            <div className="flex justify-end gap-4">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{format(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">{format(Number(order.tax))}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">{format(Number(order.shipping))}</span>
            </div>
            <div className="flex justify-end gap-4 text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{format(Number(order.total))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <OrderNotes orderId={id} />
    </div>
  );
}
