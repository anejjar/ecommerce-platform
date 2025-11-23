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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit2 } from 'lucide-react';
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

export function CategoryTagManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isTagOpen, setIsTagOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
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
        if (!newItemSlug && !editingCategory && !editingTag) {
            setNewItemSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const openEditCategory = (category: Category) => {
        setEditingCategory(category);
        setNewItemName(category.name);
        setNewItemSlug(category.slug);
        setNewItemDescription(category.description || '');
        setIsCategoryOpen(true);
    };

    const openEditTag = (tag: Tag) => {
        setEditingTag(tag);
        setNewItemName(tag.name);
        setNewItemSlug(tag.slug);
        setIsTagOpen(true);
    };

    const handleCreateCategory = async () => {
        if (!newItemName || !newItemSlug) return;

        try {
            const url = editingCategory
                ? `/api/admin/cms/categories/${editingCategory.id}`
                : '/api/admin/cms/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newItemName,
                    slug: newItemSlug,
                    description: newItemDescription,
                }),
            });

            if (response.ok) {
                toast.success(editingCategory ? 'Category updated' : 'Category created');
                setIsCategoryOpen(false);
                resetForm();
                fetchData();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to save category');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('An error occurred');
        }
    };

    const handleCreateTag = async () => {
        if (!newItemName || !newItemSlug) return;

        try {
            const url = editingTag
                ? `/api/admin/cms/tags/${editingTag.id}`
                : '/api/admin/cms/tags';
            const method = editingTag ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newItemName,
                    slug: newItemSlug,
                }),
            });

            if (response.ok) {
                toast.success(editingTag ? 'Tag updated' : 'Tag created');
                setIsTagOpen(false);
                resetForm();
                fetchData();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to save tag');
            }
        } catch (error) {
            console.error('Error saving tag:', error);
            toast.error('An error occurred');
        }
    };

    const handleDeleteCategory = async (id: string, postCount: number) => {
        if (postCount > 0) {
            toast.error('Cannot delete category with posts');
            return;
        }

        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`/api/admin/cms/categories/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Category deleted');
                fetchData();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('An error occurred');
        }
    };

    const handleDeleteTag = async (id: string, postCount: number) => {
        if (postCount > 0) {
            toast.error('Cannot delete tag with posts');
            return;
        }

        if (!confirm('Are you sure you want to delete this tag?')) return;

        try {
            const response = await fetch(`/api/admin/cms/tags/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Tag deleted');
                fetchData();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to delete tag');
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
            toast.error('An error occurred');
        }
    };

    const resetForm = () => {
        setNewItemName('');
        setNewItemSlug('');
        setNewItemDescription('');
        setEditingCategory(null);
        setEditingTag(null);
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
                        <Dialog open={isCategoryOpen} onOpenChange={(open) => {
                            setIsCategoryOpen(open);
                            if (!open) resetForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingCategory ? 'Edit Category' : 'Create Category'}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={newItemName}
                                            onChange={handleNameChange}
                                            placeholder="Category Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug</Label>
                                        <Input
                                            value={newItemSlug}
                                            onChange={(e) => setNewItemSlug(e.target.value)}
                                            placeholder="category-slug"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={newItemDescription}
                                            onChange={(e) => setNewItemDescription(e.target.value)}
                                            placeholder="Description"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateCategory}>
                                        {editingCategory ? 'Update' : 'Create'}
                                    </Button>
                                </DialogFooter>
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
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditCategory(category)}
                                                        title="Edit category"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteCategory(category.id, category._count.posts)}
                                                        disabled={category._count.posts > 0}
                                                        title={category._count.posts > 0 ? 'Cannot delete category with posts' : 'Delete category'}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
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
                        <Dialog open={isTagOpen} onOpenChange={(open) => {
                            setIsTagOpen(open);
                            if (!open) resetForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Tag
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingTag ? 'Edit Tag' : 'Create Tag'}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={newItemName}
                                            onChange={handleNameChange}
                                            placeholder="Tag Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug</Label>
                                        <Input
                                            value={newItemSlug}
                                            onChange={(e) => setNewItemSlug(e.target.value)}
                                            placeholder="tag-slug"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsTagOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateTag}>
                                        {editingTag ? 'Update' : 'Create'}
                                    </Button>
                                </DialogFooter>
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
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No tags found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tags.map((tag) => (
                                        <TableRow key={tag.id}>
                                            <TableCell className="font-medium">{tag.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                                            <TableCell>{tag._count.posts}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditTag(tag)}
                                                        title="Edit tag"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteTag(tag.id, tag._count.posts)}
                                                        disabled={tag._count.posts > 0}
                                                        title={tag._count.posts > 0 ? 'Cannot delete tag with posts' : 'Delete tag'}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
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
