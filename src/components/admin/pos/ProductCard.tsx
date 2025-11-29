'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addToPosCart, updatePosCartQuantity, removeFromPosCart } from '@/lib/redux/features/posSlice';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number | string;
    images?: Array<{ url: string; alt?: string | null }>;
    stock: number;
    variants?: Array<{ id: string; price?: number | string | null }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.pos.cart);
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const imageUrl = product.images?.[0]?.url || '/placeholder-product.png';

  // Check if product is in cart (no variants for now)
  const cartItem = cart.find((item) => item.productId === product.id && !item.variantId);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (product.stock <= 0) return;

    if (quantity === 0) {
      dispatch(
        addToPosCart({
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price,
          quantity: 1,
          image: imageUrl,
        })
      );
    } else {
      dispatch(
        updatePosCartQuantity({
          id: cartItem.id,
          quantity: quantity + 1,
        })
      );
    }
  };

  const handleDecrease = () => {
    if (cartItem && quantity > 1) {
      dispatch(
        updatePosCartQuantity({
          id: cartItem.id,
          quantity: quantity - 1,
        })
      );
    } else if (cartItem) {
      dispatch(removeFromPosCart(cartItem.id));
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className={cn(
        'border-2 rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all cursor-pointer',
        quantity > 0 && 'ring-2 ring-primary border-primary',
        isOutOfStock && 'opacity-60'
      )}
    >
      <div 
        className="relative aspect-square bg-muted cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          if (!isOutOfStock) {
            handleAdd();
          }
        }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        {quantity > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg shadow-lg">
            {quantity}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-base mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h3>
        <p className="text-2xl font-bold mb-4 text-primary">${price.toFixed(2)}</p>
        {quantity > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 text-lg font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecrease();
                }}
                disabled={isOutOfStock}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold">{quantity}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 text-lg font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd();
                }}
                disabled={isOutOfStock || product.stock <= quantity}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <Button
              variant="default"
              size="lg"
              className="w-full h-12 text-base font-semibold"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
            >
              <Check className="h-5 w-5 mr-2" />
              In Cart
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            size="lg"
            className="w-full h-12 text-base font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            disabled={isOutOfStock}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </Button>
        )}
      </div>
    </div>
  );
}

