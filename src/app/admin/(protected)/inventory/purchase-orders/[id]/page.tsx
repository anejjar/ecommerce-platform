'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReceivePurchaseOrderDialog } from '@/components/admin/ReceivePurchaseOrderDialog';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  Package,
  Building,
  FileText,
  CheckCircle,
  Truck,
  XCircle,
  Printer,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: string;
  orderDate: string;
  expectedDate: string | null;
  receivedDate: string | null;
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  notes: string | null;
  supplier: {
    id: string;
    name: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitCost: string;
    total: string;
    receivedQuantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ProductInfo {
  id: string;
  name: string;
  sku: string | null;
  slug: string;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  RECEIVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export default function PurchaseOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [products, setProducts] = useState<Record<string, ProductInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/purchase-orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);

        // Fetch product details for all items
        const productIds = data.items.map((item: any) => item.productId);
        await fetchProducts(productIds);
      } else if (response.status === 404) {
        toast.error('Purchase order not found');
        router.push('/admin/inventory/purchase-orders');
      }
    } catch (error) {
      console.error('Failed to fetch purchase order:', error);
      toast.error('Failed to load purchase order details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (productIds: string[]) => {
    try {
      const promises = productIds.map((id) => fetch(`/api/products/${id}`));
      const responses = await Promise.all(promises);
      const productsData = await Promise.all(responses.map((r) => r.json()));

      const productsMap: Record<string, ProductInfo> = {};
      productsData.forEach((product) => {
        productsMap[product.id] = {
          id: product.id,
          name: product.name,
          sku: product.sku,
          slug: product.slug,
        };
      });

      setProducts(productsMap);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/purchase-orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchOrder();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An error occurred while updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!order) return;

    if (!confirm(`Are you sure you want to delete purchase order ${order.orderNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/purchase-orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Purchase order deleted successfully');
        router.push('/admin/inventory/purchase-orders');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete purchase order');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">Loading purchase order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-destructive">Purchase order not found</div>
      </div>
    );
  }

  const canEdit = order.status === 'DRAFT';
  const canConfirm = order.status === 'DRAFT';
  const canMarkShipped = order.status === 'PENDING' || order.status === 'CONFIRMED';
  const canReceive = order.status === 'SHIPPED';
  const canCancel = order.status !== 'RECEIVED' && order.status !== 'CANCELLED';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/admin/inventory/purchase-orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{order.orderNumber}</h1>
              <Badge className={statusColors[order.status] || ''}>
                {order.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">Purchase order details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          {canEdit && (
            <Link href={`/admin/inventory/purchase-orders/${orderId}/edit`}>
              <Button variant="outline">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
          {order.status === 'DRAFT' && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Status Actions */}
      {(canConfirm || canMarkShipped || canReceive || canCancel) && (
        <Card className="print:hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {canConfirm && (
                <Button onClick={() => updateStatus('PENDING')} disabled={isUpdating}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Order
                </Button>
              )}
              {canMarkShipped && (
                <Button onClick={() => updateStatus('SHIPPED')} disabled={isUpdating}>
                  <Truck className="w-4 h-4 mr-2" />
                  Mark as Shipped
                </Button>
              )}
              {canReceive && (
                <Button onClick={() => setIsReceiveDialogOpen(true)} disabled={isUpdating}>
                  <Package className="w-4 h-4 mr-2" />
                  Receive Items
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="destructive"
                  onClick={() => updateStatus('CANCELLED')}
                  disabled={isUpdating}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Supplier Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Supplier Name</p>
              <Link
                href={`/admin/inventory/suppliers/${order.supplier.id}`}
                className="text-primary hover:underline"
              >
                {order.supplier.name}
              </Link>
            </div>
            {order.supplier.contactName && (
              <div>
                <p className="text-sm font-medium">Contact Person</p>
                <p className="text-sm text-muted-foreground">{order.supplier.contactName}</p>
              </div>
            )}
            {order.supplier.email && (
              <div>
                <p className="text-sm font-medium">Email</p>
                <a href={`mailto:${order.supplier.email}`} className="text-sm text-primary hover:underline">
                  {order.supplier.email}
                </a>
              </div>
            )}
            {order.supplier.phone && (
              <div>
                <p className="text-sm font-medium">Phone</p>
                <a href={`tel:${order.supplier.phone}`} className="text-sm text-primary hover:underline">
                  {order.supplier.phone}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Order Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Order Date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.orderDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            {order.expectedDate && (
              <div>
                <p className="text-sm font-medium">Expected Delivery</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.expectedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
            {order.receivedDate && (
              <div>
                <p className="text-sm font-medium">Received Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.receivedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  {order.status === 'RECEIVED' && (
                    <TableHead className="text-right">Received</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => {
                  const product = products[item.productId];
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        {product ? (
                          <Link
                            href={`/admin/products/${product.slug}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {product.name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">Loading...</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product?.sku || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ${parseFloat(item.unitCost).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${parseFloat(item.total).toFixed(2)}
                      </TableCell>
                      {order.status === 'RECEIVED' && (
                        <TableCell className="text-right">
                          <Badge variant={item.receivedQuantity === item.quantity ? 'default' : 'secondary'}>
                            {item.receivedQuantity}
                          </Badge>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Order Summary */}
          <div className="mt-4 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span className="font-medium">${parseFloat(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span className="font-medium">${parseFloat(order.shipping).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Receive Dialog */}
      <ReceivePurchaseOrderDialog
        isOpen={isReceiveDialogOpen}
        onClose={() => setIsReceiveDialogOpen(false)}
        order={order}
        products={products}
        onSuccess={fetchOrder}
      />
    </div>
  );
}
