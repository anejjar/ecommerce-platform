'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertCircle, Clock, Star, User } from 'lucide-react';
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-destructive">Failed to load dashboard data</div>;
  }

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${Number(data.summary.totalRevenue).toLocaleString('en-US')}`,
      change: `$${Number(data.summary.monthRevenue).toLocaleString('en-US')} this month`,
      icon: DollarSign,
      className: 'text-green-500 dark:text-green-400',
    },
    {
      name: 'Total Orders',
      value: data.summary.totalOrders.toLocaleString('en-US'),
      change: `${data.summary.monthOrders} this month`,
      icon: ShoppingCart,
      className: 'text-blue-500 dark:text-blue-400',
    },
    {
      name: 'Avg. Order Value',
      value: `$${Number(data.summary.averageOrderValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'Per order',
      icon: TrendingUp,
      className: 'text-indigo-500 dark:text-indigo-400',
    },
    {
      name: 'Total Customers',
      value: data.summary.totalCustomers.toLocaleString('en-US'),
      change: `${data.summary.newCustomers} new this month`,
      icon: Users,
      className: 'text-purple-500 dark:text-purple-400',
    },
    {
      name: 'Pending Orders',
      value: data.summary.pendingOrders.toLocaleString('en-US'),
      change: 'Needs processing',
      icon: Clock,
      className: 'text-yellow-500 dark:text-yellow-400',
    },
    {
      name: 'Total Products',
      value: data.summary.totalProducts.toLocaleString('en-US'),
      change: data.summary.lowStockProducts > 0
        ? `${data.summary.lowStockProducts} low stock`
        : 'All stocked',
      icon: Package,
      className: data.summary.lowStockProducts > 0 ? 'text-orange-500 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400',
    },
    {
      name: 'Out of Stock',
      value: data.summary.outOfStockProducts.toLocaleString('en-US'),
      change: 'Not available',
      icon: AlertCircle,
      className: data.summary.outOfStockProducts > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400',
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
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
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
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
              className="h-[300px]"
            >
              <AreaChart data={salesChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-orders)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-orders)" stopOpacity={0} />
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
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                PENDING: { label: "Pending", color: "hsl(var(--chart-3))" },
                PROCESSING: { label: "Processing", color: "hsl(var(--chart-4))" },
                SHIPPED: { label: "Shipped", color: "hsl(var(--chart-5))" },
                DELIVERED: { label: "Delivered", color: "hsl(var(--chart-1))" },
                CANCELLED: { label: "Cancelled", color: "hsl(var(--destructive))" },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews & Top Customers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentReviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {data.recentReviews.map((review) => (
                  <div key={review.id} className="border-b pb-3 last:border-0 border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                          {review.user.image ? (
                            <Image src={review.user.image} alt={review.user.name || 'User'} width={32} height={32} />
                          ) : (
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{review.user.name || 'Anonymous'}</p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-1">"{review.comment}"</p>
                    <Link href={`/admin/products/${review.product.slug}`} className="text-xs text-primary hover:underline">
                      On {review.product.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topCustomers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No customer data yet</p>
            ) : (
              <div className="space-y-4">
                {data.topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between border-b pb-3 last:border-0 border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        } text-white font-bold text-sm`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number(customer.totalSpend).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      <p className="text-xs text-muted-foreground">{customer.totalOrders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Selling Products</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No sales data yet</p>
            ) : (
              <div className="space-y-4">
                {data.topProducts.map((product, index) => (
                  <div key={product.slug} className="flex items-center justify-between border-b pb-3 last:border-0 border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        } text-white font-bold text-sm`}>
                        {index + 1}
                      </div>
                      <div>
                        <Link
                          href={`/admin/products/${product.slug}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">${product.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.totalSold} sold</p>
                      <p className="text-sm text-muted-foreground">${Number(product.revenue).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {data.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 border-border"
                  >
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.name || order.user?.email || order.guestEmail || 'Guest'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <Badge variant={getStatusBadgeVariant(order.status) as any} className="mt-1">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {data.summary.lowStockProducts > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-500" />
              <CardTitle className="text-orange-900 dark:text-orange-200">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 dark:text-orange-300">
              You have {data.summary.lowStockProducts} product{data.summary.lowStockProducts !== 1 ? 's' : ''} with low inventory.
            </p>
            <Link
              href="/admin/settings/stock-alerts"
              className="inline-block mt-3 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
            >
              View Stock Alerts
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
