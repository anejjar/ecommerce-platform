'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Crown,
  Calendar
} from 'lucide-react';
import FeatureGateLayout from '@/components/admin/FeatureGateLayout';

interface AnalyticsData {
  overview: {
    totalSessions: number;
    totalConversions: number;
    totalRevenue: number;
    conversionRate: string;
  };
  sources: Array<{
    source: string;
    medium: string;
    sessions: number;
    conversions: number;
    revenue: number;
    conversionRate: string;
    revenuePerSession: string;
  }>;
  landingPages: Array<{
    path: string | null;
    sessions: number;
    conversions: number;
    conversionRate: string;
  }>;
  funnel: {
    sessions: number;
    pageViews: number;
    productViews: number;
    addToCarts: number;
    checkoutStarts: number;
    conversions: number;
  };
  chartData: Array<{
    date: string;
    sessions: number;
  }>;
}

export default function TrafficAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range
      const dateTo = new Date().toISOString();
      let dateFrom = new Date();
      if (dateRange === '7d') dateFrom.setDate(dateFrom.getDate() - 7);
      else if (dateRange === '30d') dateFrom.setDate(dateFrom.getDate() - 30);
      else if (dateRange === '90d') dateFrom.setDate(dateFrom.getDate() - 90);
      else dateFrom = new Date(0); // all time

      const params = dateRange !== 'all'
        ? `?from=${dateFrom.toISOString()}&to=${dateTo}`
        : '';

      const response = await fetch(`/api/admin/analytics/traffic${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err: any) {
      console.error('Analytics error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FeatureGateLayout featureName="traffic_analytics" featureDisplayName="Traffic Analytics & Attribution">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </FeatureGateLayout>
    );
  }

  if (error) {
    return (
      <FeatureGateLayout featureName="traffic_analytics" featureDisplayName="Traffic Analytics & Attribution">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <Crown className="mr-2 h-5 w-5" />
                Premium Feature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
              <p className="mt-2 text-sm text-red-600">
                Enable this feature in Admin → Features to unlock traffic analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </FeatureGateLayout>
    );
  }

  if (!data) return null;

  return (
    <FeatureGateLayout featureName="traffic_analytics" featureDisplayName="Traffic Analytics & Attribution">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="mr-3 h-8 w-8" />
            Traffic Analytics & Attribution
          </h1>
          <p className="mt-2 text-gray-600">
            Track where your traffic comes from and which sources drive conversions
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Period:</span>
          <div className="flex space-x-2">
            {['7d', '30d', '90d', 'all'].map((range) => (
              <Button
                key={range}
                size="sm"
                variant={dateRange === range ? 'default' : 'outline'}
                onClick={() => setDateRange(range as any)}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
                {range === 'all' && 'All Time'}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.totalSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Unique visitor sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.totalConversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.overview.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Attributed revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.conversionRate}</div>
              <p className="text-xs text-muted-foreground mt-1">Sessions to orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>
              Performance by source and medium (first-touch attribution)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Source</th>
                    <th className="text-left p-3 font-semibold">Medium</th>
                    <th className="text-right p-3 font-semibold">Sessions</th>
                    <th className="text-right p-3 font-semibold">Conversions</th>
                    <th className="text-right p-3 font-semibold">Revenue</th>
                    <th className="text-right p-3 font-semibold">Conv. Rate</th>
                    <th className="text-right p-3 font-semibold">$/Session</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sources.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-gray-500">
                        No traffic data yet. Share your site with UTM parameters to start tracking!
                      </td>
                    </tr>
                  ) : (
                    data.sources.map((source, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-medium capitalize">{source.source}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-gray-600 capitalize">{source.medium}</span>
                        </td>
                        <td className="p-3 text-right">{source.sessions.toLocaleString()}</td>
                        <td className="p-3 text-right">{source.conversions.toLocaleString()}</td>
                        <td className="p-3 text-right font-medium">${source.revenue.toLocaleString()}</td>
                        <td className="p-3 text-right">{source.conversionRate}</td>
                        <td className="p-3 text-right text-green-600 font-medium">${source.revenuePerSession}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Landing Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Landing Pages</CardTitle>
              <CardDescription>Most common entry points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.landingPages.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No landing page data yet</p>
                ) : (
                  data.landingPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {page.path || '/'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {page.sessions} sessions • {page.conversions} conversions
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="text-sm font-semibold text-green-600">
                          {page.conversionRate}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Customer journey stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <FunnelStep
                  label="Sessions"
                  count={data.funnel.sessions}
                  total={data.funnel.sessions}
                />
                <FunnelStep
                  label="Product Views"
                  count={data.funnel.productViews}
                  total={data.funnel.sessions}
                />
                <FunnelStep
                  label="Add to Cart"
                  count={data.funnel.addToCarts}
                  total={data.funnel.sessions}
                />
                <FunnelStep
                  label="Checkout Started"
                  count={data.funnel.checkoutStarts}
                  total={data.funnel.sessions}
                />
                <FunnelStep
                  label="Conversions"
                  count={data.funnel.conversions}
                  total={data.funnel.sessions}
                  isLast
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* UTM Tracking Guide */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">📊 How to Track Your Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-800 space-y-2">
              <p className="font-medium">Add UTM parameters to your links:</p>
              <code className="block bg-white p-3 rounded border border-blue-200 mt-2">
                https://yoursite.com?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale
              </code>
              <p className="mt-4">
                <strong>Parameters:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code>utm_source</code> - Traffic source (facebook, google, tiktok, instagram)</li>
                <li><code>utm_medium</code> - Medium type (cpc, social, email, organic)</li>
                <li><code>utm_campaign</code> - Campaign name (summer_sale, new_product_launch)</li>
                <li><code>utm_content</code> - Ad content or link variant</li>
                <li><code>utm_term</code> - Paid search keywords</li>
              </ul>
              <p className="mt-4 text-blue-700">
                💡 <strong>Tip:</strong> The system also auto-detects traffic from Facebook, Google, TikTok,
                Instagram, Twitter, YouTube, and other major platforms even without UTM parameters!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureGateLayout>
  );
}

function FunnelStep({
  label,
  count,
  total,
  isLast = false
}: {
  label: string;
  count: number;
  total: number;
  isLast?: boolean;
}) {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
  const width = total > 0 ? `${(count / total) * 100}%` : '0%';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {count.toLocaleString()} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
        <div
          className={`h-full ${isLast ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-500 flex items-center justify-center`}
          style={{ width }}
        >
          {count > 0 && (
            <span className="text-xs font-medium text-white">{count.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
