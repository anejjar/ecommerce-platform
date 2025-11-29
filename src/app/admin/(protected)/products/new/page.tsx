'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ProductDescriptionBuilder } from '@/components/admin/ProductDescriptionBuilder';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    sku: '',
    categoryId: '',
    published: true,
    featured: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          stock: parseInt(formData.stock),
          categoryId: formData.categoryId || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const product = data;

        // Handle image uploads
        if (images.length > 0) {
          try {
            for (const image of images) {
              const imageFormData = new FormData();
              imageFormData.append('file', image.file);
              imageFormData.append('productId', product.id);
              imageFormData.append('alt', image.alt || '');
              imageFormData.append('isPrimary', image.isPrimary ? 'true' : 'false');

              const imageResponse = await fetch('/api/product-images', {
                method: 'POST',
                body: imageFormData,
              });

              if (!imageResponse.ok) {
                console.error('Failed to upload image:', image.alt || 'unnamed');
              }
            }
          } catch (imageError) {
            console.error('Error uploading images:', imageError);
            toast.error('Product created but some images failed to upload');
          }
        }

        toast.success('Product created successfully');
        router.refresh();
      } else {
        // Handle API validation errors
        if (data.errors) {
          setErrors(data.errors);
          toast.error('Please fix the errors in the form');
        } else {
          toast.error(data.message || 'Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const syntheticEvent = {
        preventDefault: () => { },
        currentTarget: formRef.current,
        target: formRef.current,
      } as React.FormEvent<HTMLFormElement>;
      handleSubmit(syntheticEvent);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleSaveClick}
          disabled={isLoading}
          size="lg"
          className="shadow-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-gray-600 mt-2">Create a new product for your store</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="max-w-2xl space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Blue T-Shirt"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      placeholder="blue-t-shirt"
                      className={errors.slug ? 'border-red-500' : ''}
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-500">{errors.slug}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      URL-friendly version (auto-generated from name)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">No Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </TabsContent>

              {/* Description Tab - Full Width */}
              <TabsContent value="description" className="mt-6">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <ProductDescriptionBuilder
                    content={formData.description}
                    onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
                  />
                  <p className="text-sm text-gray-500">
                    Add blocks from the sidebar to create a compelling product description. Click blocks to edit them.
                  </p>
                </div>
              </TabsContent>

              {/* Pricing & Inventory Tab */}
              <TabsContent value="pricing" className="space-y-4 mt-6">
                <div className="max-w-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                        className={errors.price ? 'border-red-500' : ''}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500">{errors.price}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comparePrice">Compare at Price</Label>
                      <Input
                        id="comparePrice"
                        name="comparePrice"
                        type="number"
                        step="0.01"
                        value={formData.comparePrice}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                      <p className="text-sm text-gray-500">
                        Original price (for showing discounts)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      placeholder="0"
                      className={errors.stock ? 'border-red-500' : ''}
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500">{errors.stock}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="mt-6">
                <div className="max-w-2xl space-y-2">
                  <ImageUpload onImagesChange={setImages} />
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4 mt-6">
                <div className="max-w-2xl space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="PROD-001"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Product Options</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, published: e.target.checked }))
                        }
                        className="rounded"
                      />
                      <Label htmlFor="published">Publish product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                        }
                        className="rounded"
                      />
                      <Label htmlFor="featured">Featured</Label>
                      <span className="text-sm text-gray-500">(Highlight in storefront)</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions - Always Visible */}
            <div className="flex gap-4 pt-6 mt-6 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Product'}
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
    </div>
  );
}
