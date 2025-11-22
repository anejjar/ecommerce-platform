'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

interface StockAlert {
  id: string;
  threshold: number;
  notified: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    stock: number;
  };
}

export default function StockAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/stock-alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Alerts</h1>
        <p className="text-gray-600 mt-2">
          Products with low inventory based on configured thresholds
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No low stock products at this time.</p>
              <p className="text-sm mt-2">
                Configure stock alert thresholds in product edit pages.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Alert Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{alert.product.name}</p>
                        <p className="text-sm text-gray-500">{alert.product.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>{alert.product.sku || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          alert.product.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : alert.product.stock <= alert.threshold / 2
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {alert.product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.threshold}</TableCell>
                    <TableCell>
                      {alert.product.stock === 0 ? (
                        <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/products/${alert.product.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Manage Product
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">How Stock Alerts Work</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Configure alert thresholds for each product in the product edit page</li>
          <li>Products appear here when stock falls below the threshold</li>
          <li>Red badge indicates out of stock (0 units)</li>
          <li>Yellow/Orange badges indicate low stock</li>
          <li>Click "Manage Product" to update stock or modify settings</li>
        </ul>
      </div>
    </div>
  );
}
