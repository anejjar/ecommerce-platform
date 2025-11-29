'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/contexts/SettingsContext';
import { formatCurrencyWithSymbol, formatCurrencyWithSymbolNoDecimals } from '@/lib/formatting';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  AlertCircle, 
  Clock, 
  Star, 
  User,
  ArrowRight,
  RefreshCw,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import Image from 'next/image';

interface DashboardData {
  summary: {
    totalRevenue: number;
    monthRevenue: number;
    weekRevenue: number;
    totalOrders: number;
    monthOrders: number;
    totalCustomers: number;
    newCustomers: number;
    totalProducts: number;
    lowStockProducts: number;
    pendingOrders: number;
    outOfStockProducts: number;
    averageOrderValue: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: string;
    status: string;
    createdAt: string;
    guestEmail?: string | null;
    user: {
      name: string | null;
      email: string;
    } | null;
  }>;
  topProducts: Array<{
    name: string;
    slug: string;
    price: string;
    totalSold: number;
    revenue: number;
  }>;
  salesByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    _count: { id: number };
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string | null;
      image: string | null;
    };
    product: {
      name: string;
      slug: string;
      images: Array<{ url: string }>;
    };
  }>;
  topCustomers: Array<{
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    totalSpend: number;
    totalOrders: number;
  }>;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { settings } = useSettings();
  const currencySymbol = settings.general_currency_symbol || '$';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      const response = await fetch('/api/analytics/dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
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
              <Skeleton className="h-[300px] w-full rounded-full" />
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
          <h3 className="text-lg font-semibold">Failed to load dashboard data</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Calculate percentage changes for better insights (only when data exists)
  const revenueChange = data.summary.weekRevenue > 0 
    ? ((data.summary.monthRevenue - data.summary.weekRevenue * 4) / (data.summary.weekRevenue * 4) * 100)
    : 0;
  const ordersChange = data.summary.monthOrders > 0 && data.summary.totalOrders > 0
    ? ((data.summary.monthOrders / data.summary.totalOrders) * 100)
    : 0;

  const stats = [
    {
      name: 'Total Revenue',
      value: formatCurrencyWithSymbolNoDecimals(Number(data.summary.totalRevenue), currencySymbol),
      change: `${formatCurrencyWithSymbolNoDecimals(Number(data.summary.monthRevenue), currencySymbol)} this month`,
      changePercent: revenueChange,
      icon: DollarSign,
      className: 'text-green-500 dark:text-green-400',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      link: '/admin/analytics',
    },
    {
      name: 'Total Orders',
      value: data.summary.totalOrders.toLocaleString('en-US'),
      change: `${data.summary.monthOrders} this month`,
      changePercent: ordersChange,
      icon: ShoppingCart,
      className: 'text-blue-500 dark:text-blue-400',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      link: '/admin/orders',
    },
    {
      name: 'Avg. Order Value',
      value: formatCurrencyWithSymbol(Number(data.summary.averageOrderValue), currencySymbol),
      change: 'Per order',
      icon: TrendingUp,
      className: 'text-indigo-500 dark:text-indigo-400',
      bgGradient: 'from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20',
      link: '/admin/analytics',
    },
    {
      name: 'Total Customers',
      value: data.summary.totalCustomers.toLocaleString('en-US'),
      change: `${data.summary.newCustomers} new this month`,
      changePercent: data.summary.totalCustomers > 0 
        ? (data.summary.newCustomers / data.summary.totalCustomers * 100)
        : 0,
      icon: Users,
      className: 'text-purple-500 dark:text-purple-400',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      link: '/admin/customers',
    },
    {
      name: 'Pending Orders',
      value: data.summary.pendingOrders.toLocaleString('en-US'),
      change: 'Needs processing',
      icon: Clock,
      className: 'text-yellow-500 dark:text-yellow-400',
      bgGradient: 'from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20',
      link: '/admin/orders?status=PENDING',
      alert: data.summary.pendingOrders > 0,
    },
    {
      name: 'Total Products',
      value: data.summary.totalProducts.toLocaleString('en-US'),
      change: data.summary.lowStockProducts > 0
        ? `${data.summary.lowStockProducts} low stock`
        : 'All stocked',
      icon: Package,
      className: data.summary.lowStockProducts > 0 ? 'text-orange-500 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400',
      bgGradient: data.summary.lowStockProducts > 0 
        ? 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20'
        : 'from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20',
      link: '/admin/products',
      alert: data.summary.lowStockProducts > 0,
    },
    {
      name: 'Out of Stock',
      value: data.summary.outOfStockProducts.toLocaleString('en-US'),
      change: 'Not available',
      icon: AlertCircle,
      className: data.summary.outOfStockProducts > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400',
      bgGradient: data.summary.outOfStockProducts > 0
        ? 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20'
        : 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      link: '/admin/products?filter=outOfStock',
      alert: data.summary.outOfStockProducts > 0,
    },
  ];

  // Format sales data for chart
  const salesChartData = data.salesByDay.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Number(day.revenue),
    orders: Number(day.orders),
  }));

  // Format order status data for pie chart
  const statusChartData = data.ordersByStatus.map(item => ({
    name: item.status,
    value: item._count.id,
  }));

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'default';
      case 'PROCESSING': return 'secondary';
      case 'PENDING': return 'outline';
      case 'CANCELLED': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1.5">Overview of your store performance</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isRefreshing}
          className="shrink-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const hasPositiveChange = stat.changePercent && stat.changePercent > 0;
          const hasNegativeChange = stat.changePercent && stat.changePercent < 0;
          
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
                        hasPositiveChange ? 'text-green-600 dark:text-green-400' : 
                        hasNegativeChange ? 'text-red-600 dark:text-red-400' : 
                        'text-muted-foreground'
                      }`}>
                        {hasPositiveChange && <ArrowUpRight className="h-3 w-3" />}
                        {hasNegativeChange && <ArrowDownRight className="h-3 w-3" />}
                        {stat.changePercent !== 0 && `${Math.abs(stat.changePercent).toFixed(1)}%`}
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
        {/* Sales Trend */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Last 30 days performance</CardDescription>
              </div>
              <Link href="/admin/analytics">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                orders: {
                  label: "Orders",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-orders)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-orders)" stopOpacity={0} />
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
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
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
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--color-revenue)" }}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--color-orders)" }}
                />
              </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </div>
              <Link href="/admin/orders">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer
              config={{
                PENDING: { label: "Pending", color: "hsl(45, 93%, 47%)" },
                PROCESSING: { label: "Processing", color: "hsl(217, 91%, 60%)" },
                SHIPPED: { label: "Shipped", color: "hsl(262, 83%, 58%)" },
                DELIVERED: { label: "Delivered", color: "hsl(142, 76%, 36%)" },
                CANCELLED: { label: "Cancelled", color: "hsl(0, 84%, 60%)" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`var(--color-${entry.name})`}
                        className="transition-opacity hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend 
                    content={<ChartLegendContent />}
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews & Top Customers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Reviews */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </div>
              <Link href="/admin/reviews">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentReviews.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Star className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="group border-b pb-4 last:border-0 border-border hover:bg-muted/50 rounded-lg p-3 -mx-3 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-border shrink-0">
                          {review.user.image ? (
                            <Image 
                              src={review.user.image} 
                              alt={review.user.name || 'User'} 
                              width={40} 
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{review.user.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2 ml-14">"{review.comment}"</p>
                    <Link 
                      href={`/admin/products/${review.product.slug}`} 
                      className="text-xs text-primary hover:underline font-medium flex items-center gap-1 ml-14 group-hover:text-primary/80"
                    >
                      <Package className="h-3 w-3" />
                      {review.product.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Highest value customers</CardDescription>
              </div>
              <Link href="/admin/customers">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.topCustomers.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Users className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                <p className="text-muted-foreground">No customer data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.topCustomers.map((customer, index) => {
                  const rankColors = [
                    'bg-gradient-to-br from-yellow-400 to-yellow-600',
                    'bg-gradient-to-br from-gray-300 to-gray-500',
                    'bg-gradient-to-br from-orange-400 to-orange-600',
                    'bg-gradient-to-br from-blue-400 to-blue-600',
                  ];
                  return (
                    <Link 
                      key={customer.id} 
                      href={`/admin/customers/${customer.id}`}
                      className="flex items-center justify-between border-b pb-3 last:border-0 border-border hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rankColors[index] || rankColors[3]} text-white font-bold text-sm shadow-sm shrink-0`}>
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{customer.name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-semibold text-primary">{formatCurrencyWithSymbol(Number(customer.totalSpend), currencySymbol)}</p>
                        <p className="text-xs text-muted-foreground">{customer.totalOrders} order{customer.totalOrders !== 1 ? 's' : ''}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Selling Products */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performers this period</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <Link href="/admin/products">
                  <Button variant="ghost" size="icon-sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Package className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                <p className="text-muted-foreground">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product, index) => {
                  const rankColors = [
                    'bg-gradient-to-br from-yellow-400 to-yellow-600',
                    'bg-gradient-to-br from-gray-300 to-gray-500',
                    'bg-gradient-to-br from-orange-400 to-orange-600',
                    'bg-gradient-to-br from-blue-400 to-blue-600',
                  ];
                  return (
                    <Link
                      key={product.slug}
                      href={`/admin/products/${product.slug}`}
                      className="flex items-center justify-between border-b pb-3 last:border-0 border-border hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rankColors[index] || rankColors[3]} text-white font-bold text-sm shadow-sm shrink-0`}>
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{currencySymbol}{product.price}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-semibold text-primary">{product.totalSold} sold</p>
                        <p className="text-xs text-muted-foreground">{formatCurrencyWithSymbol(Number(product.revenue), currencySymbol)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </div>
              <Link href="/admin/orders">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                <p className="text-muted-foreground">No orders yet</p>
                <Link href="/admin/orders/new">
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Order
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between border-b pb-3 last:border-0 border-border hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold group-hover:text-primary transition-colors">
                          {order.orderNumber}
                        </p>
                        <Badge 
                          variant={getStatusBadgeVariant(order.status) as any} 
                          className="text-xs shrink-0"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.user?.name || order.user?.email || order.guestEmail || 'Guest'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-semibold text-primary">{currencySymbol}{order.total}</p>
                      <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/admin/orders/${order.id}`;
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {data.summary.lowStockProducts > 0 && (
        <Card className="border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-orange-900 dark:text-orange-100">Low Stock Alert</CardTitle>
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
                You have <span className="font-bold">{data.summary.lowStockProducts}</span> product{data.summary.lowStockProducts !== 1 ? 's' : ''} with low inventory that need attention.
              </p>
              <Link href="/admin/products?filter=lowStock">
                <Button 
                  variant="default"
                  className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-600 shrink-0 ml-4"
                >
                  View Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Out of Stock Alert */}
      {data.summary.outOfStockProducts > 0 && (
        <Card className="border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-red-900 dark:text-red-100">Out of Stock Alert</CardTitle>
                  <CardDescription className="text-red-700 dark:text-red-300">
                    Immediate action required
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-red-800 dark:text-red-200 font-medium">
                You have <span className="font-bold">{data.summary.outOfStockProducts}</span> product{data.summary.outOfStockProducts !== 1 ? 's' : ''} that are out of stock.
              </p>
              <Link href="/admin/products?filter=outOfStock">
                <Button 
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 shrink-0 ml-4"
                >
                  Restock Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
