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
  category: { name: string; id: string } | null;
}

interface RelatedProductsConfig {
  productId: string;
  numberOfProducts?: number;
  relationshipType?: 'category' | 'similar';
  columns?: number;
  cardStyle?: 'default' | 'minimal' | 'detailed';
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface RelatedProductsProps {
  config: RelatedProductsConfig;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ config }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    productId,
    numberOfProducts = 4,
    relationshipType = 'category',
    columns = 4,
    cardStyle = 'default',
    paddingTop = '60px',
    paddingBottom = '60px',
    backgroundColor = '#ffffff',
    maxWidth = '1280px',
  } = config;

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        // First, get the product to find its category
        const productResponse = await fetch(`/api/products?ids=${productId}`);
        const productData = await productResponse.json();
        
        if (!Array.isArray(productData) || productData.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const product = productData[0];
        let url = '/api/products?';
        const params = new URLSearchParams();

        if (relationshipType === 'category' && product.category?.id) {
          params.append('category', product.category.id);
        }
        
        // Exclude the current product
        params.append('exclude', productId);
        params.append('limit', numberOfProducts.toString());
        params.append('sort', 'newest');

        url += params.toString();
        const response = await fetch(url);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, numberOfProducts, relationshipType]);

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
    return null; // Don't show anything if no related products
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
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className={`grid ${colClass} gap-6`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

