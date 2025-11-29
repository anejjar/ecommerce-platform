'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Calendar, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface SalesData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDate: Array<{ date: string; sales: number; orders: number }>;
}

interface TopProduct {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

interface CashierPerformance {
  cashierId: string;
  cashierName: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
}

interface PaymentMethodBreakdown {
  method: string;
  count: number;
  total: number;
  percentage: number;
}

export default function POSReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  });
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [cashierPerformance, setCashierPerformance] = useState<CashierPerformance[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentMethodBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
      });

      // Fetch sales data
      const salesParams = new URLSearchParams({
        startDate: dateRange.from,
        endDate: dateRange.to,
      });
      const salesResponse = await fetch(`/api/pos/analytics/sales?${salesParams.toString()}`);
      if (salesResponse.ok) {
        const sales = await salesResponse.json();
        // Transform to match expected format
        const salesByDate: Array<{ date: string; sales: number; orders: number }> = [];
        setSalesData({
          totalSales: sales.totalSales || 0,
          totalOrders: sales.totalOrders || 0,
          averageOrderValue: sales.averageOrderValue || 0,
          salesByDate,
        });
      }

      // Fetch top products
      const productsParams = new URLSearchParams({
        startDate: dateRange.from,
        endDate: dateRange.to,
        limit: '10',
      });
      const productsResponse = await fetch(`/api/pos/analytics/top-products?${productsParams.toString()}`);
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        setTopProducts(products.map((p: any) => ({
          productId: p.product.id,
          productName: p.product.name,
          quantity: p.quantity,
          revenue: p.revenue,
        })));
      }

      // Fetch cashier performance (we'll create a simple aggregation from orders)
      const ordersResponse = await fetch(`/api/pos/orders?${params.toString()}`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const orders = ordersData.orders || [];

        // Calculate cashier performance
        const cashierMap = new Map<string, { name: string; sales: number; orders: number }>();
        orders.forEach((order: any) => {
          if (order.cashier && order.orderId) {
            const cashierId = order.cashier.id;
            const cashierName = order.cashier.user?.name || 'Unknown';
            const existing = cashierMap.get(cashierId) || { name: cashierName, sales: 0, orders: 0 };
            cashierMap.set(cashierId, {
              name: cashierName,
              sales: existing.sales + order.total,
              orders: existing.orders + 1,
            });
          }
        });

        const performance = Array.from(cashierMap.entries()).map(([id, data]) => ({
          cashierId: id,
          cashierName: data.name,
          totalSales: data.sales,
          totalOrders: data.orders,
          averageOrderValue: data.orders > 0 ? data.sales / data.orders : 0,
        }));
        setCashierPerformance(performance);

        // Calculate payment method breakdown
        const paymentMap = new Map<string, { count: number; total: number }>();
        orders.forEach((order: any) => {
          if (order.orderId) {
            const method = order.paymentMethod;
            const existing = paymentMap.get(method) || { count: 0, total: 0 };
            paymentMap.set(method, {
              count: existing.count + 1,
              total: existing.total + order.total,
            });
          }
        });

        const totalPaymentAmount = Array.from(paymentMap.values()).reduce((sum, p) => sum + p.total, 0);
        const breakdown = Array.from(paymentMap.entries()).map(([method, data]) => ({
          method,
          count: data.count,
          total: data.total,
          percentage: totalPaymentAmount > 0 ? (data.total / totalPaymentAmount) * 100 : 0,
        }));
        setPaymentBreakdown(breakdown);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const rows: string[][] = [];

    // Sales Summary
    rows.push(['Sales Summary']);
    rows.push(['Total Sales', `$${salesData?.totalSales.toFixed(2) || '0.00'}`]);
    rows.push(['Total Orders', salesData?.totalOrders.toString() || '0']);
    rows.push(['Average Order Value', `$${salesData?.averageOrderValue.toFixed(2) || '0.00'}`]);
    rows.push([]);

    // Top Products
    rows.push(['Top Products']);
    rows.push(['Product Name', 'Quantity', 'Revenue']);
    topProducts.forEach((product) => {
      rows.push([product.productName, product.quantity.toString(), `$${product.revenue.toFixed(2)}`]);
    });
    rows.push([]);

    // Cashier Performance
    rows.push(['Cashier Performance']);
    rows.push(['Cashier Name', 'Total Sales', 'Total Orders', 'Average Order Value']);
    cashierPerformance.forEach((cashier) => {
      rows.push([
        cashier.cashierName,
        `$${cashier.totalSales.toFixed(2)}`,
        cashier.totalOrders.toString(),
        `$${cashier.averageOrderValue.toFixed(2)}`,
      ]);
    });

    const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pos-reports-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Reports exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">POS Reports</h1>
          <p className="text-muted-foreground mt-1">Sales analytics and performance metrics</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
          <CardDescription>Select the period for your reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button onClick={fetchReports}>
              <Calendar className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Loading reports...</div>
      ) : (
        <>
          {/* Sales Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${salesData?.totalSales.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {salesData?.totalOrders || 0} orders
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesData?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average: ${salesData?.averageOrderValue.toFixed(2) || '0.00'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cashiers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cashierPerformance.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Performance tracked
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              ) : (
                <div className="space-y-2">
                  {topProducts.slice(0, 10).map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} units sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${product.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cashier Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Cashier Performance</CardTitle>
              <CardDescription>Sales performance by cashier</CardDescription>
            </CardHeader>
            <CardContent>
              {cashierPerformance.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              ) : (
                <div className="space-y-2">
                  {cashierPerformance.map((cashier) => (
                    <div key={cashier.cashierId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{cashier.cashierName}</p>
                        <p className="text-sm text-muted-foreground">
                          {cashier.totalOrders} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${cashier.totalSales.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg: ${cashier.averageOrderValue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Breakdown by payment type</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentBreakdown.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              ) : (
                <div className="space-y-3">
                  {paymentBreakdown.map((payment) => (
                    <div key={payment.method}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold capitalize">
                          {payment.method.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {payment.count} transactions • ${payment.total.toFixed(2)} ({payment.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${payment.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

