'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertTriangle, XCircle, Package, ShoppingCart, Download, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  slug: string;
  stock: number;
  price: string;
  stockAlert: {
    id: string;
    threshold: number;
    enabled: boolean;
  } | null;
}

export default function LowStockAlertsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isThresholdDialogOpen, setIsThresholdDialogOpen] = useState(false);
  const [newThreshold, setNewThreshold] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/inventory/low-stock');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/inventory/low-stock?export=true');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `low-stock-alerts-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Low stock alerts exported successfully');
      } else {
        toast.error('Failed to export alerts');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('An error occurred while exporting');
    }
  };

  const handleOpenThresholdDialog = (product: Product) => {
    setSelectedProduct(product);
    setNewThreshold(product.stockAlert?.threshold?.toString() || '10');
    setIsThresholdDialogOpen(true);
  };

  const handleUpdateThreshold = async () => {
    if (!selectedProduct) return;

    const threshold = parseInt(newThreshold);
    if (isNaN(threshold) || threshold < 0) {
      toast.error('Please enter a valid threshold');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/inventory/alerts/${selectedProduct.id}`, {
        method: selectedProduct.stockAlert ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threshold,
          enabled: true,
        }),
      });

      if (response.ok) {
        toast.success('Threshold updated successfully');
        setIsThresholdDialogOpen(false);
        fetchLowStockProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update threshold');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An error occurred while updating threshold');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickReorder = (product: Product) => {
    // Navigate to new purchase order with this product pre-selected
    router.push(`/admin/inventory/purchase-orders/new?productId=${product.id}`);
  };

  const filteredProducts = products.filter((product) => {
    if (filterType === 'critical') {
      return product.stock === 0;
    }
    if (filterType === 'warning') {
      return product.stock > 0 && product.stock <= (product.stockAlert?.threshold || 0);
    }
    return true;
  });

  const criticalCount = products.filter((p) => p.stock === 0).length;
  const warningCount = products.filter(
    (p) => p.stock > 0 && p.stock <= (p.stockAlert?.threshold || 0)
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">Loading low stock alerts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Low Stock Alerts</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage products with low inventory</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Products need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical (Out of Stock)</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Immediate action required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning (Below Threshold)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningCount}</div>
            <p className="text-xs text-muted-foreground">Consider restocking soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All ({products.length})
          </Button>
          <Button
            variant={filterType === 'critical' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('critical')}
          >
            Critical ({criticalCount})
          </Button>
          <Button
            variant={filterType === 'warning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('warning')}
          >
            Warning ({warningCount})
          </Button>
        </div>
      </Card>

      {/* Low Stock Products Table */}
      {filteredProducts.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filterType === 'all'
                ? 'All products are well stocked!'
                : `No ${filterType} stock items`}
            </h3>
            <p className="text-muted-foreground">
              {filterType === 'all'
                ? 'Your inventory levels are healthy'
                : 'Try adjusting your filter'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Threshold</TableHead>
                <TableHead className="text-center">Difference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const threshold = product.stockAlert?.threshold || 0;
                const difference = threshold - product.stock;
                const isCritical = product.stock === 0;

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.sku || 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={isCritical ? 'destructive' : 'secondary'}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">{threshold}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-medium ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                        {difference > 0 ? `Need ${difference}` : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isCritical ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" />
                          Out of Stock
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenThresholdDialog(product)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReorder(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Reorder
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Threshold Dialog */}
      <Dialog open={isThresholdDialogOpen} onOpenChange={setIsThresholdDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock Alert Threshold</DialogTitle>
            <DialogDescription>
              Set the minimum stock level for {selectedProduct?.name}. You'll be alerted when stock
              falls below this threshold.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="threshold">Alert Threshold</Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Current stock: {selectedProduct?.stock}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsThresholdDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateThreshold} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Threshold'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
