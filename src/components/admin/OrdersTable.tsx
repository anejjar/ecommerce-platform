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
  } | null;
  user: {
    name: string | null;
    email: string;
  };
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

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = isSomeSelected;
                  }
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded"
              />
            </TableHead>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Shipping Address</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(order.id)}
                  onChange={(e) => handleSelectOne(order.id, e.target.checked)}
                  className="rounded"
                />
              </TableCell>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.user.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{order.user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                {order.shippingAddress ? (
                  <div className="text-sm text-gray-600 max-w-xs">
                    {order.shippingAddress.address1}
                    {order.shippingAddress.address2 && `, ${order.shippingAddress.address2}`}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    <br />
                    {order.shippingAddress.country}
                  </div>
                ) : (
                  <span className="text-gray-400">No address</span>
                )}
              </TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell>${order.total.toString()}</TableCell>
              <TableCell>
                <Badge className={statusColors[order.status]}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={paymentStatusColors[order.paymentStatus]}>
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
