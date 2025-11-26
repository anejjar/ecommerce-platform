'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Loader2, AlertTriangle, Info, Calendar, Trash2, XCircle } from 'lucide-react';

interface DeletionRequest {
  id: string;
  status: 'pending' | 'cancelled' | 'completed';
  reason?: string;
  requestedAt: string;
  scheduledAt: string;
  cancelledAt?: string;
}

export default function AccountDeletePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deletionRequest, setDeletionRequest] = useState<DeletionRequest | null>(null);
  const [reason, setReason] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDeletionRequest();
    }
  }, [status]);

  const fetchDeletionRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/account/delete-request');

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setDeletionRequest(data as unknown as DeletionRequest);
        } else {
          setDeletionRequest(null);
        }
      } else {
        throw new Error('Failed to fetch deletion request');
      }
    } catch (error) {
      toast.error('Failed to load deletion status');
      console.error('Error fetching deletion request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDeletion = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for account deletion');
      return;
    }
    setConfirmDialogOpen(true);
  };

  const handleConfirmDeletion = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/account/delete-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to request account deletion');
      }

      const data = await response.json();
      setDeletionRequest(data as unknown as DeletionRequest);
      setReason('');
      toast.success('Account deletion requested successfully');
      setConfirmDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to request account deletion');
      console.error('Error requesting deletion:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelDeletion = async () => {
    try {
      setCancelling(true);
      const response = await fetch('/api/account/delete-request', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel deletion request');
      }

      toast.success('Account deletion request cancelled');
      fetchDeletionRequest();
    } catch (error) {
      toast.error('Failed to cancel deletion request');
      console.error('Error cancelling deletion:', error);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysRemaining = (scheduledDate: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-600">Delete Account</h1>
        <p className="text-gray-600 mt-1">
          Permanently delete your account and all associated data
        </p>
      </div>

      {deletionRequest?.status === 'pending' ? (
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Account Deletion Scheduled</AlertTitle>
            <AlertDescription>
              Your account is scheduled for deletion. You can cancel this request before
              the scheduled date.
            </AlertDescription>
          </Alert>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Deletion Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Requested On:</span>
                  <span className="text-sm">{formatDate(deletionRequest.requestedAt)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span className="text-sm font-medium">Scheduled For:</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatDate(deletionRequest.scheduledAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded">
                  <span className="text-sm font-medium">Days Remaining:</span>
                  <span className="text-sm font-semibold text-amber-600">
                    {getDaysRemaining(deletionRequest.scheduledAt)} days
                  </span>
                </div>
              </div>

              {deletionRequest.reason && (
                <div>
                  <Label className="text-sm font-medium">Deletion Reason:</Label>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded">
                    {deletionRequest.reason}
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={handleCancelDeletion}
                  disabled={cancelling}
                  variant="outline"
                  className="w-full"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Deletion Request
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Before You Continue</AlertTitle>
            <AlertDescription>
              Account deletion is permanent and cannot be undone. Please review the
              consequences before proceeding.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">
                What Happens When You Delete Your Account?
              </CardTitle>
              <CardDescription>
                Please read these important points carefully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Personal data will be permanently deleted</strong> including
                    your profile, order history, saved addresses, and preferences
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>You will lose access to all orders</strong> and will not be
                    able to track or return items
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Rewards and credits will be forfeited</strong> and cannot be
                    recovered or transferred
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Active subscriptions will be cancelled</strong> immediately
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>30-day grace period:</strong> You have 30 days to cancel the
                    deletion request. After this period, deletion is final.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle>Request Account Deletion</CardTitle>
              <CardDescription>
                Tell us why you're leaving (optional but helpful)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRequestDeletion();
                }}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Deletion</Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please share your reason for deleting your account. This helps us improve our service..."
                      rows={5}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-600">
                      Your feedback is valuable and helps us improve. This information
                      will be used for internal analysis only.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900">Final Warning</h4>
                        <p className="text-sm text-red-800 mt-1">
                          By clicking "Request Account Deletion", you acknowledge that you
                          understand the consequences and agree to permanently delete your
                          account after the 30-day grace period.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Request Account Deletion
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/account')}
                  >
                    Keep My Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Account Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you absolutely sure you want to delete your account? This action will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Schedule your account for deletion in 30 days</li>
                <li>Remove all your personal data after the grace period</li>
                <li>Cancel all subscriptions and forfeit rewards</li>
              </ul>
              <p className="font-semibold">
                You can cancel this request within 30 days by visiting this page again.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeletion}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Yes, Delete My Account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
