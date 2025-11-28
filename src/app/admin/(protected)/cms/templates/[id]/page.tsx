'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { ArrowLeft, Edit, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useBlockTemplate, deleteBlockTemplate } from '@/hooks/useBlockTemplates';
import { BlockCategory } from '@prisma/client';

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

export default function BlockTemplateViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { template, isLoading, mutate } = useBlockTemplate(id);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteBlockTemplate(id);
            toast.success('Template deleted successfully');
            router.push('/admin/cms/templates');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete template');
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 max-w-4xl">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-96 mb-8" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="container mx-auto py-8 max-w-4xl">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <p className="text-muted-foreground mb-4">Template not found</p>
                        <Link href="/admin/cms/templates">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Templates
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-8">
                <Link
                    href="/admin/cms/templates"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Templates
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{template.name}</h1>
                        <p className="text-muted-foreground mt-1">
                            {template.description || 'No description'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/cms/templates/${template.id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="mt-1">{template.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                <p className="mt-1 font-mono text-sm">{template.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Category</p>
                                <div className="mt-1">
                                    <Badge variant="outline">{CATEGORY_LABELS[template.category]}</Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <div className="mt-1 flex gap-2">
                                    {template.isActive ? (
                                        <Badge variant="default">Active</Badge>
                                    ) : (
                                        <Badge variant="secondary">Inactive</Badge>
                                    )}
                                    {template.isSystem && <Badge variant="secondary">System</Badge>}
                                    {template.isPro && <Badge variant="default">PRO</Badge>}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Usage Count</p>
                                <p className="mt-1">{template.usageCount} {template.usageCount === 1 ? 'use' : 'uses'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Created</p>
                                <p className="mt-1">{new Date(template.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        {template.thumbnail && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Thumbnail</p>
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    className="w-full max-w-md h-48 object-cover rounded-md"
                                />
                            </div>
                        )}

                        {template.previewUrl && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Preview</p>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open(template.previewUrl, '_blank')}
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open Preview
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Default Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                            {JSON.stringify(template.defaultConfig, null, 2)}
                        </pre>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                            {JSON.stringify(template.configSchema, null, 2)}
                        </pre>
                    </CardContent>
                </Card>

                {/* Component Code */}
                <Card>
                    <CardHeader>
                        <CardTitle>Component Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono">
                            {template.componentCode}
                        </pre>
                    </CardContent>
                </Card>

                {template.htmlTemplate && (
                    <Card>
                        <CardHeader>
                            <CardTitle>HTML Template</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono">
                                {template.htmlTemplate}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                {template.cssStyles && (
                    <Card>
                        <CardHeader>
                            <CardTitle>CSS Styles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono">
                                {template.cssStyles}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                {!template.isSystem && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Template
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{template?.name}&quot;? This action cannot be undone.
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

