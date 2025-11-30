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

interface ProductCardBlockConfig {
  productId: string;
  showImage?: boolean;
  showPrice?: boolean;
  showDescription?: boolean;
  showAddToCart?: boolean;
  cardStyle?: 'default' | 'minimal' | 'detailed';
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
  alignment?: 'left' | 'center' | 'right';
}

interface ProductCardBlockProps {
  config: ProductCardBlockConfig;
}

export const ProductCardBlock: React.FC<ProductCardBlockProps> = ({ config }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    productId,
    showImage = true,
    showPrice = true,
    showDescription = true,
    showAddToCart = true,
    cardStyle = 'default',
    paddingTop = '40px',
    paddingBottom = '40px',
    backgroundColor = '#ffffff',
    maxWidth = '400px',
    alignment = 'center',
  } = config;

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?ids=${productId}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

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
        <div className={`flex ${alignmentClasses[alignment]}`}>
          <div className="animate-pulse bg-gray-200 rounded-xl w-full" style={{ maxWidth, aspectRatio: '4/5' }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <p className="text-center text-gray-500">Product not found.</p>
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
      <div className="container mx-auto px-4">
        <div className={`flex ${alignmentClasses[alignment]}`}>
          <div style={{ maxWidth, width: '100%' }}>
            <ProductCard product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

