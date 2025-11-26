'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Eye, MousePointer, X, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PopupAnalytics {
  id: string;
  date: string;
  views: number;
  clicks: number;
  dismissals: number;
  conversions: number;
}

interface Popup {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  analytics: PopupAnalytics[];
}

export default function PopupAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [popup, setPopup] = useState<Popup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopupAnalytics();
  }, [id]);

  const fetchPopupAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/popups/${id}`);
      if (!response.ok) throw new Error('Failed to fetch popup analytics');
      const data = await response.json();
      setPopup(data);
    } catch (error) {
      console.error('Error fetching popup analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!popup || !popup.analytics) return { views: 0, clicks: 0, dismissals: 0, conversions: 0 };

    return popup.analytics.reduce(
      (acc, item) => ({
        views: acc.views + item.views,
        clicks: acc.clicks + item.clicks,
        dismissals: acc.dismissals + item.dismissals,
        conversions: acc.conversions + item.conversions,
      }),
      { views: 0, clicks: 0, dismissals: 0, conversions: 0 }
    );
  };

  // Calculate rates
  const calculateRates = () => {
    const totals = calculateTotals();
    if (totals.views === 0) return { ctr: 0, conversionRate: 0, dismissalRate: 0 };

    return {
      ctr: ((totals.clicks / totals.views) * 100).toFixed(2),
      conversionRate: ((totals.conversions / totals.views) * 100).toFixed(2),
      dismissalRate: ((totals.dismissals / totals.views) * 100).toFixed(2),
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!popup) {
    return <div className="p-8">Popup not found</div>;
  }

  const totals = calculateTotals();
  const rates = calculateRates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin/popups">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Popups
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{popup.name} - Analytics</h1>
          <div className="flex items-center gap-2">
            <Badge variant={popup.isActive ? 'default' : 'secondary'}>
              {popup.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">{popup.type}</Badge>
          </div>
        </div>
        <Link href={`/admin/popups/${id}`}>
          <Button variant="outline">Edit Popup</Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Times popup was shown
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rates.ctr}%</div>
            <p className="text-xs text-muted-foreground">
              {totals.clicks.toLocaleString()} clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rates.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totals.conversions.toLocaleString()} conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dismissal Rate</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rates.dismissalRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totals.dismissals.toLocaleString()} dismissals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {popup.analytics && popup.analytics.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Conv. Rate</TableHead>
                  <TableHead className="text-right">Dismissals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popup.analytics.map((day) => {
                  const ctr = day.views > 0 ? ((day.clicks / day.views) * 100).toFixed(1) : '0';
                  const convRate = day.views > 0 ? ((day.conversions / day.views) * 100).toFixed(1) : '0';

                  return (
                    <TableRow key={day.id}>
                      <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                      <TableCell className="text-right">{day.views}</TableCell>
                      <TableCell className="text-right">{day.clicks}</TableCell>
                      <TableCell className="text-right">{ctr}%</TableCell>
                      <TableCell className="text-right">{day.conversions}</TableCell>
                      <TableCell className="text-right">{convRate}%</TableCell>
                      <TableCell className="text-right">{day.dismissals}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No analytics data yet. Activate the popup to start collecting data.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Engagement Score</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${Math.min(parseFloat(String(rates.ctr)) * 10, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium">{rates.ctr}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {parseFloat(String(rates.ctr)) > 5
                ? '✅ Excellent! Your popup is performing well.'
                : parseFloat(String(rates.ctr)) > 2
                  ? '👍 Good performance. Consider A/B testing to improve further.'
                  : '⚠️ Low engagement. Try adjusting your design, copy, or trigger settings.'}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Recommendations</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {parseFloat(String(rates.dismissalRate)) > 50 && (
                <li>• High dismissal rate - Consider making your offer more compelling</li>
              )}
              {parseFloat(String(rates.ctr)) < 2 && (
                <li>• Low click-through rate - Try a different button color or text</li>
              )}
              {parseFloat(String(rates.conversionRate)) < 1 && totals.clicks > 10 && (
                <li>• Clicks but low conversions - Check your landing page or offer</li>
              )}
              {totals.views < 50 && popup.isActive && (
                <li>• Low views - Verify your trigger settings and target pages</li>
              )}
              {totals.views === 0 && popup.isActive && (
                <li>• No views yet - Make sure the popup is active and properly configured</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
