'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBlockTemplates, deleteBlockTemplate, duplicateBlockTemplate, updateBlockTemplate } from '@/hooks/useBlockTemplates';
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
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    MoreVertical, 
    Plus, 
    Search, 
    Copy, 
    Edit, 
    Trash2, 
    Eye, 
    Grid3x3, 
    List,
    X,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    ExternalLink,
} from 'lucide-react';
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
    NAVIGATION: 'Navigation',
    HEADER: 'Header',
    FOOTER: 'Footer',
    SOCIAL: 'Social',
    BREADCRUMBS: 'Breadcrumbs',
    DIVIDER: 'Divider',
    SPACER: 'Spacer',
    CUSTOM: 'Custom',
    PRODUCT: 'Product',
    BLOG: 'Blog',
};

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'createdAt' | 'usageCount';
type SortOrder = 'asc' | 'desc';

export default function BlockTemplatesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [category, setCategory] = useState<BlockCategory | 'all'>('all');
    const [isActive, setIsActive] = useState<boolean | 'all'>('all');
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortBy>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    
    // Dialog states
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; template: { id: string; name: string } | null }>({ open: false, template: null });
    const [duplicateDialog, setDuplicateDialog] = useState<{ open: boolean; template: { id: string; name: string } | null }>({ open: false, template: null });
    const [previewDialog, setPreviewDialog] = useState<{ open: boolean; template: any | null }>({ open: false, template: null });
    const [duplicateName, setDuplicateName] = useState('');
    const [duplicateSlug, setDuplicateSlug] = useState('');
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to first page on search
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const { templates, pagination, isLoading, mutate } = useBlockTemplates({
        search: debouncedSearch || undefined,
        category: category !== 'all' ? category : undefined,
        isActive: isActive !== 'all' ? isActive : undefined,
        page,
        limit: 12,
        sortBy,
        sortOrder,
    });

    const handleDelete = async () => {
        if (!deleteDialog.template) return;

        try {
            await deleteBlockTemplate(deleteDialog.template.id);
            toast.success('Template deleted successfully');
            mutate();
            setDeleteDialog({ open: false, template: null });
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete template');
        }
    };

    const handleDuplicate = async () => {
        if (!duplicateDialog.template || !duplicateName.trim() || !duplicateSlug.trim()) {
            toast.error('Please provide both name and slug');
            return;
        }

        try {
            await duplicateBlockTemplate(duplicateDialog.template.id, duplicateName, duplicateSlug);
            toast.success('Template duplicated successfully');
            mutate();
            setDuplicateDialog({ open: false, template: null });
            setDuplicateName('');
            setDuplicateSlug('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to duplicate template');
        }
    };

    const handleToggleActive = async (template: any) => {
        setTogglingId(template.id);
        try {
            await updateBlockTemplate(template.id, { isActive: !template.isActive });
            toast.success(`Template ${!template.isActive ? 'activated' : 'deactivated'} successfully`);
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update template');
        } finally {
            setTogglingId(null);
        }
    };

    const openDuplicateDialog = (template: any) => {
        const slugBase = template.slug || template.name.toLowerCase().replace(/\s+/g, '-');
        setDuplicateName(`${template.name} (Copy)`);
        setDuplicateSlug(`${slugBase}-copy`);
        setDuplicateDialog({ open: true, template });
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('all');
        setIsActive('all');
        setPage(1);
    };

    const hasActiveFilters = search || category !== 'all' || isActive !== 'all';

    const renderPagination = () => {
        if (!pagination || pagination.totalPages <= 1) return null;

        const pages = [];
        const totalPages = pagination.totalPages;
        const currentPage = page;

        // Show first page
        if (totalPages > 0) {
            pages.push(1);
        }

        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
            pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }

        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                
                <div className="flex items-center gap-1">
                    {pages.map((p, idx) => (
                        <div key={idx}>
                            {p === '...' ? (
                                <span className="px-2 text-muted-foreground">...</span>
                            ) : (
                                <Button
                                    variant={p === currentPage ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setPage(p as number)}
                                    className="min-w-[40px]"
                                >
                                    {p}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        );
    };

    const renderTemplateCard = (template: any) => (
        <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                            {template.description || 'No description'}
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setPreviewDialog({ open: true, template })}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/cms/templates/${template.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/cms/templates/${template.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDuplicateDialog(template)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                            </DropdownMenuItem>
                            {!template.isSystem && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setDeleteDialog({ open: true, template })}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {template.thumbnail ? (
                        <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-full h-32 object-cover rounded-md"
                        />
                    ) : (
                        <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                    {template.previewUrl && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => window.open(template.previewUrl, '_blank')}
                        >
                            <ExternalLink className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{CATEGORY_LABELS[template.category]}</Badge>
                        {template.isSystem && <Badge variant="secondary">System</Badge>}
                        {template.isPro && <Badge variant="default">PRO</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={template.isActive}
                            onCheckedChange={() => handleToggleActive(template)}
                            disabled={togglingId === template.id}
                        />
                        <span className="text-xs text-muted-foreground">
                            {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <span>{template.usageCount} {template.usageCount === 1 ? 'use' : 'uses'}</span>
                    <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
            </CardFooter>
        </Card>
    );

    const renderTemplateList = (template: any) => (
        <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {template.thumbnail ? (
                            <img
                                src={template.thumbnail}
                                alt={template.name}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate">{template.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {template.description || 'No description'}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{CATEGORY_LABELS[template.category]}</Badge>
                                    {template.isSystem && <Badge variant="secondary">System</Badge>}
                                    {template.isPro && <Badge variant="default">PRO</Badge>}
                                    {!template.isActive && <Badge variant="destructive">Inactive</Badge>}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-sm font-medium">{template.usageCount} {template.usageCount === 1 ? 'use' : 'uses'}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(template.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={template.isActive}
                                        onCheckedChange={() => handleToggleActive(template)}
                                        disabled={togglingId === template.id}
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setPreviewDialog({ open: true, template })}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/admin/cms/templates/${template.id}`)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/admin/cms/templates/${template.id}/edit`)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => openDuplicateDialog(template)}>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            {!template.isSystem && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteDialog({ open: true, template })}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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

            {/* Filters and Controls */}
            <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search templates by name or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={category} onValueChange={(value) => { setCategory(value as any); setPage(1); }}>
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
                    <Select value={String(isActive)} onValueChange={(value) => { setIsActive(value === 'all' ? 'all' : value === 'true'); setPage(1); }}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={(value) => { setSortBy(value as SortBy); setPage(1); }}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="createdAt">Date Created</SelectItem>
                            <SelectItem value="usageCount">Usage Count</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={(value) => { setSortOrder(value as SortOrder); setPage(1); }}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                        >
                            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                title="Clear all filters"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Active filters:</span>
                        {search && <Badge variant="secondary">{search}</Badge>}
                        {category !== 'all' && <Badge variant="secondary">{CATEGORY_LABELS[category]}</Badge>}
                        {isActive !== 'all' && <Badge variant="secondary">{isActive ? 'Active' : 'Inactive'}</Badge>}
                    </div>
                )}
            </div>

            {/* Results Count */}
            {!isLoading && pagination && (
                <div className="mb-4 text-sm text-muted-foreground">
                    Showing {((page - 1) * (pagination.limit || 12)) + 1} to {Math.min(page * (pagination.limit || 12), pagination.total)} of {pagination.total} templates
                </div>
            )}

            {/* Templates Grid/List */}
            {isLoading ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-32 w-full" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-4 w-1/4" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : templates && templates.length > 0 ? (
                <>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                        {templates.map(template => viewMode === 'grid' ? renderTemplateCard(template) : renderTemplateList(template))}
                    </div>
                    {renderPagination()}
                </>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">No templates found</h3>
                                <p className="text-muted-foreground mt-1">
                                    {hasActiveFilters 
                                        ? 'Try adjusting your filters to see more results'
                                        : 'Get started by creating your first template'}
                                </p>
                            </div>
                            <div className="flex gap-2 justify-center">
                                {hasActiveFilters && (
                                    <Button variant="outline" onClick={clearFilters}>
                                        <X className="h-4 w-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                )}
                                <Link href="/admin/cms/templates/new">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Template
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, template: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deleteDialog.template?.name}&quot;? This action cannot be undone.
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

            {/* Duplicate Dialog */}
            <Dialog open={duplicateDialog.open} onOpenChange={(open) => !open && setDuplicateDialog({ open: false, template: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Duplicate Template</DialogTitle>
                        <DialogDescription>
                            Create a copy of &quot;{duplicateDialog.template?.name}&quot;
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="duplicate-name">Template Name *</Label>
                            <Input
                                id="duplicate-name"
                                value={duplicateName}
                                onChange={(e) => setDuplicateName(e.target.value)}
                                placeholder="Enter template name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duplicate-slug">Slug *</Label>
                            <Input
                                id="duplicate-slug"
                                value={duplicateSlug}
                                onChange={(e) => setDuplicateSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                placeholder="Enter template slug"
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly identifier (lowercase, hyphens only)
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDuplicateDialog({ open: false, template: null })}>
                            Cancel
                        </Button>
                        <Button onClick={handleDuplicate} disabled={!duplicateName.trim() || !duplicateSlug.trim()}>
                            Duplicate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={previewDialog.open} onOpenChange={(open) => !open && setPreviewDialog({ open: false, template: null })}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{previewDialog.template?.name}</DialogTitle>
                        <DialogDescription>
                            {previewDialog.template?.description || 'Template preview'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {previewDialog.template?.thumbnail && (
                            <div className="relative w-full">
                                <img
                                    src={previewDialog.template.thumbnail}
                                    alt={previewDialog.template.name}
                                    className="w-full h-auto rounded-md"
                                />
                            </div>
                        )}
                        {previewDialog.template?.previewUrl && (
                            <div className="flex justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => window.open(previewDialog.template.previewUrl, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open Full Preview
                                </Button>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Category:</span>{' '}
                                {previewDialog.template && CATEGORY_LABELS[previewDialog.template.category]}
                            </div>
                            <div>
                                <span className="font-medium">Status:</span>{' '}
                                {previewDialog.template?.isActive ? 'Active' : 'Inactive'}
                            </div>
                            <div>
                                <span className="font-medium">Usage Count:</span>{' '}
                                {previewDialog.template?.usageCount || 0}
                            </div>
                            <div>
                                <span className="font-medium">Created:</span>{' '}
                                {previewDialog.template && new Date(previewDialog.template.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewDialog({ open: false, template: null })}>
                            Close
                        </Button>
                        {previewDialog.template && (
                            <Button onClick={() => {
                                setPreviewDialog({ open: false, template: null });
                                router.push(`/admin/cms/templates/${previewDialog.template.id}/edit`);
                            }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Template
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
