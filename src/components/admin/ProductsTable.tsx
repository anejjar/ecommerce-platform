'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductActions } from '@/components/admin/ProductActions';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Trash2, Eye, EyeOff } from 'lucide-react';
import { PLACEHOLDER_PRODUCT_IMAGE, getProductImageUrl } from '@/lib/image-utils';

interface Product {
  id: string;
  name: string;
  price: any;
  comparePrice: any;
  stock: number;
  published: boolean;
  featured: boolean;
  category: { name: string } | null;
  images: { url: string; alt: string | null }[];
}

interface ProductsTableProps {
  products: Product[];
}

// Component to handle product image with error state
function ProductImageCell({ imageUrl, alt }: { imageUrl: string | undefined; alt: string }) {
  const [imgSrc, setImgSrc] = useState(getProductImageUrl(imageUrl));
  const [hasError, setHasError] = useState(false);
  const [lastUrl, setLastUrl] = useState(imageUrl);

  // Reset error state when imageUrl changes
  if (imageUrl !== lastUrl) {
    setImgSrc(getProductImageUrl(imageUrl));
    setHasError(false);
    setLastUrl(imageUrl);
  }

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(PLACEHOLDER_PRODUCT_IMAGE);
    }
  };

  return (
    <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes="48px"
        onError={handleError}
        unoptimized={imgSrc?.startsWith('data:') || false}
      />
    </div>
  );
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} product(s)? This action cannot be undone.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/products/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (response.ok) {
        toast.success(`Successfully deleted ${selectedIds.length} product(s)`);
        setSelectedIds([]);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete products');
      }
    } catch (error) {
      toast.error('An error occurred while deleting products');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkPublish = async (publish: boolean) => {
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/products/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          data: { published: publish },
        }),
      });

      if (response.ok) {
        toast.success(`Successfully ${publish ? 'published' : 'unpublished'} ${selectedIds.length} product(s)`);
        setSelectedIds([]);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update products');
      }
    } catch (error) {
      toast.error('An error occurred while updating products');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkFeatured = async (featured: boolean) => {
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/products/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          data: { featured },
        }),
      });

      if (response.ok) {
        toast.success(`Successfully ${featured ? 'featured' : 'unfeatured'} ${selectedIds.length} product(s)`);
        setSelectedIds([]);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update products');
      }
    } catch (error) {
      toast.error('An error occurred while updating products');
    } finally {
      setIsProcessing(false);
    }
  };

  const isAllSelected = products.length > 0 && selectedIds.length === products.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-950/20 dark:border-blue-900">
          <span className="text-sm font-medium">
            {selectedIds.length} product{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkPublish(true)}
              disabled={isProcessing}
            >
              <Eye className="w-4 h-4 mr-1" />
              Publish
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkPublish(false)}
              disabled={isProcessing}
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Unpublish
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkFeatured(true)}
              disabled={isProcessing}
            >
              <Star className="w-4 h-4 mr-1" />
              Feature
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkFeatured(false)}
              disabled={isProcessing}
            >
              <Star className="w-4 h-4 mr-1" />
              Unfeature
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isProcessing}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected || (isSomeSelected ? "indeterminate" : false)}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={(checked) => handleSelectOne(product.id, !!checked)}
                    aria-label="Select row"
                  />
                </TableCell>
                <TableCell>
                  <ProductImageCell
                    imageUrl={product.images[0]?.url}
                    alt={product.images[0]?.alt || product.name}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.name}</span>
                    {product.featured && (
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.category?.name || 'N/A'}</TableCell>
                <TableCell>
                  {product.comparePrice && parseFloat(product.comparePrice.toString()) > parseFloat(product.price.toString()) ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.comparePrice.toString()}
                      </span>
                      <span className="font-medium">${product.price.toString()}</span>
                    </div>
                  ) : (
                    <span>${product.price.toString()}</span>
                  )}
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge variant={product.published ? 'default' : 'secondary'}>
                    {product.published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ProductActions productId={product.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
