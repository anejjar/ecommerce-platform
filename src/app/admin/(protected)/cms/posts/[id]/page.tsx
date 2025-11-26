'use client';

import { useState, useEffect, use, useMemo } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ArrowLeft, Save, Upload, X, Eye, Settings, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateContentStats } from '@/lib/content-stats';
import Image from 'next/image';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { cn } from '@/lib/utils';

export default function BlogPostEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [status, setStatus] = useState('DRAFT');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [featuredImage, setFeaturedImage] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');

    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (!isNew) {
            fetchPost();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/cms/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/admin/cms/posts/${id}`);
            if (response.ok) {
                const post = await response.json();
                setTitle(post.title);
                setSlug(post.slug);
                setContent(post.content);
                setExcerpt(post.excerpt || '');
                setStatus(post.status);
                setCategoryId(post.categoryId);
                setSelectedTags(post.tags?.map((t: any) => t.id) || []);
                setFeaturedImage(post.featuredImage || '');
                setSeoTitle(post.seoTitle || '');
                setSeoDescription(post.seoDescription || '');
                setIsSlugManuallyEdited(true);
            } else {
                toast.error('Failed to fetch post');
                router.push('/admin/cms/posts');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';

        if (isNew && !isSlugManuallyEdited) {
            setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const handleMediaSelect = (media: any[]) => {
        if (media.length > 0) {
            setFeaturedImage(media[0].url);
        }
        setIsMediaPickerOpen(false);
    };

    const handleSave = async () => {
        if (!title || !slug) {
            toast.error('Title and Slug are required');
            setIsSettingsOpen(true); // Open settings if slug is missing
            return;
        }

        try {
            setSaving(true);
            const url = isNew ? '/api/admin/cms/posts' : `/api/admin/cms/posts/${id}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    content,
                    excerpt,
                    status,
                    categoryId,
                    selectedTags,
                    featuredImage,
                    seoTitle,
                    seoDescription,
                }),
            });

            if (response.ok) {
                toast.success(isNew ? 'Post created' : 'Post updated');
                if (isNew) {
                    const data = await response.json();
                    router.push(`/admin/cms/posts/${data.id}`);
                }
            } else {
                const error = await response.text();
                toast.error(error || 'Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-5xl">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            {saving ? 'Saving...' : 'Saved'}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/en/blog/${slug}`, '_blank')}
                            disabled={!slug}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>

                        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Post Settings</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="grid gap-2">
                                        <Label>Slug</Label>
                                        <Input
                                            value={slug}
                                            onChange={(e) => {
                                                setSlug(e.target.value);
                                                setIsSlugManuallyEdited(true);
                                            }}
                                            placeholder="post-slug"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Excerpt</Label>
                                        <Textarea
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            placeholder="Short summary for list views and SEO"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <Select value={categoryId || ''} onValueChange={setCategoryId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>SEO Title</Label>
                                        <Input
                                            value={seoTitle}
                                            onChange={(e) => setSeoTitle(e.target.value)}
                                            placeholder="Meta title"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>SEO Description</Label>
                                        <Textarea
                                            value={seoDescription}
                                            onChange={(e) => setSeoDescription(e.target.value)}
                                            placeholder="Meta description"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="PUBLISHED">Published</SelectItem>
                                <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
                            Publish
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Cover Image */}
                <div className="mb-8 group relative">
                    {featuredImage ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                            <Image
                                src={featuredImage}
                                alt="Cover"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsMediaPickerOpen(true)}
                                >
                                    Change
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setFeaturedImage('')}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            className="w-full h-20 border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/50 text-muted-foreground flex flex-col gap-2"
                            onClick={() => setIsMediaPickerOpen(true)}
                        >
                            <ImageIcon className="w-6 h-6" />
                            <span>Add Cover Image</span>
                        </Button>
                    )}
                </div>

                {/* Title */}
                <div className="mb-4">
                    <Textarea
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Title"
                        className="w-full resize-none overflow-hidden bg-transparent text-4xl font-bold border-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/50 min-h-[60px]"
                        rows={1}
                    />
                </div>

                {/* Editor */}
                <RichTextEditor content={content} onChange={setContent} />
            </main>

            <MediaPicker
                open={isMediaPickerOpen}
                onOpenChange={setIsMediaPickerOpen}
                onSelect={handleMediaSelect}
                type="IMAGE"
                multiple={false}
            />
        </div>
    );
}
