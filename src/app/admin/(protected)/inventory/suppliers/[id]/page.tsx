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
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe,
  MapPin,
  ShoppingCart,
  Package,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Supplier {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  purchaseOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: string;
    orderDate: string;
    expectedDate: string | null;
  }>;
  stockHistory: Array<{
    id: string;
    changeType: string;
    quantityChange: number;
    createdAt: string;
    product: {
      name: string;
      sku: string | null;
      slug: string;
    } | null;
  }>;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  RECEIVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export default function SupplierDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (supplierId) {
      fetchSupplier();
    }
  }, [supplierId]);

  const fetchSupplier = async () => {
    try {
      const response = await fetch(`/api/admin/suppliers/${supplierId}`);
      if (response.ok) {
        const data = await response.json();
        setSupplier(data);
      } else if (response.status === 404) {
        toast.error('Supplier not found');
        router.push('/admin/inventory/suppliers');
      }
    } catch (error) {
      console.error('Failed to fetch supplier:', error);
      toast.error('Failed to load supplier details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!supplier) return;

    if (!confirm(`Are you sure you want to delete ${supplier.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/suppliers/${supplierId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Supplier deleted successfully');
        router.push('/admin/inventory/suppliers');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete supplier');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">Loading supplier details...</div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-destructive">Supplier not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/inventory/suppliers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
              <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
                {supplier.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">Supplier details and history</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/inventory/suppliers/${supplierId}/edit`}>
            <Button variant="outline">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {supplier.contactName && (
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-muted-foreground">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">{supplier.contactName}</p>
                </div>
              </div>
            )}

            {supplier.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href={`mailto:${supplier.email}`} className="text-sm text-primary hover:underline">
                    {supplier.email}
                  </a>
                </div>
              </div>
            )}

            {supplier.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a href={`tel:${supplier.phone}`} className="text-sm text-primary hover:underline">
                    {supplier.phone}
                  </a>
                </div>
              </div>
            )}

            {supplier.website && (
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {supplier.website}
                  </a>
                </div>
              </div>
            )}

            {supplier.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{supplier.address}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(supplier.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {supplier.notes ? (
              <div>
                <p className="text-sm font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{supplier.notes}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No additional notes</p>
            )}

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Purchase Orders</p>
                  <p className="text-2xl font-bold">{supplier.purchaseOrders.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Stock Restocks</p>
                  <p className="text-2xl font-bold">{supplier.stockHistory.length}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href={`/admin/inventory/purchase-orders/new?supplierId=${supplierId}`}>
                <Button className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Create Purchase Order
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {supplier.purchaseOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No purchase orders yet</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplier.purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Link
                          href={`/admin/inventory/purchase-orders/${order.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status] || ''}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {order.expectedDate
                          ? new Date(order.expectedDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${parseFloat(order.total).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Stock History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Restocks</CardTitle>
        </CardHeader>
        <CardContent>
          {supplier.stockHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No stock history yet</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplier.stockHistory.slice(0, 10).map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>
                        {new Date(history.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {history.product ? (
                          <Link
                            href={`/admin/products/${history.product.slug}`}
                            className="hover:text-primary hover:underline"
                          >
                            {history.product.name}
                          </Link>
                        ) : (
                          'Deleted Product'
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {history.product?.sku || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{history.changeType}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        +{history.quantityChange}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
