'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    _count: {
        posts: number;
    };
}

interface Tag {
    id: string;
    name: string;
    slug: string;
    _count: {
        posts: number;
    };
}

export default function CategoriesTagsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isTagOpen, setIsTagOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemSlug, setNewItemSlug] = useState('');
    const [newItemDescription, setNewItemDescription] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catRes, tagRes] = await Promise.all([
                fetch('/api/admin/cms/categories'),
                fetch('/api/admin/cms/tags'),
            ]);

            if (catRes.ok && tagRes.ok) {
                setCategories(await catRes.json());
                setTags(await tagRes.json());
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setNewItemName(name);
        if (!newItemSlug) {
            setNewItemSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const handleCreateCategory = async () => {
        if (!newItemName || !newItemSlug) return;

        try {
            const response = await fetch('/api/admin/cms/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newItemName,
                    slug: newItemSlug,
                    description: newItemDescription,
                }),
            });

            if (response.ok) {
                toast.success('Category created');
                setIsCategoryOpen(false);
                resetForm();
                fetchData();
            } else {
                toast.error('Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error('An error occurred');
        }
    };

    const handleCreateTag = async () => {
        if (!newItemName || !newItemSlug) return;

        try {
            const response = await fetch('/api/admin/cms/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newItemName,
                    slug: newItemSlug,
                }),
            });

            if (response.ok) {
                toast.success('Tag created');
                setIsTagOpen(false);
                resetForm();
                fetchData();
            } else {
                toast.error('Failed to create tag');
            }
        } catch (error) {
            console.error('Error creating tag:', error);
            toast.error('An error occurred');
        }
    };

    const resetForm = () => {
        setNewItemName('');
        setNewItemSlug('');
        setNewItemDescription('');
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Categories & Tags</h1>
                <p className="text-muted-foreground">Manage content organization</p>
            </div>

            <Tabs defaultValue="categories">
                <TabsList>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Category</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={newItemName} onChange={handleNameChange} placeholder="Category Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug</Label>
                                        <Input value={newItemSlug} onChange={(e) => setNewItemSlug(e.target.value)} placeholder="category-slug" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} placeholder="Description" />
                                    </div>
                                    <Button onClick={handleCreateCategory} className="w-full">Create Category</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Posts</TableHead>
                                    <TableHead>Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No categories found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                            <TableCell>{category._count.posts}</TableCell>
                                            <TableCell className="text-muted-foreground truncate max-w-xs">
                                                {category.description || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="tags" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isTagOpen} onOpenChange={setIsTagOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Tag
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Tag</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={newItemName} onChange={handleNameChange} placeholder="Tag Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug</Label>
                                        <Input value={newItemSlug} onChange={(e) => setNewItemSlug(e.target.value)} placeholder="tag-slug" />
                                    </div>
                                    <Button onClick={handleCreateTag} className="w-full">Create Tag</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Posts</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                            No tags found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tags.map((tag) => (
                                        <TableRow key={tag.id}>
                                            <TableCell className="font-medium">{tag.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                                            <TableCell>{tag._count.posts}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
