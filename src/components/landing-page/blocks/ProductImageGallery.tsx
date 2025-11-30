'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImage {
  url: string;
  alt?: string;
}

interface Product {
  id: string;
  images: ProductImage[];
}

interface ProductImageGalleryConfig {
  productId: string;
  thumbnailSize?: 'sm' | 'md' | 'lg';
  showMainImage?: boolean;
  showThumbnails?: boolean;
  galleryStyle?: 'grid' | 'carousel';
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface ProductImageGalleryProps {
  config: ProductImageGalleryConfig;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ config }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    productId,
    thumbnailSize = 'md',
    showMainImage = true,
    showThumbnails = true,
    galleryStyle = 'grid',
    aspectRatio = 'square',
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

  const aspectRatioClasses = {
    square: 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    auto: '',
  };

  const thumbnailSizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
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
        <div className="animate-pulse bg-gray-200 rounded-lg" style={{ maxWidth, aspectRatio: '1/1' }} />
      </div>
    );
  }

  if (!product || !product.images || product.images.length === 0) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <p className="text-center text-gray-500">No images available.</p>
      </div>
    );
  }

  const mainImage = product.images[selectedImageIndex] || product.images[0];
  const thumbnails = product.images;

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
        <div className="space-y-4">
          {showMainImage && (
            <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${aspectRatioClasses[aspectRatio]}`}>
              <Image
                src={mainImage.url}
                alt={mainImage.alt || 'Product image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {showThumbnails && thumbnails.length > 1 && (
            <div className={`grid ${galleryStyle === 'grid' ? 'grid-cols-4 md:grid-cols-6' : 'flex overflow-x-auto'} gap-2`}>
              {thumbnails.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative ${thumbnailSizes[thumbnailSize]} rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

