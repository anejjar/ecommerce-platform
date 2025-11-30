'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    isActive: boolean;
    subscribedAt: string;
    unsubscribedAt: string | null;
    source: string | null;
}

interface Stats {
    total: number;
    active: number;
    inactive: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function NewsletterSubscribersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0 });
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchSubscribers();
    }, [filter, search, searchParams]);

    const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);
            if (search) params.append('search', search);
            const page = searchParams.get('page') || '1';
            params.append('page', page);

            const response = await fetch(`/api/newsletter/subscribers?${params}`);
            const data = await response.json();

            if (response.ok) {
                setSubscribers(data.subscribers);
                setStats(data.stats);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to delete subscriber ${email}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/newsletter/subscribers?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchSubscribers();
            }
        } catch (error) {
            console.error('Error deleting subscriber:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Reset to page 1
        router.push(`?${params.toString()}`);
    };

    const handleFilterChange = (newFilter: 'all' | 'active' | 'inactive') => {
        setFilter(newFilter);
        const params = new URLSearchParams(searchParams);
        params.set('page', '1'); // Reset to page 1
        router.push(`?${params.toString()}`);
    };

    const exportToCSV = () => {
        const headers = ['Email', 'Name', 'Status', 'Subscribed At', 'Source'];
        const rows = subscribers.map((sub) => [
            sub.email,
            sub.name || '',
            sub.isActive ? 'Active' : 'Inactive',
            new Date(sub.subscribedAt).toLocaleDateString(),
            sub.source || '',
        ]);

        const csv = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
                <p className="text-gray-600 mt-2">Manage your email newsletter subscribers</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Subscribers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Active Subscribers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Unsubscribed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-400">{stats.inactive}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            {/* Filters and Actions */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-2 ml-auto">
                        <Button variant="outline" size="sm" onClick={exportToCSV}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mt-4 mb-4">
                    <Input
                        placeholder="Search by email or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="md:max-w-sm"
                    />
                    <div className="flex gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterChange('all')}
                            type="button"
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'active' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterChange('active')}
                            type="button"
                        >
                            Active
                        </Button>
                        <Button
                            variant={filter === 'inactive' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterChange('inactive')}
                            type="button"
                        >
                            Inactive
                        </Button>
                    </div>
                </form>

                {isLoading ? (
                    <div className="text-center py-12 border rounded-lg bg-gray-50">
                        <p className="text-gray-500">Loading subscribers...</p>
                    </div>
                ) : subscribers.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-gray-50">
                        <p className="text-gray-500">No subscribers found</p>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Subscribed</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscribers.map((subscriber) => (
                                    <TableRow key={subscriber.id}>
                                        <TableCell className="font-medium">{subscriber.email}</TableCell>
                                        <TableCell>{subscriber.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={subscriber.isActive ? 'default' : 'secondary'}
                                                className={subscriber.isActive ? 'bg-green-600' : 'bg-gray-500'}
                                            >
                                                {subscriber.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {subscriber.source || 'unknown'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(subscriber.id, subscriber.email)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => goToPage(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => goToPage(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
