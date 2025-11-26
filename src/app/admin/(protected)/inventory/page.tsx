'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Upload,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface DashboardData {
  summary: {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalInventoryValue: number;
  };
  recentStockChanges: Array<{
    id: string;
    changeType: string;
    quantityChange: number;
    createdAt: string;
    product: {
      name: string;
      sku: string;
      slug: string;
    } | null;
    user: {
      name: string | null;
      email: string;
    } | null;
  }>;
  lowStockAlerts: Array<{
    id: string;
    name: string;
    sku: string;
    slug: string;
    stock: number;
    stockAlert: {
      threshold: number;
    } | null;
  }>;
  stockByCategory: Array<{
    category: string;
    totalStock: number;
    value: number;
  }>;
  stockTrend: Array<{
    date: string;
    stockLevel: number;
    changes: number;
  }>;
}

const changeTypeColors: Record<string, string> = {
  SALE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  REFUND: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  RESTOCK: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  ADJUSTMENT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  DAMAGE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  RETURN: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  TRANSFER: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

export default function InventoryDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/inventory/reports?type=dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Failed to fetch inventory dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading inventory dashboard...</div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-destructive">Failed to load dashboard data</div>;
  }

  const stats = [
    {
      name: 'Total Products',
      value: data.summary.totalProducts.toLocaleString(),
      icon: Package,
      className: 'text-blue-500 dark:text-blue-400',
      change: 'Active inventory',
    },
    {
      name: 'Low Stock Items',
      value: data.summary.lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      className: 'text-orange-500 dark:text-orange-400',
      change: 'Need attention',
    },
    {
      name: 'Out of Stock',
      value: data.summary.outOfStockCount.toLocaleString(),
      icon: XCircle,
      className: 'text-red-500 dark:text-red-400',
      change: 'Not available',
    },
    {
      name: 'Inventory Value',
      value: `$${data.summary.totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      className: 'text-green-500 dark:text-green-400',
      change: 'Total worth',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-2">Overview of your inventory and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/inventory/bulk-update">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Update
            </Button>
          </Link>
          <Link href="/admin/inventory/purchase-orders/new">
            <Button>
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Purchase Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.className}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Stock Levels Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels Over Time (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                stockLevel: {
                  label: 'Stock Level',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className="h-[300px]"
            >
              <AreaChart data={data.stockTrend}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-stockLevel)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-stockLevel)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="stockLevel"
                  stroke="var(--color-stockLevel)"
                  fillOpacity={1}
                  fill="url(#colorStock)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Stock by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Stock by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalStock: {
                  label: 'Total Stock',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={data.stockByCategory}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totalStock" fill="var(--color-totalStock)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Changes & Low Stock Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Stock Changes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Stock Changes</CardTitle>
              <Link href="/admin/inventory/stock-history">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentStockChanges.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent changes</p>
            ) : (
              <div className="space-y-4">
                {data.recentStockChanges.map((change) => (
                  <div key={change.id} className="flex items-center justify-between border-b pb-3 last:border-0 border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/admin/products/${change.product?.slug}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {change.product?.name || 'Unknown Product'}
                        </Link>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        SKU: {change.product?.sku || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(change.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2">
                        <div className={`flex items-center gap-1 ${change.quantityChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {change.quantityChange > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {change.quantityChange > 0 ? '+' : ''}{change.quantityChange}
                          </span>
                        </div>
                      </div>
                      <Badge className={changeTypeColors[change.changeType] || 'bg-gray-100 text-gray-800'}>
                        {change.changeType}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alerts</CardTitle>
              <Link href="/admin/inventory/alerts">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.lowStockAlerts.length === 0 ? (
              <div className="text-center py-4">
                <Package className="w-12 h-12 mx-auto text-green-500 mb-2" />
                <p className="text-muted-foreground">All products are well stocked!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.lowStockAlerts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0 border-border">
                    <div className="flex-1">
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-muted-foreground">
                          Threshold: {product.stockAlert?.threshold || 'Not set'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={product.stock === 0 ? 'destructive' : 'secondary'}>
                        {product.stock} in stock
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/admin/inventory/stock-history">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                View Stock History
              </Button>
            </Link>
            <Link href="/admin/inventory/suppliers">
              <Button variant="outline" className="w-full justify-start">
                <Truck className="w-4 h-4 mr-2" />
                Manage Suppliers
              </Button>
            </Link>
            <Link href="/admin/inventory/purchase-orders">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Purchase Orders
              </Button>
            </Link>
            <Link href="/admin/inventory/alerts">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Low Stock Alerts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
