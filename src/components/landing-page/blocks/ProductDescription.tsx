'use client';

import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  description: string | null;
}

interface ProductDescriptionConfig {
  productId: string;
  showFullDescription?: boolean;
  truncateLength?: number;
  textAlignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: string;
  lineHeight?: string;
  textColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface ProductDescriptionProps {
  config: ProductDescriptionConfig;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ config }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    productId,
    showFullDescription = true,
    truncateLength = 200,
    textAlignment = 'left',
    fontSize = '16px',
    lineHeight = '1.6',
    textColor = '#333333',
    paddingTop = '40px',
    paddingBottom = '40px',
    backgroundColor = '#ffffff',
    maxWidth = '800px',
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
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!product || !product.description) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <p className="text-center text-gray-500">No description available.</p>
      </div>
    );
  }

  const description = showFullDescription
    ? product.description
    : product.description.length > truncateLength
    ? product.description.substring(0, truncateLength) + '...'
    : product.description;

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
        <div
          style={{
            textAlign: textAlignment,
            fontSize,
            lineHeight,
            color: textColor,
          }}
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};

