'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Loader2, Trash2, AlertTriangle, UserX, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface DeletionRequest {
    id: string;
    userId: string;
    status: string;
    reason: string | null;
    requestedAt: string;
    scheduledAt: string;
    user: {
        name: string | null;
        email: string;
        image: string | null;
    };
}

export default function DeletionRequestsPage() {
    const [requests, setRequests] = useState<DeletionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<DeletionRequest | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/admin/customers/deletion-requests');
            if (response.ok) {
                const data = await response.json();
                setRequests(data.requests);
            }
        } catch (error) {
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRequest) return;

        try {
            setProcessingId(selectedRequest.id);
            const response = await fetch(`/api/admin/customers/deletion-requests/${selectedRequest.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete account');
            }

            toast.success('Account deleted successfully');
            setRequests(requests.filter(r => r.id !== selectedRequest.id));
            setSelectedRequest(null);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Account Deletion Requests</h1>
                <p className="text-gray-600 mt-2">
                    Manage pending account deletion requests.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>
                        Users who have requested to delete their account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {requests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <UserX className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No pending deletion requests</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Requested</TableHead>
                                    <TableHead>Scheduled</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{request.user.name || 'Unknown'}</p>
                                                <p className="text-sm text-gray-500">{request.user.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate" title={request.reason || ''}>
                                            {request.reason || <span className="text-gray-400 italic">No reason provided</span>}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(request.requestedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-amber-500" />
                                                {formatDistanceToNow(new Date(request.scheduledAt), { addSuffix: true })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={request.status === 'pending' ? 'secondary' : 'outline'}>
                                                {request.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setSelectedRequest(request)}
                                            >
                                                Delete Now
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Confirm Immediate Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <p>
                                Are you sure you want to immediately delete the account for <strong>{selectedRequest?.user.email}</strong>?
                            </p>
                            <div className="bg-red-50 p-4 rounded-md border border-red-200 text-sm text-red-800 space-y-2">
                                <p className="font-semibold">Warning: This action is irreversible.</p>
                                <ul className="list-disc list-inside">
                                    <li>User data will be permanently removed.</li>
                                    <li>Order history will be lost (unless anonymized).</li>
                                    <li>The 30-day grace period will be skipped.</li>
                                </ul>
                            </div>
                            <p className="text-sm text-gray-600">
                                The system will automatically check for active orders before proceeding.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={!!processingId}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={!!processingId}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {processingId ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, Delete Immediately'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
