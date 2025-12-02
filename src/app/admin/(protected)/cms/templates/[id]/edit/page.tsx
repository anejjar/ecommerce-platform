'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useBlockTemplate, updateBlockTemplate } from '@/hooks/useBlockTemplates';
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

export default function EditBlockTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { template, isLoading, mutate } = useBlockTemplate(id);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        category: 'CUSTOM' as BlockCategory,
        thumbnail: '',
        previewUrl: '',
        defaultConfig: '{}',
        configSchema: '{}',
        componentCode: '',
        htmlTemplate: '',
        cssStyles: '',
        isActive: true,
        isPro: false,
    });

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name,
                slug: template.slug,
                description: template.description || '',
                category: template.category,
                thumbnail: template.thumbnail || '',
                previewUrl: template.previewUrl || '',
                defaultConfig: JSON.stringify(template.defaultConfig, null, 2),
                configSchema: JSON.stringify(template.configSchema, null, 2),
                componentCode: template.componentCode,
                htmlTemplate: template.htmlTemplate || '',
                cssStyles: template.cssStyles || '',
                isActive: template.isActive,
                isPro: template.isPro,
            });
        }
    }, [template]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Validate JSON fields
            let defaultConfig, configSchema;
            try {
                defaultConfig = JSON.parse(formData.defaultConfig);
            } catch {
                toast.error('Invalid JSON in Default Config');
                setSaving(false);
                return;
            }

            try {
                configSchema = JSON.parse(formData.configSchema);
            } catch {
                toast.error('Invalid JSON in Config Schema');
                setSaving(false);
                return;
            }

            await updateBlockTemplate(id, {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || null,
                category: formData.category,
                thumbnail: formData.thumbnail || null,
                previewUrl: formData.previewUrl || null,
                defaultConfig,
                configSchema,
                componentCode: formData.componentCode,
                htmlTemplate: formData.htmlTemplate || null,
                cssStyles: formData.cssStyles || null,
                isActive: formData.isActive,
                isPro: formData.isPro,
            });

            toast.success('Template updated successfully');
            mutate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update template');
        } finally {
            setSaving(false);
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
                <h1 className="text-3xl font-bold">Edit Template</h1>
                <p className="text-muted-foreground mt-1">
                    {template.name}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Template Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') }))}
                                required
                                pattern="^[a-z0-9-]+$"
                                disabled={template.isSystem}
                            />
                            {template.isSystem && (
                                <p className="text-xs text-muted-foreground">
                                    System templates cannot have their slug changed
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as BlockCategory }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="thumbnail">Thumbnail URL</Label>
                            <Input
                                id="thumbnail"
                                type="url"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="previewUrl">Preview URL</Label>
                            <Input
                                id="previewUrl"
                                type="url"
                                value={formData.previewUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, previewUrl: e.target.value }))}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="space-y-0.5">
                                <Label>Active</Label>
                                <p className="text-sm text-muted-foreground">
                                    Template will be available for use
                                </p>
                            </div>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Pro Template</Label>
                                <p className="text-sm text-muted-foreground">
                                    Mark as premium template
                                </p>
                            </div>
                            <Switch
                                checked={formData.isPro}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPro: checked }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="defaultConfig">Default Config (JSON) *</Label>
                            <Textarea
                                id="defaultConfig"
                                value={formData.defaultConfig}
                                onChange={(e) => setFormData(prev => ({ ...prev, defaultConfig: e.target.value }))}
                                className="font-mono text-sm"
                                rows={8}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="configSchema">Config Schema (JSON) *</Label>
                            <Textarea
                                id="configSchema"
                                value={formData.configSchema}
                                onChange={(e) => setFormData(prev => ({ ...prev, configSchema: e.target.value }))}
                                className="font-mono text-sm"
                                rows={8}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Component Code</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="componentCode">React Component Code *</Label>
                            <Textarea
                                id="componentCode"
                                value={formData.componentCode}
                                onChange={(e) => setFormData(prev => ({ ...prev, componentCode: e.target.value }))}
                                className="font-mono text-sm"
                                rows={20}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="htmlTemplate">HTML Template (Optional)</Label>
                            <Textarea
                                id="htmlTemplate"
                                value={formData.htmlTemplate}
                                onChange={(e) => setFormData(prev => ({ ...prev, htmlTemplate: e.target.value }))}
                                className="font-mono text-sm"
                                rows={10}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cssStyles">CSS Styles (Optional)</Label>
                            <Textarea
                                id="cssStyles"
                                value={formData.cssStyles}
                                onChange={(e) => setFormData(prev => ({ ...prev, cssStyles: e.target.value }))}
                                className="font-mono text-sm"
                                rows={10}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/cms/templates">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

