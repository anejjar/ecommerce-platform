'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Loader2,
    Plus,
    Search,
    FileText,
    Download,
    Mail,
    Eye,
    MoreVertical,
    Filter,
    Calendar,
    DollarSign,
    TrendingUp,
    AlertCircle,
    Repeat,
    Settings,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';
import { Invoice, InvoiceStatus, InvoiceType } from '@/types/invoice';
import { formatCurrencyWithSymbol } from '@/lib/formatting';

interface InvoiceStats {
    total: number;
    totalAmount: number;
    paid: number;
    paidAmount: number;
    overdue: number;
    overdueAmount: number;
    pending: number;
    pendingAmount: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function InvoicesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [stats, setStats] = useState<InvoiceStats>({
        total: 0,
        totalAmount: 0,
        paid: 0,
        paidAmount: 0,
        overdue: 0,
        overdueAmount: 0,
        pending: 0,
        pendingAmount: 0,
    });
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<string>('all');

    useEffect(() => {
        fetchInvoices();
        fetchStats();
    }, [searchParams, statusFilter, typeFilter, dateRange]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (typeFilter !== 'all') params.append('type', typeFilter);
            if (dateRange !== 'all') {
                const now = new Date();
                if (dateRange === 'today') {
                    params.append('startDate', new Date(now.setHours(0, 0, 0, 0)).toISOString());
                    params.append('endDate', new Date(now.setHours(23, 59, 59, 999)).toISOString());
                } else if (dateRange === 'week') {
                    const weekAgo = new Date(now);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    params.append('startDate', weekAgo.toISOString());
                    params.append('endDate', now.toISOString());
                } else if (dateRange === 'month') {
                    const monthAgo = new Date(now);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    params.append('startDate', monthAgo.toISOString());
                    params.append('endDate', now.toISOString());
                }
            }
            const page = searchParams.get('page') || '1';
            params.append('page', page);
            params.append('limit', '20');

            const response = await fetch(`/api/invoices?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setInvoices(data.invoices);
                setPagination(data.pagination);
            } else {
                toast.error('Failed to fetch invoices');
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/invoices?limit=1000');
            if (response.ok) {
                const data = await response.json();
                const allInvoices = data.invoices;

                const stats: InvoiceStats = {
                    total: allInvoices.length,
                    totalAmount: allInvoices.reduce((sum: number, inv: Invoice) => sum + Number(inv.total), 0),
                    paid: allInvoices.filter((inv: Invoice) => inv.status === 'PAID').length,
                    paidAmount: allInvoices
                        .filter((inv: Invoice) => inv.status === 'PAID')
                        .reduce((sum: number, inv: Invoice) => sum + Number(inv.total), 0),
                    overdue: allInvoices.filter((inv: Invoice) => inv.status === 'OVERDUE').length,
                    overdueAmount: allInvoices
                        .filter((inv: Invoice) => inv.status === 'OVERDUE')
                        .reduce((sum: number, inv: Invoice) => sum + Number(inv.balanceDue), 0),
                    pending: allInvoices.filter((inv: Invoice) => ['DRAFT', 'SENT', 'VIEWED'].includes(inv.status)).length,
                    pendingAmount: allInvoices
                        .filter((inv: Invoice) => ['DRAFT', 'SENT', 'VIEWED'].includes(inv.status))
                        .reduce((sum: number, inv: Invoice) => sum + Number(inv.balanceDue), 0),
                };

                setStats(stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search will be implemented on backend
        fetchInvoices();
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

    const handleDownload = async (invoiceId: string) => {
        try {
            const response = await fetch(`/api/invoices/${invoiceId}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice-${invoiceId}.pdf`;
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

    const handleSend = async (invoiceId: string) => {
        try {
            const response = await fetch(`/api/invoices/${invoiceId}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            if (response.ok) {
                toast.success('Invoice sent successfully');
                fetchInvoices();
            } else {
                toast.error('Failed to send invoice');
            }
        } catch (error) {
            console.error('Error sending invoice:', error);
            toast.error('Failed to send invoice');
        }
    };

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Invoices</h1>
                    <p className="text-gray-600 mt-1">Manage and track all invoices</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/settings/invoices">
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                    <Link href="/admin/invoices/recurring">
                        <Button variant="outline">
                            <Repeat className="mr-2 h-4 w-4" />
                            Recurring
                        </Button>
                    </Link>
                    <Link href="/admin/invoices/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Invoice
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrencyWithSymbol(stats.totalAmount, '$')} total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paid</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrencyWithSymbol(stats.paidAmount, '$')} received
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrencyWithSymbol(stats.pendingAmount, '$')} pending
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrencyWithSymbol(stats.overdueAmount, '$')} overdue
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2 min-w-[300px]">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search invoices..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="SENT">Sent</SelectItem>
                                <SelectItem value="VIEWED">Viewed</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="STANDARD">Standard</SelectItem>
                                <SelectItem value="PROFORMA">Proforma</SelectItem>
                                <SelectItem value="CREDIT_NOTE">Credit Note</SelectItem>
                                <SelectItem value="QUOTE">Quote</SelectItem>
                                <SelectItem value="RECEIPT">Receipt</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Date Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">Last 7 Days</SelectItem>
                                <SelectItem value="month">Last 30 Days</SelectItem>
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
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No invoices</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating a new invoice.
                            </p>
                            <div className="mt-6">
                                <Link href="/admin/invoices/new">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Invoice
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Balance</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/admin/invoices/${invoice.id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {invoice.invoiceNumber}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {invoice.customerName || invoice.customerEmail || 'Guest'}
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
                                                <TableCell>
                                                    {formatCurrencyWithSymbol(invoice.total, invoice.currencySymbol)}
                                                </TableCell>
                                                <TableCell>
                                                    {invoice.balanceDue > 0 ? (
                                                        <span className="text-red-600">
                                                            {formatCurrencyWithSymbol(invoice.balanceDue, invoice.currencySymbol)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-600">Paid</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/invoices/${invoice.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDownload(invoice.id)}
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download PDF
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleSend(invoice.id)}
                                                            >
                                                                <Mail className="mr-2 h-4 w-4" />
                                                                Send Email
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
                                            onClick={() => goToPage(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => goToPage(pagination.page + 1)}
                                            disabled={pagination.page === pagination.totalPages}
                                        >
                                            Next
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

