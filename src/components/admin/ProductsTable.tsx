'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { Star, Trash2, Eye, EyeOff } from 'lucide-react';

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
        setSelectedIds([]);
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete products');
      }
    } catch (error) {
      alert('An error occurred while deleting products');
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
        setSelectedIds([]);
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update products');
      }
    } catch (error) {
      alert('An error occurred while updating products');
    } finally {
      setIsProcessing(false);
    }
  };

  const isAllSelected = products.length > 0 && selectedIds.length === products.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = isSomeSelected;
                  }
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded"
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
                <input
                  type="checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={(e) => handleSelectOne(product.id, e.target.checked)}
                  className="rounded"
                />
              </TableCell>
              <TableCell>
                {product.images[0] ? (
                  <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
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
                    <span className="text-sm text-gray-500 line-through">
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
  );
}
