'use client';

import { useState, useMemo } from 'react';
import { ProductsFilter } from './ProductsFilter';
import { ProductsTable } from './ProductsTable';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: any;
  comparePrice: any;
  stock: number;
  published: boolean;
  featured: boolean;
  category: { name: string } | null;
  categoryId: string | null;
  images: { url: string; alt: string | null }[];
}

interface ProductsListProps {
  products: Product[];
  categories: Category[];
}

export function ProductsList({ products, categories }: ProductsListProps) {
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    status: '',
    featured: '',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.category?.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.categoryId && product.categoryId !== filters.categoryId) {
        return false;
      }

      // Status filter
      if (filters.status) {
        if (filters.status === 'published' && !product.published) return false;
        if (filters.status === 'draft' && product.published) return false;
      }

      // Featured filter
      if (filters.featured) {
        if (filters.featured === 'true' && !product.featured) return false;
        if (filters.featured === 'false' && product.featured) return false;
      }

      return true;
    });
  }, [products, filters]);

  return (
    <div className="space-y-4">
      <ProductsFilter categories={categories} onFilterChange={setFilters} />
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500">
            No products found matching your filters.
          </p>
        </div>
      ) : (
        <ProductsTable products={filteredProducts} />
      )}
    </div>
  );
}
