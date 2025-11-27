'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Image as ImageIcon } from 'lucide-react';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { MediaItem } from '@/components/media-manager/types';

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
  };
  mode: 'create' | 'edit';
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState(category?.image || '');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parentId: category?.parentId || '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        // Exclude current category and its children from parent options when editing
        const filtered = mode === 'edit' && category
          ? data.filter((cat: any) => cat.id !== category.id && cat.parentId !== category.id)
          : data;
        setCategories(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleMediaSelect = (selectedMedia: MediaItem[]) => {
    if (selectedMedia.length > 0) {
      setImageUrl(selectedMedia[0].url);
      toast.success('Image selected');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = mode === 'create'
        ? '/api/categories'
        : `/api/categories/${category?.id}`;

      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl || null,
          parentId: formData.parentId || null,
        }),
      });

      if (response.ok) {
        toast.success(`Category ${mode === 'create' ? 'created' : 'updated'} successfully`);
        router.push('/admin/categories');
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${mode} category`);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'name' && mode === 'create') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleParentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, parentId: value === 'none' ? '' : value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create Category' : 'Edit Category'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Electronics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="electronics"
            />
            <p className="text-sm text-muted-foreground">
              URL-friendly version (auto-generated from name)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category</Label>
            <Select
              value={formData.parentId || 'none'}
              onValueChange={handleParentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Parent (Top Level)</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px]"
              placeholder="Category description..."
            />
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            {imageUrl && (
              <div className="relative w-32 h-32 rounded border overflow-hidden mb-2 bg-muted">
                <img
                  src={imageUrl}
                  alt="Category"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => setImageUrl('')}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMediaPicker(true)}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {imageUrl ? 'Change Image' : 'Select Image'}
              </Button>
            </div>
          </div>

          <MediaPicker
            open={showMediaPicker}
            onOpenChange={setShowMediaPicker}
            onSelect={handleMediaSelect}
            multiple={false}
            type="IMAGE"
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? `${mode === 'create' ? 'Creating' : 'Updating'}...` : `${mode === 'create' ? 'Create' : 'Update'} Category`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
