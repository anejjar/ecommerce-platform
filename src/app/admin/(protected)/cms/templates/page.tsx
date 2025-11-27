'use client';

import { useState } from 'react';
import { useBlockTemplates, deleteBlockTemplate, duplicateBlockTemplate } from '@/hooks/useBlockTemplates';
import { BlockCategory } from '@prisma/client';
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
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus, Search, Copy, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CATEGORY_LABELS: Record<BlockCategory, string> = {
    HERO: 'Hero',
    CONTENT: 'Content',
    FEATURES: 'Features',
    CTA: 'Call to Action',
    TESTIMONIALS: 'Testimonials',
    PRICING: 'Pricing',
    TEAM: 'Team',
    STATS: 'Stats',
    LOGO_GRID: 'Logo Grid',
    FORM: 'Form',
    FAQ: 'FAQ',
    GALLERY: 'Gallery',
    VIDEO: 'Video',
    CUSTOM: 'Custom',
};

export default function BlockTemplatesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<BlockCategory | 'all'>('all');
    const [isActive, setIsActive] = useState<boolean | 'all'>('all');
    const [page, setPage] = useState(1);

    const { templates, pagination, isLoading, mutate } = useBlockTemplates({
        search: search || undefined,
        category: category !== 'all' ? category : undefined,
        isActive: isActive !== 'all' ? isActive : undefined,
        page,
        limit: 12,
    });

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await deleteBlockTemplate(id);
            toast.success('Template deleted successfully');
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete template');
        }
    };

    const handleDuplicate = async (id: string, name: string) => {
        const newName = prompt('Enter name for duplicated template:', `${name} (Copy)`);
        if (!newName) return;

        const newSlug = prompt('Enter slug for duplicated template:', `${name.toLowerCase().replace(/\s+/g, '-')}-copy`);
        if (!newSlug) return;

        try {
            await duplicateBlockTemplate(id, newName, newSlug);
            toast.success('Template duplicated successfully');
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to duplicate template');
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Block Templates</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage reusable content block templates
                    </p>
                </div>
                <Link href="/admin/cms/templates/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Template
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={category} onValueChange={(value) => setCategory(value as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={String(isActive)} onValueChange={(value) => setIsActive(value === 'all' ? 'all' : value === 'true')}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Templates Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : templates && templates.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <Card key={template.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {template.description || 'No description'}
                                            </CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.push(`/admin/cms/templates/${template.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/admin/cms/templates/${template.id}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicate(template.id, template.name)}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                {!template.isSystem && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(template.id, template.name)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {template.thumbnail ? (
                                        <img
                                            src={template.thumbnail}
                                            alt={template.name}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                            No preview
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div className="flex gap-2">
                                        <Badge variant="outline">{CATEGORY_LABELS[template.category]}</Badge>
                                        {template.isSystem && <Badge variant="secondary">System</Badge>}
                                        {template.isPro && <Badge variant="default">PRO</Badge>}
                                        {!template.isActive && <Badge variant="destructive">Inactive</Badge>}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {template.usageCount} uses
                                    </span>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
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
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-4">No templates found</p>
                        <Link href="/admin/cms/templates/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create First Template
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
