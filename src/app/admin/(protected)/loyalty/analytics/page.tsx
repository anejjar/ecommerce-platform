'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Gift,
  Clock,
  Star,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';

interface AnalyticsData {
  overview: {
    totalAccounts: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    totalPointsExpired: number;
    totalActivePoints: number;
    averagePointsPerAccount: number;
    activeAccounts: number;
    newAccounts: number;
    engagementRate: number;
    redemptionRate: number;
  };
  tierDistribution: Array<{
    id: string;
    name: string;
    color: string;
    count: number;
    percentage: number;
  }>;
  topEarners: Array<{
    id: string;
    pointsBalance: number;
    lifetimePoints: number;
    user: {
      name: string | null;
      email: string;
    };
    tier: {
      name: string;
      color: string;
    };
  }>;
  recentRedemptions: Array<{
    id: string;
    type: string;
    pointsSpent: number;
    description: string;
    redeemedAt: string;
    account: {
      user: {
        name: string | null;
        email: string;
      };
    };
  }>;
  pointsIssuedByType: Array<{
    type: string;
    points: number;
    count: number;
  }>;
  redemptionsByType: Array<{
    type: string;
    pointsSpent: number;
    count: number;
  }>;
}

export default function LoyaltyAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/loyalty/analytics?days=${days}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Program Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor program performance and engagement</p>
        </div>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.totalAccounts.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +{analytics.overview.newAccounts} new in period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Points</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.totalActivePoints.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Avg {analytics.overview.averagePointsPerAccount} per account
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.engagementRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.overview.activeAccounts} active in period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
            <Gift className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.redemptionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.overview.totalPointsRedeemed.toLocaleString()} redeemed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{analytics.overview.totalPointsIssued.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              -{analytics.overview.totalPointsRedeemed.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Points Expired</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{analytics.overview.totalPointsExpired.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Distribution</CardTitle>
          <CardDescription>Member breakdown by loyalty tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.tierDistribution.map((tier) => (
              <div key={tier.id} className="flex items-center gap-4">
                <Badge
                  style={{
                    backgroundColor: tier.color,
                    color: '#fff',
                    minWidth: '100px',
                  }}
                  className="justify-center"
                >
                  {tier.name}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {tier.count.toLocaleString()} members
                    </span>
                    <span className="text-sm text-gray-500">{tier.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${tier.percentage}%`,
                        backgroundColor: tier.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Points Issued by Type</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.pointsIssuedByType.map((item) => (
                  <TableRow key={item.type}>
                    <TableCell className="font-medium">
                      {item.type.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      +{item.points.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redemptions by Type</CardTitle>
            <CardDescription>Last {days} days</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.redemptionsByType.map((item) => (
                  <TableRow key={item.type}>
                    <TableCell className="font-medium">
                      {item.type.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      -{item.pointsSpent.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Top Earners */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Earners</CardTitle>
          <CardDescription>Customers with highest lifetime points</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Current Balance</TableHead>
                <TableHead className="text-right">Lifetime Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.topEarners.map((earner, index) => (
                <TableRow key={earner.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{earner.user.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{earner.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: earner.tier.color,
                        color: '#fff',
                      }}
                    >
                      {earner.tier.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {earner.pointsBalance.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {earner.lifetimePoints.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Redemptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Redemptions</CardTitle>
          <CardDescription>Last {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentRedemptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No redemptions in this period
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Points Spent</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentRedemptions.map((redemption) => (
                  <TableRow key={redemption.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {redemption.account.user.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {redemption.account.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {redemption.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{redemption.description}</TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      -{redemption.pointsSpent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(redemption.redeemedAt), 'MMM dd, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
