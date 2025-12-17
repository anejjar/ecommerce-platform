'use client';

import { useState, useEffect, use, useRef, useCallback } from 'react';
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { 
    ArrowLeft, 
    Save, 
    Eye, 
    Settings, 
    Image as ImageIcon,
    X,
    Maximize2,
    Minimize2,
    Loader2,
    CheckCircle2,
    Clock,
    FileText,
    ChevronRight,
    Upload,
    Link2,
    FileText as FileTextIcon,
    Tag,
    Search,
    Info,
    AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateContentStats, formatReadingTime } from '@/lib/content-stats';
import Image from 'next/image';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { cn } from '@/lib/utils';

export default function BlogPostEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === 'new';
    const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

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

    // Calculate content stats
    const contentStats = calculateContentStats(content);
    const titleStats = calculateContentStats(title);

    useEffect(() => {
        fetchCategories();
        if (!isNew) {
            fetchPost();
        } else {
            // Focus title on new post
            setTimeout(() => {
                titleTextareaRef.current?.focus();
            }, 100);
        }
    }, [id]);

    const handleSave = useCallback(async () => {
        // Auto-generate slug if title exists but slug doesn't
        let finalSlug = slug;
        if (title && !slug) {
            finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setSlug(finalSlug);
            setIsSlugManuallyEdited(false);
        }

        if (!title || !finalSlug) {
            toast.error('Title is required');
            if (!title) {
                titleTextareaRef.current?.focus();
            } else {
                setIsSettingsOpen(true);
            }
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
                    slug: finalSlug,
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
                const data = await response.json();
                toast.success(isNew ? 'Post created' : 'Post updated');
                setLastSaved(new Date());
                if (isNew) {
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
    }, [title, slug, content, excerpt, status, categoryId, selectedTags, featuredImage, seoTitle, seoDescription, isNew, id, router]);

    // Auto-save functionality
    useEffect(() => {
        if (isNew || !title || !slug) return;

        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
            autoSave();
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [title, slug, content, excerpt, status, categoryId, featuredImage, seoTitle, seoDescription]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            // Ctrl/Cmd + K to toggle focus mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsFocusMode(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

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
                setLastSaved(new Date(post.updatedAt || post.createdAt));
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

    const autoSave = async () => {
        if (!title || !slug || saving) return;

        try {
            setAutoSaving(true);
            const url = `/api/admin/cms/posts/${id}`;
            const response = await fetch(url, {
                method: 'PUT',
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
                setLastSaved(new Date());
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            setAutoSaving(false);
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            // Open media picker or handle file upload
            setIsMediaPickerOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className={cn(
            "min-h-screen bg-background transition-all duration-300",
            isFocusMode && "bg-gradient-to-b from-background to-muted/20"
        )}>
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2 text-sm">
                            {autoSaving ? (
                                <>
                                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                    <span className="text-muted-foreground">Saving...</span>
                                </>
                            ) : lastSaved ? (
                                <>
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    <span className="text-muted-foreground">
                                        Saved {lastSaved.toLocaleTimeString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-muted-foreground">Not saved</span>
                            )}
                        </div>
                        {!isNew && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <span>{contentStats.wordCount} words</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatReadingTime(contentStats.readingTimeMinutes)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            title="Toggle Focus Mode (Ctrl+K)"
                        >
                            {isFocusMode ? (
                                <Minimize2 className="w-4 h-4 mr-2" />
                            ) : (
                                <Maximize2 className="w-4 h-4 mr-2" />
                            )}
                            Focus
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/en/blog/${slug}`, '_blank')}
                            disabled={!slug}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>

                        <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                                <SheetHeader className="pb-4 border-b">
                                    <SheetTitle className="flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Post Settings
                                    </SheetTitle>
                                    <SheetDescription>
                                        Configure your post settings, metadata, and SEO
                                    </SheetDescription>
                                </SheetHeader>
                                
                                <div className="space-y-6 py-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <FileTextIcon className="w-4 h-4" />
                                            Basic Information
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="slug" className="flex items-center gap-2">
                                                <Link2 className="w-4 h-4 text-muted-foreground" />
                                                URL Slug
                                            </Label>
                                            <Input
                                                id="slug"
                                                value={slug}
                                                onChange={(e) => {
                                                    setSlug(e.target.value);
                                                    setIsSlugManuallyEdited(true);
                                                }}
                                                placeholder="post-slug"
                                                className="font-mono"
                                            />
                                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <span>URL-friendly identifier. Auto-generated from title if left empty.</span>
                                            </div>
                                            {slug && (
                                                <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                                                    /blog/{slug}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="excerpt" className="flex items-center gap-2">
                                                <FileTextIcon className="w-4 h-4 text-muted-foreground" />
                                                Excerpt
                                            </Label>
                                            <Textarea
                                                id="excerpt"
                                                value={excerpt}
                                                onChange={(e) => setExcerpt(e.target.value)}
                                                placeholder="Short summary for list views and SEO (optional)"
                                                rows={3}
                                                className="resize-none"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                {excerpt.length} characters
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="category" className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-muted-foreground" />
                                                Category
                                            </Label>
                                            <Select value={categoryId || ''} onValueChange={setCategoryId}>
                                                <SelectTrigger id="category">
                                                    <SelectValue placeholder="Select a category (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">No category</SelectItem>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* SEO Settings */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <Search className="w-4 h-4" />
                                            SEO Settings
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="seo-title" className="flex items-center gap-2">
                                                SEO Title
                                                <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                                            </Label>
                                            <Input
                                                id="seo-title"
                                                value={seoTitle}
                                                onChange={(e) => setSeoTitle(e.target.value)}
                                                placeholder="Custom meta title for search engines"
                                                maxLength={60}
                                            />
                                            <div className="flex items-center justify-between">
                                                <p className={cn(
                                                    "text-xs",
                                                    seoTitle.length > 60 ? "text-red-600" : "text-muted-foreground"
                                                )}>
                                                    {seoTitle.length}/60 characters
                                                </p>
                                                {seoTitle.length > 60 && (
                                                    <div className="flex items-center gap-1 text-xs text-red-600">
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span>Too long</span>
                                                    </div>
                                                )}
                                            </div>
                                            {!seoTitle && (
                                                <p className="text-xs text-muted-foreground">
                                                    If empty, the post title will be used
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="seo-description" className="flex items-center gap-2">
                                                SEO Description
                                                <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                                            </Label>
                                            <Textarea
                                                id="seo-description"
                                                value={seoDescription}
                                                onChange={(e) => setSeoDescription(e.target.value)}
                                                placeholder="Meta description for search engines"
                                                rows={3}
                                                className="resize-none"
                                                maxLength={160}
                                            />
                                            <div className="flex items-center justify-between">
                                                <p className={cn(
                                                    "text-xs",
                                                    seoDescription.length > 160 ? "text-red-600" : "text-muted-foreground"
                                                )}>
                                                    {seoDescription.length}/160 characters
                                                </p>
                                                {seoDescription.length > 160 && (
                                                    <div className="flex items-center gap-1 text-xs text-red-600">
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span>Too long</span>
                                                    </div>
                                                )}
                                            </div>
                                            {!seoDescription && (
                                                <p className="text-xs text-muted-foreground">
                                                    If empty, the excerpt will be used
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Post Status */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <Info className="w-4 h-4" />
                                            Publication Status
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select value={status} onValueChange={setStatus}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    {status === 'DRAFT' && 'Post is saved but not visible to the public'}
                                                    {status === 'PUBLISHED' && 'Post is live and visible to all visitors'}
                                                    {status === 'ARCHIVED' && 'Post is hidden from public view'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

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

                        <Button 
                            onClick={handleSave} 
                            disabled={saving || autoSaving}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isNew ? 'Publish' : 'Update'}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={cn(
                "container mx-auto px-4 py-8 transition-all duration-300",
                isFocusMode ? "max-w-3xl" : "max-w-5xl"
            )}>
                {/* Cover Image */}
                <div 
                    className={cn(
                        "mb-8 group relative transition-all",
                        isDragging && "ring-2 ring-primary ring-offset-2"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {featuredImage ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg border">
                            <Image
                                src={featuredImage}
                                alt="Cover"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsMediaPickerOpen(true)}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Change
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setFeaturedImage('')}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsMediaPickerOpen(true)}
                            className={cn(
                                "w-full h-32 border-2 border-dashed rounded-lg transition-all",
                                "hover:border-primary hover:bg-muted/50",
                                "flex flex-col items-center justify-center gap-2 text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                isDragging && "border-primary bg-primary/5"
                            )}
                        >
                            <ImageIcon className="w-8 h-8" />
                            <span className="text-sm font-medium">Add Cover Image</span>
                            <span className="text-xs">Click or drag and drop</span>
                        </button>
                    )}
                </div>

                {/* Title */}
                <div className="mb-6">
                    <Textarea
                        ref={titleTextareaRef}
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Post title..."
                        className="w-full resize-none overflow-hidden bg-transparent text-4xl font-bold border-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/50 min-h-[60px] leading-tight"
                        rows={1}
                    />
                    {title && (
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{titleStats.wordCount} words</span>
                            {slug && (
                                <span className="font-mono">/{slug}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Editor */}
                <div className="relative">
                    <RichTextEditor content={content} onChange={setContent} />
                    {content && (
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                            <div className="flex items-center gap-4">
                                <span>{contentStats.wordCount} words</span>
                                <span>{contentStats.characterCount} characters</span>
                                <span>{formatReadingTime(contentStats.readingTimeMinutes)}</span>
                            </div>
                            <div className="text-xs">
                                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+S</kbd> to save
                            </div>
                        </div>
                    )}
                </div>
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
