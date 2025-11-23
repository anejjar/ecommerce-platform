'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Order {
  id: string;
  orderNumber: string;
  total: any;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  shippingAddress: {
    address1: string;
    address2: string | null;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  user: {
    name: string | null;
    email: string;
  } | null;
  guestEmail?: string | null;
  isGuest?: boolean;
  items: any[];
}

interface OrdersTableProps {
  orders: Order[];
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(orders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedIds.length === 0) return;

    const statusLabel = newStatus.charAt(0) + newStatus.slice(1).toLowerCase();
    if (!confirm(`Are you sure you want to mark ${selectedIds.length} order(s) as ${statusLabel}?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          data: { status: newStatus },
        }),
      });

      if (response.ok) {
        setSelectedIds([]);
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update orders');
      }
    } catch (error) {
      alert('An error occurred while updating orders');
    } finally {
      setIsProcessing(false);
    }
  };

  const isAllSelected = orders.length > 0 && selectedIds.length === orders.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < orders.length;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'default';
      case 'PROCESSING': return 'secondary';
      case 'PENDING': return 'outline';
      case 'CANCELLED': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PAID': return 'default';
      case 'PENDING': return 'outline';
      case 'FAILED': return 'destructive';
      case 'REFUNDED': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-950/20 dark:border-blue-900">
          <span className="text-sm font-medium">
            {selectedIds.length} order{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('PROCESSING')}
              disabled={isProcessing}
            >
              Mark as Processing
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('SHIPPED')}
              disabled={isProcessing}
            >
              Mark as Shipped
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('DELIVERED')}
              disabled={isProcessing}
            >
              Mark as Delivered
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusUpdate('CANCELLED')}
              disabled={isProcessing}
            >
              Mark as Cancelled
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected || (isSomeSelected ? "indeterminate" : false)}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(order.id)}
                    onCheckedChange={(checked) => handleSelectOne(order.id, !!checked)}
                    aria-label="Select row"
                  />
                </TableCell>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {order.user?.name || order.shippingAddress?.firstName
                        ? `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim()
                        : 'Guest'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.user?.email || order.guestEmail || 'N/A'}
                    </p>
                    {order.isGuest && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                        Guest Order
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {order.shippingAddress ? (
                    <div className="text-sm text-muted-foreground max-w-xs">
                      {order.shippingAddress.address1}
                      {order.shippingAddress.address2 && `, ${order.shippingAddress.address2}`}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      <br />
                      {order.shippingAddress.country}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No address</span>
                  )}
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>${order.total.toString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status) as any}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-primary hover:underline"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
