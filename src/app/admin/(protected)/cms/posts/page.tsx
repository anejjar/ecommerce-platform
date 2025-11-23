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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    author: {
        name: string | null;
        email: string;
    };
    category: {
        name: string;
    } | null;
    createdAt: string;
    publishedAt: string | null;
}

interface Pagination {
    total: number;
    pages: number;
    page: number;
    limit: number;
}

export default function BlogPostsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const [bulkAction, setBulkAction] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (status !== 'ALL') params.append('status', status);
            const page = searchParams.get('page') || '1';
            params.append('page', page);

            const response = await fetch(`/api/admin/cms/posts?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
                setPagination(data.pagination);
            } else {
                toast.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [searchParams, status]); // Re-fetch when URL params or status filter changes

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

    const toggleAllPosts = () => {
        if (selectedPosts.length === posts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(posts.map(p => p.id));
        }
    };

    const togglePost = (id: string) => {
        setSelectedPosts(prev =>
            prev.includes(id)
                ? prev.filter(postId => postId !== id)
                : [...prev, id]
        );
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedPosts.length === 0) {
            toast.error('Please select posts and an action');
            return;
        }

        if (bulkAction === 'delete') {
            if (!confirm(`Are you sure you want to delete ${selectedPosts.length} post(s)?`)) return;

            try {
                const response = await fetch('/api/admin/cms/posts/bulk', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: selectedPosts }),
                });

                if (response.ok) {
                    toast.success('Posts deleted');
                    setSelectedPosts([]);
                    setBulkAction('');
                    fetchPosts();
                } else {
                    toast.error('Failed to delete posts');
                }
            } catch (error) {
                console.error('Error deleting posts:', error);
                toast.error('An error occurred');
            }
        } else if (bulkAction.startsWith('status_')) {
            const newStatus = bulkAction.replace('status_', '').toUpperCase();

            try {
                const response = await fetch('/api/admin/cms/posts/bulk', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: selectedPosts, status: newStatus }),
                });

                if (response.ok) {
                    toast.success(`Status updated to ${newStatus}`);
                    setSelectedPosts([]);
                    setBulkAction('');
                    fetchPosts();
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
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`/api/admin/cms/posts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Post deleted');
                fetchPosts();
            } else {
                toast.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('An error occurred');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <Badge className="bg-green-500">Published</Badge>;
            case 'DRAFT':
                return <Badge variant="secondary">Draft</Badge>;
            case 'ARCHIVED':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage your blog content</p>
                </div>
                <Link href="/admin/cms/posts/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                    </Button>
                </Link>
            </div>

            {selectedPosts.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">{selectedPosts.length} selected</span>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Bulk Actions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="status_draft">Set as Draft</SelectItem>
                            <SelectItem value="status_published">Set as Published</SelectItem>
                            <SelectItem value="status_archived">Set as Archived</SelectItem>
                            <SelectItem value="delete">Delete</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleBulkAction} disabled={!bulkAction}>
                        Apply
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPosts([])}>
                        Clear
                    </Button>
                </div>
            )}

            <div className="flex gap-4 items-center">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
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
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No posts found
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">
                                        {post.title}
                                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                            /{post.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell>{post.author.name || post.author.email}</TableCell>
                                    <TableCell>
                                        {post.category ? (
                                            <Badge variant="outline">{post.category.name}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {post.publishedAt
                                                ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                                                : format(new Date(post.createdAt), 'MMM d, yyyy')}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {post.publishedAt ? 'Published' : 'Created'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View Live">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/cms/posts/${post.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(post.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
