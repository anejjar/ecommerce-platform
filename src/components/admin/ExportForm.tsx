'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportFormProps {
  onExportCreated: () => void;
}

interface ExportFilters {
  categoryId?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  published?: boolean;
  featured?: boolean;
  hasOrders?: boolean;
  parentCategoryId?: string;
  lowStock?: boolean;
}

export function ExportForm({ onExportCreated }: ExportFormProps) {
  const [exportType, setExportType] = useState<string>('PRODUCTS');
  const [format, setFormat] = useState<string>('CSV');
  const [filters, setFilters] = useState<ExportFilters>({});
  const [isExporting, setIsExporting] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    // Fetch categories for filters
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: exportType,
          format,
          filters,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Export failed');
      }

      const data = await response.json();
      toast.success('Export started successfully');
      onExportCreated();

      // Reset form
      setFilters({});
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create export');
    } finally {
      setIsExporting(false);
    }
  };

  const renderTypeSpecificFilters = () => {
    switch (exportType) {
      case 'PRODUCTS':
        return (
          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <Select
                value={filters.categoryId || 'all'}
                onValueChange={(value) => setFilters({ ...filters, categoryId: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={filters.published === true}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, published: checked ? true : undefined })
                }
              />
              <Label htmlFor="published" className="font-normal">
                Published only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured === true}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, featured: checked ? true : undefined })
                }
              />
              <Label htmlFor="featured" className="font-normal">
                Featured only
              </Label>
            </div>
          </div>
        );

      case 'ORDERS':
        return (
          <div className="space-y-4">
            <div>
              <Label>Order Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Payment Status</Label>
              <Select
                value={filters.paymentStatus || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, paymentStatus: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
              />
            </div>
          </div>
        );

      case 'CUSTOMERS':
        return (
          <div className="space-y-4">
            <div>
              <Label>Registration Start Date</Label>
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
              />
            </div>

            <div>
              <Label>Registration End Date</Label>
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasOrders"
                checked={filters.hasOrders === true}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, hasOrders: checked ? true : undefined })
                }
              />
              <Label htmlFor="hasOrders" className="font-normal">
                Has orders only
              </Label>
            </div>
          </div>
        );

      case 'CATEGORIES':
        return (
          <div className="space-y-4">
            <div>
              <Label>Parent Category</Label>
              <Select
                value={filters.parentCategoryId || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, parentCategoryId: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'INVENTORY':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowStock"
                checked={filters.lowStock === true}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, lowStock: checked ? true : undefined })
                }
              />
              <Label htmlFor="lowStock" className="font-normal">
                Low stock only (below 10 units)
              </Label>
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={filters.categoryId || 'all'}
                onValueChange={(value) => setFilters({ ...filters, categoryId: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Export</CardTitle>
        <CardDescription>
          Export your data in various formats for analysis or backup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Export Type</Label>
            <Select
              value={exportType}
              onValueChange={(value) => {
                setExportType(value);
                setFilters({}); // Reset filters when type changes
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRODUCTS">Products</SelectItem>
                <SelectItem value="ORDERS">Orders</SelectItem>
                <SelectItem value="CUSTOMERS">Customers</SelectItem>
                <SelectItem value="CATEGORIES">Categories</SelectItem>
                <SelectItem value="INVENTORY">Inventory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="JSON">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Filters</h3>
          {renderTypeSpecificFilters()}
        </div>

        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Creating Export...' : 'Create Export'}
        </Button>
      </CardContent>
    </Card>
  );
}
