'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createLandingPage } from '@/hooks/useLandingPages';

export default function NewLandingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const page = await createLandingPage(formData);
            toast.success('Landing page created successfully');
            router.push(`/admin/cms/landing-pages/${page.id}/editor`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to create landing page');
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Auto-generate slug from title if slug hasn't been manually edited
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                ? slug
                : prev.slug
        }));
    };

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <div className="mb-8">
                <Link
                    href="/admin/cms/landing-pages"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Landing Pages
                </Link>
                <h1 className="text-3xl font-bold">Create New Landing Page</h1>
                <p className="text-muted-foreground mt-1">
                    Start building your new page
                </p>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Summer Sale 2024"
                            value={formData.title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">/</span>
                            <Input
                                id="slug"
                                placeholder="summer-sale-2024"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                required
                                pattern="^[a-z0-9-]+$"
                                title="Only lowercase letters, numbers, and hyphens are allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                            id="description"
                            placeholder="Brief description for internal use"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/admin/cms/landing-pages">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create & Start Editing
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
