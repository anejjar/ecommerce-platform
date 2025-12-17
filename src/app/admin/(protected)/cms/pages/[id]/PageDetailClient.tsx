'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ArrowLeft, Save, Blocks, FileText, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('DRAFT');
    const [useStorefrontLayout, setUseStorefrontLayout] = useState(true);
    const [useBlockEditor, setUseBlockEditor] = useState(false);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [seoKeywords, setSeoKeywords] = useState('');
    const [ogImage, setOgImage] = useState('');
    const [ogTitle, setOgTitle] = useState('');
    const [ogDescription, setOgDescription] = useState('');
    const [customCss, setCustomCss] = useState('');
    const [customJs, setCustomJs] = useState('');
    const [viewCount, setViewCount] = useState(0);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [overridesStorefrontPage, setOverridesStorefrontPage] = useState(false);
    const [overriddenPageType, setOverriddenPageType] = useState<string>('');

    useEffect(() => {
        if (!isNew) {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        try {
            const response = await fetch(`/api/admin/cms/pages/${id}`);
            if (response.ok) {
                const page = await response.json();
                setTitle(page.title);
                setSlug(page.slug);
                setDescription(page.description || '');
                setContent(page.content || '');
                setStatus(page.status);
                setUseStorefrontLayout(page.useStorefrontLayout ?? true);
                setUseBlockEditor(page.useBlockEditor ?? false);
                setSeoTitle(page.seoTitle || '');
                setSeoDescription(page.seoDescription || '');
                setSeoKeywords(page.seoKeywords || '');
                setOgImage(page.ogImage || '');
                setOgTitle(page.ogTitle || '');
                setOgDescription(page.ogDescription || '');
                setCustomCss(page.customCss || '');
                setCustomJs(page.customJs || '');
                setViewCount(page.viewCount || 0);
                setOverridesStorefrontPage(page.overridesStorefrontPage ?? false);
                setOverriddenPageType(page.overriddenPageType || '');
                setIsSlugManuallyEdited(true);
            } else {
                toast.error('Failed to fetch page');
                router.push('/admin/cms/pages');
            }
        } catch (error) {
            console.error('Error fetching page:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (isNew && !isSlugManuallyEdited && !overridesStorefrontPage) {
            setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const handleOverrideTypeChange = (value: string) => {
        setOverriddenPageType(value);
        
        // Auto-set slug based on override type
        // Note: HOME uses special slug "_home" for database, but represents the root route
        const slugMap: Record<string, string> = {
            'HOME': '_home',
            'SHOP': 'shop',
            'PRODUCT': 'product',
            'CART': 'cart',
            'CHECKOUT': 'checkout',
            'BLOG': 'blog',
            'BLOG_POST': 'blog',
        };
        
        const newSlug = slugMap[value] || '';
        setSlug(newSlug);
        setIsSlugManuallyEdited(false);
    };

    const handleOverrideToggle = (checked: boolean) => {
        setOverridesStorefrontPage(checked);
        if (!checked) {
            setOverriddenPageType('');
            setIsSlugManuallyEdited(false);
            // Reset slug to auto-generated from title if it was set by override
            if (isNew && title) {
                setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
            }
        }
    };

    const handleSave = async () => {
        if (!title || !slug) {
            toast.error('Title and Slug are required');
            return;
        }

        try {
            setSaving(true);
            const url = isNew ? '/api/admin/cms/pages' : `/api/admin/cms/pages/${id}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    description,
                    content,
                    status,
                    useStorefrontLayout,
                    useBlockEditor,
                    seoTitle,
                    seoDescription,
                    seoKeywords,
                    ogImage,
                    ogTitle,
                    ogDescription,
                    customCss,
                    customJs,
                    overridesStorefrontPage,
                    overriddenPageType: overridesStorefrontPage ? overriddenPageType : null,
                }),
            });

            if (response.ok) {
                toast.success(isNew ? 'Page created' : 'Page updated');
                if (isNew) {
                    const data = await response.json();
                    router.push(`/admin/cms/pages/${data.id}`);
                }
            } else {
                const error = await response.text();
                toast.error(error || 'Failed to save page');
            }
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">{isNew ? 'Create Page' : 'Edit Page'}</h1>
                </div>
                <div className="flex gap-2">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={title} onChange={handleTitleChange} placeholder="Page title" />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(e.target.value);
                                        setIsSlugManuallyEdited(true);
                                    }}
                                    placeholder="page-slug"
                                    disabled={overridesStorefrontPage}
                                    className={overridesStorefrontPage ? 'bg-muted cursor-not-allowed' : ''}
                                />
                                {overridesStorefrontPage && (
                                    <p className="text-xs text-muted-foreground">
                                        Slug is automatically set based on the selected override type.
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Page description"
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Content Editor</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant={!useBlockEditor ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setUseBlockEditor(false)}
                                        >
                                            <FileText className="w-4 h-4 mr-1" />
                                            Rich Text
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={useBlockEditor ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => {
                                                setUseBlockEditor(true);
                                                if (!isNew && id !== 'new') {
                                                    router.push(`/admin/cms/pages/${id}/editor`);
                                                }
                                            }}
                                        >
                                            <Blocks className="w-4 h-4 mr-1" />
                                            Blocks
                                        </Button>
                                    </div>
                                </div>
                                {useBlockEditor ? (
                                    <div className="border rounded-lg p-4 bg-muted/50 text-center">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            This page uses the block editor. Click the button above to edit blocks.
                                        </p>
                                        {!isNew && id !== 'new' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/admin/cms/pages/${id}/editor`)}
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Open Block Editor
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <RichTextEditor content={content} onChange={setContent} />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Storefront Override</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="overridesStorefrontPage"
                                    checked={overridesStorefrontPage}
                                    onCheckedChange={handleOverrideToggle}
                                />
                                <Label htmlFor="overridesStorefrontPage">Override storefront default page</Label>
                            </div>
                            {overridesStorefrontPage && (
                                <div className="space-y-2 pl-6 border-l-2 border-primary/20">
                                    <Label>Override Page Type</Label>
                                    <Select value={overriddenPageType} onValueChange={handleOverrideTypeChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select page to override" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HOME">Homepage</SelectItem>
                                            <SelectItem value="SHOP">Shop</SelectItem>
                                            <SelectItem value="PRODUCT">Product Page</SelectItem>
                                            <SelectItem value="CART">Cart</SelectItem>
                                            <SelectItem value="CHECKOUT">Checkout</SelectItem>
                                            <SelectItem value="BLOG">Blog</SelectItem>
                                            <SelectItem value="BLOG_POST">Blog Post</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        This page will replace the selected default storefront page when published.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Layout Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="useStorefrontLayout"
                                    checked={useStorefrontLayout}
                                    onCheckedChange={(checked) => setUseStorefrontLayout(checked as boolean)}
                                />
                                <Label htmlFor="useStorefrontLayout">Use Storefront Layout</Label>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                If checked, the page will include the store's header and footer.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="basic">Basic SEO</TabsTrigger>
                                    <TabsTrigger value="social">Social Media</TabsTrigger>
                                </TabsList>
                                <TabsContent value="basic" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>SEO Title</Label>
                                        <Input
                                            value={seoTitle}
                                            onChange={(e) => setSeoTitle(e.target.value)}
                                            placeholder="Meta title (defaults to page title)"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SEO Description</Label>
                                        <Textarea
                                            value={seoDescription}
                                            onChange={(e) => setSeoDescription(e.target.value)}
                                            placeholder="Meta description"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SEO Keywords</Label>
                                        <Input
                                            value={seoKeywords}
                                            onChange={(e) => setSeoKeywords(e.target.value)}
                                            placeholder="Comma-separated keywords"
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="social" className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Open Graph Image URL</Label>
                                        <Input
                                            value={ogImage}
                                            onChange={(e) => setOgImage(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Open Graph Title</Label>
                                        <Input
                                            value={ogTitle}
                                            onChange={(e) => setOgTitle(e.target.value)}
                                            placeholder="Social media title"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Open Graph Description</Label>
                                        <Textarea
                                            value={ogDescription}
                                            onChange={(e) => setOgDescription(e.target.value)}
                                            placeholder="Social media description"
                                            rows={3}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Advanced Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Custom CSS</Label>
                                <Textarea
                                    value={customCss}
                                    onChange={(e) => setCustomCss(e.target.value)}
                                    placeholder="/* Custom CSS */"
                                    rows={6}
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Custom JavaScript</Label>
                                <Textarea
                                    value={customJs}
                                    onChange={(e) => setCustomJs(e.target.value)}
                                    placeholder="// Custom JavaScript"
                                    rows={6}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {!isNew && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>View Count</Label>
                                    <Input
                                        value={viewCount}
                                        readOnly
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Total number of times this page has been viewed.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
