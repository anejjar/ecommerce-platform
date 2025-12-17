'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye, Copy, Globe, XCircle, Blocks, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface Page {
    id: string;
    title: string;
    slug: string;
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
    useBlockEditor: boolean;
    updatedAt: string;
    author?: {
        id: string;
        name: string | null;
        email: string;
    };
    viewCount?: number;
    blockCount?: number;
}

interface Pagination {
    total: number;
    pages: number;
    page: number;
    limit: number;
}

export default function PagesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [pages, setPages] = useState<Page[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
    const [selectedPages, setSelectedPages] = useState<string[]>([]);
    const [bulkAction, setBulkAction] = useState('');

    const fetchPages = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (status !== 'ALL') params.append('status', status);
            const page = searchParams.get('page') || '1';
            params.append('page', page);

            const response = await fetch(`/api/admin/cms/pages?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setPages(data.pages);
                setPagination(data.pagination);
            } else {
                toast.error('Failed to fetch pages');
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, [searchParams, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        const params = new URLSearchParams(searchParams);
        if (value !== 'ALL') {
            params.set('status', value);
        } else {
            params.delete('status');
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const toggleAllPages = () => {
        if (selectedPages.length === pages.length) {
            setSelectedPages([]);
        } else {
            setSelectedPages(pages.map(p => p.id));
        }
    };

    const togglePage = (id: string) => {
        setSelectedPages(prev =>
            prev.includes(id)
                ? prev.filter(pageId => pageId !== id)
                : [...prev, id]
        );
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedPages.length === 0) {
            toast.error('Please select pages and an action');
            return;
        }

        if (bulkAction === 'delete') {
            if (!confirm(`Are you sure you want to delete ${selectedPages.length} page(s)?`)) return;

            try {
                const response = await fetch('/api/admin/cms/pages/bulk', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: selectedPages }),
                });

                if (response.ok) {
                    toast.success('Pages deleted');
                    setSelectedPages([]);
                    setBulkAction('');
                    fetchPages();
                } else {
                    toast.error('Failed to delete pages');
                }
            } catch (error) {
                console.error('Error deleting pages:', error);
                toast.error('An error occurred');
            }
        } else if (bulkAction.startsWith('status_')) {
            const newStatus = bulkAction.replace('status_', '').toUpperCase();

            try {
                const response = await fetch('/api/admin/cms/pages/bulk', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: selectedPages, status: newStatus }),
                });

                if (response.ok) {
                    toast.success(`Status updated to ${newStatus}`);
                    setSelectedPages([]);
                    setBulkAction('');
                    fetchPages();
                } else {
                    toast.error('Failed to update status');
                }
            } catch (error) {
                console.error('Error updating status:', error);
                toast.error('An error occurred');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            const response = await fetch(`/api/admin/cms/pages/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Page deleted');
                fetchPages();
            } else {
                toast.error('Failed to delete page');
            }
        } catch (error) {
            console.error('Error deleting page:', error);
            toast.error('An error occurred');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <Badge className="bg-green-500">Published</Badge>;
            case 'DRAFT':
                return <Badge variant="secondary">Draft</Badge>;
            case 'SCHEDULED':
                return <Badge className="bg-blue-500">Scheduled</Badge>;
            case 'ARCHIVED':
                return <Badge className="bg-yellow-500">Archived</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handlePublish = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/cms/pages/${id}/publish`, {
                method: 'POST',
            });
            if (response.ok) {
                toast.success('Page published');
                fetchPages();
            } else {
                toast.error('Failed to publish page');
            }
        } catch (error) {
            console.error('Error publishing page:', error);
            toast.error('An error occurred');
        }
    };

    const handleUnpublish = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/cms/pages/${id}/unpublish`, {
                method: 'POST',
            });
            if (response.ok) {
                toast.success('Page unpublished');
                fetchPages();
            } else {
                toast.error('Failed to unpublish page');
            }
        } catch (error) {
            console.error('Error unpublishing page:', error);
            toast.error('An error occurred');
        }
    };

    const handleDuplicate = async (id: string, title: string) => {
        const newTitle = prompt('Enter title for duplicated page:', `${title} (Copy)`);
        if (!newTitle) return;

        const newSlug = prompt('Enter slug for duplicated page:', `${title.toLowerCase().replace(/\s+/g, '-')}-copy`);
        if (!newSlug) return;

        try {
            const response = await fetch(`/api/admin/cms/pages/${id}/duplicate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, slug: newSlug }),
            });

            if (response.ok) {
                toast.success('Page duplicated');
                fetchPages();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to duplicate page');
            }
        } catch (error) {
            console.error('Error duplicating page:', error);
            toast.error('An error occurred');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
                    <p className="text-muted-foreground">Manage your custom pages</p>
                </div>
                <Link href="/admin/cms/pages/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Page
                    </Button>
                </Link>
            </div>

            {selectedPages.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">{selectedPages.length} selected</span>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Bulk Actions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="status_draft">Set as Draft</SelectItem>
                            <SelectItem value="status_published">Set as Published</SelectItem>
                            <SelectItem value="status_scheduled">Set as Scheduled</SelectItem>
                            <SelectItem value="status_archived">Set as Archived</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleBulkAction} disabled={!bulkAction}>
                        Apply
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPages([])}>
                        Clear
                    </Button>
                </div>
            )}

            <div className="flex gap-4 items-center">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search pages..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="secondary">Search</Button>
                </form>
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={selectedPages.length === pages.length && pages.length > 0}
                                    onCheckedChange={toggleAllPages}
                                />
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No pages found
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedPages.includes(page.id)}
                                            onCheckedChange={() => togglePage(page.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {page.title}
                                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                            /{page.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {page.useBlockEditor ? (
                                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                <Blocks className="w-3 h-3" />
                                                Blocks
                                                {page.blockCount !== undefined && (
                                                    <span className="ml-1">({page.blockCount})</span>
                                                )}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                <FileText className="w-3 h-3" />
                                                Rich Text
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(page.status)}</TableCell>
                                    <TableCell>
                                        {page.author ? (
                                            <div className="text-sm">
                                                <div>{page.author.name || 'Unknown'}</div>
                                                <div className="text-xs text-muted-foreground">{page.author.email}</div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{page.viewCount || 0}</span>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {page.status === 'PUBLISHED' && (
                                                <Link href={`/${page.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon" title="View Live">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                            <Link href={`/admin/cms/pages/${page.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {page.status !== 'PUBLISHED' && (
                                                        <DropdownMenuItem onClick={() => handlePublish(page.id)}>
                                                            <Globe className="w-4 h-4 mr-2" />
                                                            Publish
                                                        </DropdownMenuItem>
                                                    )}
                                                    {page.status === 'PUBLISHED' && (
                                                        <DropdownMenuItem onClick={() => handleUnpublish(page.id)}>
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Unpublish
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => handleDuplicate(page.id, page.title)}>
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(page.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={pagination.page === 1}
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', (pagination.page - 1).toString());
                            router.push(`?${params.toString()}`);
                        }}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={pagination.page === pagination.pages}
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', (pagination.page + 1).toString());
                            router.push(`?${params.toString()}`);
                        }}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
