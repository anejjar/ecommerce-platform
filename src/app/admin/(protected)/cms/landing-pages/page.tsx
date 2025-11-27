'use client';

import { useState } from 'react';
import { useLandingPages, deleteLandingPage, duplicateLandingPage, publishLandingPage, unpublishLandingPage } from '@/hooks/useLandingPages';
import { PageStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus, Search, Copy, Edit, Trash2, Eye, Globe, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const STATUS_COLORS: Record<PageStatus, string> = {
    DRAFT: 'bg-gray-500',
    PUBLISHED: 'bg-green-500',
    SCHEDULED: 'bg-blue-500',
    ARCHIVED: 'bg-yellow-500',
};

export default function LandingPagesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<PageStatus | 'all'>('all');
    const [page, setPage] = useState(1);

    const { pages, pagination, isLoading, mutate } = useLandingPages({
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
        page,
        limit: 20,
    });

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await deleteLandingPage(id);
            toast.success('Landing page deleted successfully');
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete page');
        }
    };

    const handleDuplicate = async (id: string, title: string) => {
        const newTitle = prompt('Enter title for duplicated page:', `${title} (Copy)`);
        if (!newTitle) return;

        const newSlug = prompt('Enter slug for duplicated page:', `${title.toLowerCase().replace(/\s+/g, '-')}-copy`);
        if (!newSlug) return;

        try {
            await duplicateLandingPage(id, newTitle, newSlug);
            toast.success('Landing page duplicated successfully');
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to duplicate page');
        }
    };

    const handlePublish = async (id: string) => {
        try {
            await publishLandingPage(id);
            toast.success('Landing page published successfully');
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to publish page');
        }
    };

    const handleUnpublish = async (id: string) => {
        try {
            await unpublishLandingPage(id);
            toast.success('Landing page unpublished successfully');
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to unpublish page');
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Landing Pages</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your landing pages built with blocks
                    </p>
                </div>
                <Link href="/admin/cms/landing-pages/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Landing Page
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search pages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Pages Table */}
            {isLoading ? (
                <div className="border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : pages && pages.length > 0 ? (
                <>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Blocks</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/cms/landing-pages/${page.id}`} className="hover:underline">
                                                {page.title}
                                            </Link>
                                            <div className="text-sm text-muted-foreground">/{page.slug}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={STATUS_COLORS[page.status]}>
                                                {page.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{page.author.name}</TableCell>
                                        <TableCell>{page.blockCount}</TableCell>
                                        <TableCell>{page.viewCount}</TableCell>
                                        <TableCell>
                                            {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/admin/cms/landing-pages/${page.id}`)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDuplicate(page.id, page.title)}>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(page.id, page.title)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
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
                        <div className="flex justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4">
                                Page {page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page === pagination.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="border rounded-lg p-12 text-center">
                    <p className="text-muted-foreground mb-4">No landing pages found</p>
                    <Link href="/admin/cms/landing-pages/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create First Landing Page
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
