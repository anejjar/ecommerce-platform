'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';
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
    Loader2,
    FileText,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import { formatCurrencyWithSymbol } from '@/lib/formatting';

export default function InvoicesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [pagination, setPagination] = useState<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchInvoices();
        }
    }, [status, statusFilter, currentPage]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            params.append('page', currentPage.toString());
            params.append('limit', '20');

            const response = await fetch(`/api/account/invoices?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setInvoices(data.invoices);
                setPagination(data.pagination);
            } else {
                toast.error('Failed to load invoices');
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
        try {
            const response = await fetch(`/api/invoices/${invoiceId}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Invoice-${invoiceNumber}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Invoice downloaded');
            } else {
                toast.error('Failed to download invoice');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice');
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-800',
            SENT: 'bg-blue-100 text-blue-800',
            VIEWED: 'bg-purple-100 text-purple-800',
            PAID: 'bg-green-100 text-green-800',
            PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
            OVERDUE: 'bg-red-100 text-red-800',
            CANCELLED: 'bg-gray-100 text-gray-800',
            REFUNDED: 'bg-orange-100 text-orange-800',
        };
        return variants[status] || 'bg-gray-100 text-gray-800';
    };

    if (status === 'loading' || loading) {
        return (
            <div className="container mx-auto py-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <Link href="/account">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Account
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold mb-2">My Invoices</h1>
                <p className="text-gray-600">View and download your invoices</p>
            </div>

            {/* Filter */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Filter by Status:</label>
                        <Select value={statusFilter} onValueChange={(value) => {
                            setStatusFilter(value);
                            setCurrentPage(1);
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="SENT">Sent</SelectItem>
                                <SelectItem value="VIEWED">Viewed</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>
                        {pagination ? `${pagination.total} total invoices` : 'Loading...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {invoices.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No invoices</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                You don't have any invoices yet.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="text-right">Balance</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/account/invoices/${invoice.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {invoice.invoiceNumber}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {invoice.dueDate
                                                        ? new Date(invoice.dueDate).toLocaleDateString()
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusBadge(invoice.status)}>
                                                        {invoice.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrencyWithSymbol(invoice.total, invoice.currencySymbol)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {invoice.balanceDue > 0 ? (
                                                        <span className="text-red-600">
                                                            {formatCurrencyWithSymbol(invoice.balanceDue, invoice.currencySymbol)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-600">Paid</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/account/invoices/${invoice.id}`}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownload(invoice.id, invoice.invoiceNumber)}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-600">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                            disabled={currentPage === pagination.totalPages}
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
        </div>
    );
}

