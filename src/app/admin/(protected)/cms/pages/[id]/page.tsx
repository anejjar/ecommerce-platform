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
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('DRAFT');
    const [useStorefrontLayout, setUseStorefrontLayout] = useState(true);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

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
                setContent(page.content);
                setStatus(page.status);
                setUseStorefrontLayout(page.useStorefrontLayout ?? true);
                setSeoTitle(page.seoTitle || '');
                setSeoDescription(page.seoDescription || '');
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
        if (isNew && !isSlugManuallyEdited) {
            setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
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
                    content,
                    status,
                    useStorefrontLayout,
                    seoTitle,
                    seoDescription,
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
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <RichTextEditor content={content} onChange={setContent} />
                            </div>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
