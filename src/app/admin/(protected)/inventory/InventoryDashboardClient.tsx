'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  RefreshCw,
  ArrowRight,
  Eye,
  Plus,
  AlertCircle,
  Activity,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useCurrency } from '@/hooks/useCurrency';

interface DashboardData {
  summary: {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    inventoryValue: number;
  };
  recentChanges: Array<{
    id: string;
    changeType: string;
    quantityChange: number;
    createdAt: string;
    productName: string;
    productSku: string;
    createdBy: string;
  }>;
  lowStockAlerts: Array<{
    id: string;
    name: string;
    sku: string;
    slug?: string;
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
    in?: number;
    out?: number;
    stockLevel?: number;
    changes?: number;
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

export default function InventoryDashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { format, formatNoDecimals } = useCurrency();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      const response = await fetch('/api/admin/inventory/reports?type=dashboard');
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.report) {
          setData(responseData.report);
        } else {
          // Fallback if API changes or returns different structure
          setData(responseData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch inventory dashboard:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Loading skeleton component
  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Failed to load inventory dashboard</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Calculate additional metrics
  const stockHealthPercentage = data.summary.totalProducts > 0
    ? ((data.summary.totalProducts - data.summary.lowStockCount - data.summary.outOfStockCount) / data.summary.totalProducts * 100)
    : 100;
  
  const lowStockPercentage = data.summary.totalProducts > 0
    ? (data.summary.lowStockCount / data.summary.totalProducts * 100)
    : 0;

  const stats = [
    {
      name: 'Total Products',
      value: data.summary.totalProducts.toLocaleString(),
      icon: Package,
      className: 'text-blue-500 dark:text-blue-400',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      change: 'Active inventory',
      link: '/admin/products',
      alert: false,
    },
    {
      name: 'Low Stock Items',
      value: data.summary.lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      className: 'text-orange-500 dark:text-orange-400',
      bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
      change: `${lowStockPercentage.toFixed(1)}% of inventory`,
      link: '/admin/inventory/alerts',
      alert: data.summary.lowStockCount > 0,
      changePercent: lowStockPercentage,
    },
    {
      name: 'Out of Stock',
      value: data.summary.outOfStockCount.toLocaleString(),
      icon: XCircle,
      className: 'text-red-500 dark:text-red-400',
      bgGradient: 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20',
      change: 'Not available',
      link: '/admin/products?filter=outOfStock',
      alert: data.summary.outOfStockCount > 0,
    },
    {
      name: 'Inventory Value',
      value: formatNoDecimals(Number(data.summary.inventoryValue)),
      icon: DollarSign,
      className: 'text-green-500 dark:text-green-400',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      change: 'Total worth',
      link: '/admin/inventory/reports?type=valuation',
      alert: false,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1.5">Overview of your inventory and stock levels</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Link href="/admin/inventory/bulk-update">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Update
            </Button>
          </Link>
          <Link href="/admin/inventory/purchase-orders/new">
            <Button size="sm">
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
            <Link key={stat.name} href={stat.link || '#'}>
              <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20 ${stat.alert ? 'ring-2 ring-orange-200 dark:ring-orange-900/50' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.name}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-background/50 backdrop-blur-sm ${stat.className} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                    {stat.changePercent !== undefined && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        stat.changePercent > 10 ? 'text-red-600 dark:text-red-400' : 
                        stat.changePercent > 5 ? 'text-orange-600 dark:text-orange-400' : 
                        'text-muted-foreground'
                      }`}>
                        {stat.changePercent > 5 && <AlertTriangle className="h-3 w-3" />}
                        {stat.changePercent > 0 && `${stat.changePercent.toFixed(1)}%`}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{stat.change}</p>
                  {stat.alert && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <AlertCircle className="h-3 w-3" />
                      <span>Action needed</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Stock Levels Trend */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Stock Levels Trend</CardTitle>
                <CardDescription>Last 30 days stock movement</CardDescription>
              </div>
              <Link href="/admin/inventory/stock-history">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer
              config={{
                stockLevel: {
                  label: 'Stock Level',
                  color: 'hsl(var(--chart-1))',
                },
                changes: {
                  label: 'Changes',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={data.stockTrend.map(item => ({
                    ...item,
                    stockLevel: (item.in || 0) - (item.out || 0),
                    netChange: (item.in || 0) - (item.out || 0),
                  }))} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-stockLevel)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-stockLevel)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stockLevel"
                    stroke="var(--color-stockLevel)"
                    fillOpacity={1}
                    fill="url(#colorStock)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, fill: "var(--color-stockLevel)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Stock by Category */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Stock by Category</CardTitle>
                <CardDescription>Inventory distribution</CardDescription>
              </div>
              <Link href="/admin/inventory/reports?type=current-stock">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer
              config={{
                totalStock: {
                  label: 'Total Stock',
                  color: 'hsl(var(--chart-2))',
                },
                value: {
                  label: 'Value',
                  color: 'hsl(var(--chart-3))',
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.stockByCategory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  />
                  <Bar 
                    dataKey="totalStock" 
                    fill="var(--color-totalStock)" 
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Changes & Low Stock Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Stock Changes */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Stock Changes</CardTitle>
                <CardDescription>Latest inventory movements</CardDescription>
              </div>
              <Link href="/admin/inventory/stock-history">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentChanges.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                <p className="text-muted-foreground">No recent changes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentChanges.map((change) => (
                  <div 
                    key={change.id} 
                    className="group flex items-center justify-between border-b pb-3 last:border-0 border-border hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold truncate">
                          {change.productName || 'Unknown Product'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        SKU: {change.productSku || 'N/A'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {new Date(change.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {change.createdBy && (
                          <span className="text-xs text-muted-foreground">• {change.createdBy}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <div className="text-right">
                        <div className={`flex items-center gap-1 ${change.quantityChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {change.quantityChange > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-semibold text-sm">
                            {change.quantityChange > 0 ? '+' : ''}{change.quantityChange}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        className={`${changeTypeColors[change.changeType] || 'bg-gray-100 text-gray-800'} shrink-0`}
                        variant="outline"
                      >
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
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Products needing attention</CardDescription>
              </div>
              <Link href="/admin/inventory/alerts">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.lowStockAlerts.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Package className="w-12 h-12 mx-auto text-green-500 mb-2 opacity-50" />
                <p className="text-muted-foreground font-medium">All products are well stocked!</p>
                <p className="text-xs text-muted-foreground">No low stock alerts at this time</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.lowStockAlerts.map((product) => {
                  const threshold = product.stockAlert?.threshold || 10;
                  const stockPercentage = threshold > 0 ? (product.stock / threshold) * 100 : 0;
                  const severity = product.stock === 0 
                    ? 'critical' 
                    : stockPercentage < 25 
                    ? 'critical' 
                    : stockPercentage < 50 
                    ? 'warning' 
                    : 'info';
                  
                  return (
                    <Link
                      key={product.id}
                      href={product.slug ? `/admin/products/${product.slug}` : `/admin/products/${product.id}`}
                      className="group block"
                    >
                      <div className="flex items-center justify-between border-b pb-3 last:border-0 border-border hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </span>
                            {severity === 'critical' && (
                              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">SKU: {product.sku || 'N/A'}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Stock Level</span>
                                <span className={`font-medium ${
                                  severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                                  severity === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                                  'text-blue-600 dark:text-blue-400'
                                }`}>
                                  {product.stock} / {threshold}
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full transition-all ${
                                    severity === 'critical' ? 'bg-red-500' :
                                    severity === 'warning' ? 'bg-orange-500' :
                                    'bg-blue-500'
                                  }`}
                                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <Badge 
                            variant={product.stock === 0 ? 'destructive' : severity === 'critical' ? 'destructive' : 'secondary'}
                            className="mb-1"
                          >
                            {product.stock} left
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = product.slug ? `/admin/products/${product.slug}` : `/admin/products/${product.id}`;
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common inventory management tasks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/inventory/stock-history">
              <Button variant="outline" className="w-full justify-start group hover:bg-primary hover:text-primary-foreground transition-colors">
                <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                View Stock History
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/admin/inventory/suppliers">
              <Button variant="outline" className="w-full justify-start group hover:bg-primary hover:text-primary-foreground transition-colors">
                <Truck className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Manage Suppliers
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/admin/inventory/purchase-orders">
              <Button variant="outline" className="w-full justify-start group hover:bg-primary hover:text-primary-foreground transition-colors">
                <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Purchase Orders
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/admin/inventory/alerts">
              <Button variant="outline" className="w-full justify-start group hover:bg-primary hover:text-primary-foreground transition-colors">
                <AlertTriangle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Low Stock Alerts
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stock Health Alert */}
      {data.summary.lowStockCount > 0 || data.summary.outOfStockCount > 0 ? (
        <Card className={`border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 shadow-md hover:shadow-lg transition-shadow`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-orange-900 dark:text-orange-100">Stock Health Alert</CardTitle>
                  <CardDescription className="text-orange-700 dark:text-orange-300">
                    Action required
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-orange-800 dark:text-orange-200 font-medium">
                You have <span className="font-bold">{data.summary.lowStockCount + data.summary.outOfStockCount}</span> product{data.summary.lowStockCount + data.summary.outOfStockCount !== 1 ? 's' : ''} that need attention.
                {data.summary.lowStockCount > 0 && (
                  <span> {data.summary.lowStockCount} low stock</span>
                )}
                {data.summary.outOfStockCount > 0 && (
                  <span> and {data.summary.outOfStockCount} out of stock</span>
                )}
                .
              </p>
              <Link href="/admin/inventory/alerts">
                <Button 
                  variant="default"
                  className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-600 shrink-0 ml-4"
                >
                  View Alerts
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-green-900 dark:text-green-100">Stock Health: Excellent</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  All products are well stocked
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 dark:text-green-200 font-medium">
              Your inventory is in great shape! {stockHealthPercentage.toFixed(1)}% of products have adequate stock levels.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
