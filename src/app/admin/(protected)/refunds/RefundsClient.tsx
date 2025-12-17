'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, Package, Trash2 } from 'lucide-react';

interface Refund {
  id: string;
  rmaNumber: string;
  status: string;
  reason: string;
  reasonDetails: string | null;
  refundAmount: number;
  restockItems: boolean;
  adminNotes: string | null;
  customerNotes: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  order: {
    orderNumber: string;
    total: number;
  };
  requestedBy: {
    name: string | null;
    email: string;
  };
  processedBy: {
    name: string | null;
    email: string;
  } | null;
  refundItems: Array<{
    id: string;
    quantity: number;
  }>;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

const reasonLabels: Record<string, string> = {
  DEFECTIVE: 'Defective/Damaged',
  WRONG_ITEM: 'Wrong Item',
  NOT_AS_DESCRIBED: 'Not as Described',
  CHANGED_MIND: 'Changed Mind',
  ARRIVED_LATE: 'Arrived Late',
  OTHER: 'Other',
};

export default function RefundsPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'complete' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (
      !session ||
      (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')
    ) {
      router.push('/admin/dashboard');
    } else {
      fetchRefunds();
    }
  }, [session, sessionStatus, router, filter]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const url =
        filter === 'all'
          ? '/api/refunds'
          : `/api/refunds?status=${filter.toUpperCase()}`;
      const response = await fetch(url);

      if (response.status === 404) {
        toast.error('Refund management feature is not enabled');
        router.push('/admin/dashboard');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch refunds');

      const data = await response.json();
      setRefunds(data);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast.error('Failed to load refunds');
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (refund: Refund, actionType: 'approve' | 'reject' | 'complete') => {
    setSelectedRefund(refund);
    setAction(actionType);
    setAdminNotes(refund.adminNotes || '');
    setDialogOpen(true);
  };

  const handleAction = async () => {
    if (!selectedRefund || !action) return;

    let newStatus: string;
    switch (action) {
      case 'approve':
        newStatus = 'APPROVED';
        break;
      case 'reject':
        newStatus = 'REJECTED';
        break;
      case 'complete':
        newStatus = 'COMPLETED';
        break;
      default:
        return;
    }

    try {
      setProcessing(true);

      const response = await fetch(`/api/refunds/${selectedRefund.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to update refund');

      toast.success(`Refund ${action}d successfully!`);
      setDialogOpen(false);
      setSelectedRefund(null);
      setAction(null);
      setAdminNotes('');
      fetchRefunds();
    } catch (error) {
      console.error('Error updating refund:', error);
      toast.error('Failed to update refund');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this refund request?')) {
      return;
    }

    try {
      const response = await fetch(`/api/refunds/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete refund');

      toast.success('Refund deleted successfully');
      fetchRefunds();
    } catch (error) {
      console.error('Error deleting refund:', error);
      toast.error('Failed to delete refund');
    }
  };

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const filteredRefunds = refunds.filter((refund) => {
    if (filter === 'all') return true;
    return refund.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Refund Management</h1>
          <p className="text-gray-600 mt-2">
            Review and process customer refund requests
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Refunds</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRefunds.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No refund requests found</p>
            <p className="text-sm text-gray-400">
              {filter !== 'all'
                ? `No ${filter} refunds at this time`
                : 'Refund requests will appear here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRefunds.map((refund) => (
            <Card key={refund.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <span>{refund.rmaNumber}</span>
                      <Badge className={statusColors[refund.status]}>
                        {refund.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Order #{refund.order.orderNumber} • Submitted{' '}
                      {new Date(refund.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ${Number(refund.refundAmount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">Refund Amount</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>{' '}
                        <span className="font-medium">
                          {refund.requestedBy.name || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>{' '}
                        <span className="font-medium">{refund.requestedBy.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Reason:</span>{' '}
                        <span className="font-medium">
                          {reasonLabels[refund.reason] || refund.reason}
                        </span>
                      </div>
                      {refund.reasonDetails && (
                        <div className="mt-3 p-3 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-600 mb-1">Customer Notes:</p>
                          <p className="text-sm">{refund.reasonDetails}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Refund Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Items:</span>{' '}
                        <span className="font-medium">
                          {refund.refundItems.length} item(s)
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Restock Items:</span>{' '}
                        <span className="font-medium">
                          {refund.restockItems ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {refund.processedBy && (
                        <div>
                          <span className="text-gray-600">Processed By:</span>{' '}
                          <span className="font-medium">
                            {refund.processedBy.name || refund.processedBy.email}
                          </span>
                        </div>
                      )}
                      {refund.processedAt && (
                        <div>
                          <span className="text-gray-600">Processed On:</span>{' '}
                          <span className="font-medium">
                            {new Date(refund.processedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {refund.adminNotes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs text-blue-600 mb-1">Admin Notes:</p>
                          <p className="text-sm text-blue-900">{refund.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t">
                  {refund.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => openDialog(refund, 'approve')}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => openDialog(refund, 'reject')}
                        variant="destructive"
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  {refund.status === 'APPROVED' && (
                    <Button
                      onClick={() => openDialog(refund, 'complete')}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Completed
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(refund.id)}
                    variant="outline"
                    className="gap-2 ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' && 'Approve Refund Request'}
              {action === 'reject' && 'Reject Refund Request'}
              {action === 'complete' && 'Complete Refund'}
            </DialogTitle>
            <DialogDescription>
              {action === 'approve' &&
                'Approving this refund will restore stock (if enabled) and notify the customer.'}
              {action === 'reject' &&
                'Rejecting this refund will notify the customer. Please provide a reason.'}
              {action === 'complete' &&
                'Mark this refund as completed once the payment has been processed.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-notes">
                {action === 'reject' ? 'Reason for Rejection *' : 'Admin Notes (Optional)'}
              </Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={
                  action === 'reject'
                    ? 'Please explain why this refund request is being rejected...'
                    : 'Add any internal notes about this refund...'
                }
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handleAction} disabled={processing}>
              {processing ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
