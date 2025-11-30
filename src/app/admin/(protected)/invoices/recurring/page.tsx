'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    Loader2,
    Plus,
    Play,
    Pause,
    Edit,
    Trash2,
    Calendar,
    User,
    FileText,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import toast from 'react-hot-toast';
import { RecurringInvoice, RecurringFrequency } from '@/types/invoice';

export default function RecurringInvoicesPage() {
    const router = useRouter();
    const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRecurringInvoices();
    }, []);

    const fetchRecurringInvoices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/invoices/recurring');
            if (response.ok) {
                const data = await response.json();
                setRecurringInvoices(data);
            } else {
                toast.error('Failed to fetch recurring invoices');
            }
        } catch (error) {
            console.error('Error fetching recurring invoices:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/invoices/recurring/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            if (response.ok) {
                toast.success(`Recurring invoice ${!currentStatus ? 'activated' : 'paused'}`);
                fetchRecurringInvoices();
            } else {
                toast.error('Failed to update recurring invoice');
            }
        } catch (error) {
            console.error('Error updating recurring invoice:', error);
            toast.error('Failed to update recurring invoice');
        }
    };

    const handleGenerate = async (id: string) => {
        try {
            setGeneratingId(id);
            const response = await fetch(`/api/invoices/recurring/${id}/generate`, {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                toast.success('Invoice generated successfully');
                fetchRecurringInvoices();
                router.push(`/admin/invoices/${data.invoice.id}`);
            } else {
                toast.error('Failed to generate invoice');
            }
        } catch (error) {
            console.error('Error generating invoice:', error);
            toast.error('Failed to generate invoice');
        } finally {
            setGeneratingId(null);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            const response = await fetch(`/api/invoices/recurring/${selectedId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Recurring invoice deleted');
                setShowDeleteDialog(false);
                setSelectedId(null);
                fetchRecurringInvoices();
            } else {
                toast.error('Failed to delete recurring invoice');
            }
        } catch (error) {
            console.error('Error deleting recurring invoice:', error);
            toast.error('Failed to delete recurring invoice');
        }
    };

    const getFrequencyLabel = (frequency: RecurringFrequency, interval: number) => {
        const labels: Record<RecurringFrequency, string> = {
            DAILY: 'Daily',
            WEEKLY: 'Weekly',
            MONTHLY: 'Monthly',
            QUARTERLY: 'Quarterly',
            YEARLY: 'Yearly',
            CUSTOM: 'Custom',
        };
        return interval > 1 
            ? `Every ${interval} ${labels[frequency].toLowerCase()}s`
            : labels[frequency];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Recurring Invoices</h1>
                    <p className="text-gray-600 mt-1">Manage automated recurring invoice generation</p>
                </div>
                <Link href="/admin/invoices/recurring/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Recurring Invoice
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recurring Invoices</CardTitle>
                    <CardDescription>
                        {recurringInvoices.length} total recurring invoices
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {recurringInvoices.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No recurring invoices</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Create a recurring invoice to automatically generate invoices on a schedule.
                            </p>
                            <div className="mt-6">
                                <Link href="/admin/invoices/recurring/new">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Recurring Invoice
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Frequency</TableHead>
                                        <TableHead>Next Run</TableHead>
                                        <TableHead>Last Run</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Generated</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recurringInvoices.map((recurring) => (
                                        <TableRow key={recurring.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/admin/invoices/recurring/${recurring.id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {recurring.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {recurring.customerEmail || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {getFrequencyLabel(recurring.frequency, recurring.interval)}
                                            </TableCell>
                                            <TableCell>
                                                {recurring.nextRunDate
                                                    ? new Date(recurring.nextRunDate).toLocaleDateString()
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {recurring.lastRunDate
                                                    ? new Date(recurring.lastRunDate).toLocaleDateString()
                                                    : 'Never'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={recurring.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'}
                                                >
                                                    {recurring.isActive ? 'Active' : 'Paused'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {recurring.generatedInvoices?.length || 0} invoices
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleGenerate(recurring.id)}
                                                        disabled={generatingId === recurring.id}
                                                    >
                                                        {generatingId === recurring.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Play className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleActive(recurring.id, recurring.isActive)}
                                                    >
                                                        {recurring.isActive ? (
                                                            <Pause className="h-4 w-4" />
                                                        ) : (
                                                            <Play className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedId(recurring.id);
                                                            setShowDeleteDialog(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Recurring Invoice?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this recurring invoice. This action cannot be undone.
                            Generated invoices will not be affected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

