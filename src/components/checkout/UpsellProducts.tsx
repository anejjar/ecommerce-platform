'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart } from '@/lib/redux/features/cartSlice';
import { useCurrency } from '@/hooks/useCurrency';
import { ShoppingCart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/image-utils';

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: Array<{ url: string }>;
  stock: number;
  published: boolean;
}

interface UpsellProductsProps {
  productIds: string[];
  title?: string;
  position: 'cart' | 'below-form' | 'modal';
}

export function UpsellProducts({ productIds, title, position }: UpsellProductsProps) {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { format } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (productIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?ids=${productIds.join(',')}`);
        if (response.ok) {
          const data = await response.json();
          // Filter only published products
          setProducts(data.filter((p: Product) => p.published && p.stock > 0));
        }
      } catch (error) {
        console.error('Error fetching upsell products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productIds]);

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        image: product.images[0]?.url,
      })
    );
    toast.success(t('product.addedToCart') || 'Added to cart');
    
    if (position === 'modal') {
      setModalOpen(false);
    }
  };

  if (loading || products.length === 0) {
    return null;
  }

  const discountPercentage = (product: Product) => {
    if (product.comparePrice && Number(product.comparePrice) > Number(product.price)) {
      return Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100);
    }
    return 0;
  };

  const productCards = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => {
        const discount = discountPercentage(product);
        return (
          <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-square">
              <Image
                src={product.images[0]?.url || PLACEHOLDER_PRODUCT_IMAGE}
                alt={product.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = PLACEHOLDER_PRODUCT_IMAGE;
                }}
                unoptimized={product.images[0]?.url?.startsWith('data:') || false}
              />
              {discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{discount}%
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg">{format(Number(product.price))}</span>
                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                  <span className="text-sm text-gray-500 line-through">
                    {format(Number(product.comparePrice))}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Modal position
  if (position === 'modal') {
    return (
      <>
        {!modalOpen && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              onClick={() => setModalOpen(true)}
              className="shadow-lg"
            >
              {title || 'You might also like'}
            </Button>
          </div>
        )}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{title || t('checkout.youMightAlsoLike')}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {productCards}
            </div>
          </div>
        )}
      </>
    );
  }

  // Cart or below-form position
  return (
    <div className={position === 'cart' ? 'mb-6' : 'mt-8'}>
      {title && (
        <h2 className="text-xl font-bold mb-4">{title}</h2>
      )}
      {productCards}
    </div>
  );
}

