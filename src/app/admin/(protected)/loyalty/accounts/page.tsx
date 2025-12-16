'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Award, TrendingUp, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface LoyaltyAccount {
  id: string;
  userId: string;
  pointsBalance: number;
  lifetimePoints: number;
  referralCode: string;
  enrolledAt: string;
  lastActivityAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
  };
  tier: {
    id: string;
    name: string;
    color: string;
    pointsRequired: number;
  };
  _count: {
    transactions: number;
    redemptions: number;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function LoyaltyAccountsPage() {
  const [accounts, setAccounts] = useState<LoyaltyAccount[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<LoyaltyAccount | null>(null);
  const [adjustmentDialog, setAdjustmentDialog] = useState(false);
  const [adjustmentPoints, setAdjustmentPoints] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentLoading, setAdjustmentLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [pagination.page, search]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/loyalty/accounts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAdjustPoints = async () => {
    if (!selectedAccount || !adjustmentPoints || !adjustmentReason) {
      return;
    }

    try {
      setAdjustmentLoading(true);
      const response = await fetch(`/api/admin/loyalty/accounts/${selectedAccount.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: parseInt(adjustmentPoints),
          reason: adjustmentReason,
          expirationDays: 365,
        }),
      });

      if (response.ok) {
        setAdjustmentDialog(false);
        setAdjustmentPoints('');
        setAdjustmentReason('');
        setSelectedAccount(null);
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error adjusting points:', error);
    } finally {
      setAdjustmentLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Accounts</h1>
          <p className="text-gray-600 mt-1">Manage customer loyalty accounts and points</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter((a) => {
                const lastActivity = new Date(a.lastActivityAt);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return lastActivity > thirtyDaysAgo;
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points Active</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.reduce((sum, a) => sum + a.pointsBalance, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Accounts</CardTitle>
          <CardDescription>Search by name, email, or referral code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accounts..."
                className="pl-10"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>
            Showing {accounts.length} of {pagination.total} accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Points Balance</TableHead>
                    <TableHead className="text-right">Lifetime Points</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{account.user.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{account.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: account.tier.color,
                            color: '#fff',
                          }}
                        >
                          {account.tier.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {account.pointsBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {account.lifetimePoints.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(account.lastActivityAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAccount(account);
                            setAdjustmentDialog(true);
                          }}
                        >
                          Adjust Points
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                      }
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Point Adjustment Dialog */}
      <Dialog open={adjustmentDialog} onOpenChange={setAdjustmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Points</DialogTitle>
            <DialogDescription>
              Make a manual point adjustment for {selectedAccount?.user.name || 'this customer'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="points">Points Amount</Label>
              <Input
                id="points"
                type="number"
                placeholder="Enter positive or negative amount"
                value={adjustmentPoints}
                onChange={(e) => setAdjustmentPoints(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Use negative numbers to deduct points
              </p>
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this adjustment is being made..."
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAdjustmentDialog(false);
                setAdjustmentPoints('');
                setAdjustmentReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdjustPoints}
              disabled={!adjustmentPoints || !adjustmentReason || adjustmentLoading}
            >
              {adjustmentLoading ? 'Adjusting...' : 'Confirm Adjustment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
