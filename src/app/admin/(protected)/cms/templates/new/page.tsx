'use client';

import { useState } from 'react';
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
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createBlockTemplate } from '@/hooks/useBlockTemplates';
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

export default function NewBlockTemplatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        category: 'CUSTOM' as BlockCategory,
        thumbnail: '',
        previewUrl: '',
        defaultConfig: '{}',
        configSchema: '{}',
        componentCode: `export default function BlockTemplate({ config }) {
  return (
    <div className="block-template">
      <h1>{config.title || 'Block Template'}</h1>
      {/* Your component code here */}
    </div>
  );
}`,
        htmlTemplate: '',
        cssStyles: '',
        isActive: true,
        isPro: false,
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        setFormData(prev => ({
            ...prev,
            name,
            slug: prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                ? slug
                : prev.slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate JSON fields
            let defaultConfig, configSchema;
            try {
                defaultConfig = JSON.parse(formData.defaultConfig);
            } catch {
                toast.error('Invalid JSON in Default Config');
                setLoading(false);
                return;
            }

            try {
                configSchema = JSON.parse(formData.configSchema);
            } catch {
                toast.error('Invalid JSON in Config Schema');
                setLoading(false);
                return;
            }

            const template = await createBlockTemplate({
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

            toast.success('Template created successfully');
            router.push(`/admin/cms/templates/${template.id}/edit`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to create template');
        } finally {
            setLoading(false);
        }
    };

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
                <h1 className="text-3xl font-bold">Create New Block Template</h1>
                <p className="text-muted-foreground mt-1">
                    Create a reusable content block template
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
                                placeholder="e.g. Hero Section with Image"
                                value={formData.name}
                                onChange={handleNameChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug *</Label>
                            <Input
                                id="slug"
                                placeholder="hero-section-with-image"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') }))}
                                required
                                pattern="^[a-z0-9-]+$"
                                title="Only lowercase letters, numbers, and hyphens are allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly identifier (lowercase, hyphens only)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of this template"
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
                                placeholder="https://example.com/thumbnail.jpg"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="previewUrl">Preview URL</Label>
                            <Input
                                id="previewUrl"
                                type="url"
                                placeholder="https://example.com/preview"
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
                                rows={6}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Default configuration values as JSON object
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="configSchema">Config Schema (JSON) *</Label>
                            <Textarea
                                id="configSchema"
                                value={formData.configSchema}
                                onChange={(e) => setFormData(prev => ({ ...prev, configSchema: e.target.value }))}
                                className="font-mono text-sm"
                                rows={6}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Field definitions for the configuration form
                            </p>
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
                                rows={15}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                React component code that receives config as props
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="htmlTemplate">HTML Template (Optional)</Label>
                            <Textarea
                                id="htmlTemplate"
                                value={formData.htmlTemplate}
                                onChange={(e) => setFormData(prev => ({ ...prev, htmlTemplate: e.target.value }))}
                                className="font-mono text-sm"
                                rows={8}
                                placeholder="Fallback HTML template"
                            />
                            <p className="text-xs text-muted-foreground">
                                Fallback HTML template if component code fails
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cssStyles">CSS Styles (Optional)</Label>
                            <Textarea
                                id="cssStyles"
                                value={formData.cssStyles}
                                onChange={(e) => setFormData(prev => ({ ...prev, cssStyles: e.target.value }))}
                                className="font-mono text-sm"
                                rows={8}
                                placeholder="/* Scoped CSS styles */"
                            />
                            <p className="text-xs text-muted-foreground">
                                Scoped CSS styles for this template
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/cms/templates">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Create Template
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

