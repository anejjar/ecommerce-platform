'use client';

import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/components/public/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  stock: number;
  featured: boolean;
  images: Array<{ url: string }>;
  category: { name: string } | null;
}

interface ProductGridConfig {
  selectionMode?: 'auto' | 'manual';
  productIds?: string[];
  category?: string;
  featured?: boolean;
  latest?: boolean;
  sortOrder?: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name';
  limit?: number;
  columns?: number;
  cardStyle?: 'default' | 'minimal' | 'detailed';
  showPrices?: boolean;
  showAddToCart?: boolean;
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface ProductGridProps {
  config: ProductGridConfig;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ config }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    selectionMode = 'auto',
    productIds = [],
    category = '',
    featured = false,
    latest = false,
    sortOrder = 'newest',
    limit = 8,
    columns = 4,
    cardStyle = 'default',
    showPrices = true,
    showAddToCart = true,
    paddingTop = '60px',
    paddingBottom = '60px',
    backgroundColor = '#ffffff',
    maxWidth = '1280px',
  } = config;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products?';
        const params = new URLSearchParams();

        if (selectionMode === 'manual' && productIds.length > 0) {
          params.append('ids', productIds.join(','));
        } else {
          if (category) params.append('category', category);
          if (featured) params.append('featured', 'true');
          if (latest) params.append('latest', 'true');
          params.append('sort', sortOrder);
          params.append('limit', limit.toString());
        }

        url += params.toString();
        const response = await fetch(url);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectionMode, productIds, category, featured, latest, sortOrder, limit]);

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const colClass = gridCols[columns as keyof typeof gridCols] || gridCols[4];

  if (loading) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <div className={`grid ${colClass} gap-6`}>
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl aspect-[4/5]" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <p className="text-center text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop,
        paddingBottom,
        backgroundColor,
      }}
      className="w-full"
    >
      <div className="container mx-auto px-4" style={{ maxWidth }}>
        <div className={`grid ${colClass} gap-6`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

