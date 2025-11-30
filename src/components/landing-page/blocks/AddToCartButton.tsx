'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart } from '@/lib/redux/features/cartSlice';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/hooks/useCurrency';

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  images: Array<{ url: string }>;
}

interface AddToCartButtonConfig {
  productId: string;
  buttonText?: string;
  buttonStyle?: 'solid' | 'outline' | 'ghost';
  buttonSize?: 'sm' | 'md' | 'lg';
  showQuantitySelector?: boolean;
  showIcon?: boolean;
  buttonColor?: string;
  textColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  alignment?: 'left' | 'center' | 'right';
}

interface AddToCartButtonProps {
  config: AddToCartButtonConfig;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ config }) => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { format } = useCurrency();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const {
    productId,
    buttonText,
    buttonStyle = 'solid',
    buttonSize = 'md',
    showQuantitySelector = false,
    showIcon = true,
    buttonColor = '#d97706',
    textColor = '#ffffff',
    paddingTop = '20px',
    paddingBottom = '20px',
    backgroundColor = 'transparent',
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

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images[0]?.url,
        quantity: 1,
      }));
    }

    toast.success(t('product.addedToCart') || 'Added to cart');
  };

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const sizeClasses = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  const styleClasses = {
    solid: '',
    outline: 'border-2 bg-transparent',
    ghost: 'bg-transparent hover:bg-opacity-10',
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
          <div className="animate-pulse bg-gray-200 rounded h-11 w-32" />
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

  const displayText = buttonText || t('product.addToCart') || 'Add to Cart';

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
        <div className={`flex items-center gap-4 ${alignmentClasses[alignment]}`}>
          {showQuantitySelector && (
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
                disabled={product.stock <= quantity}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`${sizeClasses[buttonSize]} ${styleClasses[buttonStyle]}`}
            style={{
              backgroundColor: buttonStyle === 'solid' ? buttonColor : undefined,
              borderColor: buttonStyle === 'outline' ? buttonColor : undefined,
              color: textColor,
            }}
          >
            {showIcon && <ShoppingCart className="w-4 h-4 mr-2" />}
            {displayText}
          </Button>
        </div>
      </div>
    </div>
  );
};

