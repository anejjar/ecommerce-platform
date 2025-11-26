'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ProductVariants } from '@/components/admin/ProductVariants';
import { StockAlertConfig } from '@/components/admin/StockAlertConfig';
import { ProductTranslationManager } from '@/components/admin/ProductTranslationManager';
import { ProductCustomizationFields } from '@/components/admin/ProductCustomizationFields';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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
    fetchProduct();
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

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const product = await response.json();
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: product.price.toString(),
          comparePrice: product.comparePrice ? product.comparePrice.toString() : '',
          stock: product.stock.toString(),
          sku: product.sku || '',
          categoryId: product.categoryId || '',
          published: product.published,
          featured: product.featured || false,
        });

        // Fetch product images
        const imagesResponse = await fetch(`/api/product-images?productId=${id}`);
        if (imagesResponse.ok) {
          const productImages = await imagesResponse.json();
          setImages(productImages);
        }
      }
    } catch (error) {
      console.error('Failed to fetch product');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
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

      if (response.ok) {
        // Handle image uploads for new images
        const newImages = images.filter((img: any) => img.file);
        if (newImages.length > 0) {
          for (const image of newImages) {
            const imageFormData = new FormData();
            imageFormData.append('file', image.file);
            imageFormData.append('productId', id);
            imageFormData.append('alt', image.alt || '');
            imageFormData.append('isPrimary', image.isPrimary ? 'true' : 'false');

            await fetch('/api/product-images', {
              method: 'POST',
              body: imageFormData,
            });
          }
        }

        router.push('/admin/products');
        router.refresh();
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isFetching) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product details</p>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
              />
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <ImageUpload productId={id} initialImages={images} onImagesChange={setImages} />
            </div>

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
                />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Product'}
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

      {/* Stock Alert Configuration */}
      <StockAlertConfig productId={id} currentStock={parseInt(formData.stock) || 0} />
        </TabsContent>

        <TabsContent value="customization" className="space-y-6">
          <ProductCustomizationFields productId={id} />
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <ProductVariants productId={id} basePrice={parseFloat(formData.price) || 0} />
        </TabsContent>

        <TabsContent value="translations" className="space-y-6">
          <ProductTranslationManager productId={id} productName={formData.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
