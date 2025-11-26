'use client';

/**
 * Example Component: Product Detail Page with Customization
 *
 * This is a complete example showing how to integrate the ProductCustomizationForm
 * into a product detail page. You can use this as a reference for your implementation.
 *
 * To use this example:
 * 1. Import this component in your product page
 * 2. Pass the product data as props
 * 3. Customize the styling to match your theme
 */

import { useState } from 'react';
import Image from 'next/image';
import { ProductCustomizationForm } from '@/components/ProductCustomizationForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Check, AlertCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CustomizationValue } from '@/types/customization';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  comparePrice: string | number | null;
  stock: number;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
  }>;
  category?: {
    name: string;
    slug: string;
  };
}

interface ProductWithCustomizationExampleProps {
  product: Product;
}

export function ProductWithCustomizationExample({ product }: ProductWithCustomizationExampleProps) {
  // State management
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, CustomizationValue>>({});
  const [isCustomizationValid, setIsCustomizationValid] = useState(false);
  const [customizationCost, setCustomizationCost] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Price calculations
  const basePrice = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const itemTotal = basePrice + customizationCost;
  const grandTotal = itemTotal * quantity;
  const hasDiscount = comparePrice && comparePrice > basePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
    : 0;

  // Add to cart handler
  const handleAddToCart = async () => {
    // Validate stock
    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    // Validate customizations
    if (!isCustomizationValid) {
      toast.error('Please complete all required customization fields');
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          customizations: Object.values(customizations),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to cart');
      }

      // Success
      setAddedToCart(true);
      toast.success('Added to cart successfully!');

      // Reset after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Quantity controls
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {hasDiscount && (
                <Badge className="absolute top-4 right-4 bg-red-600 text-white">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </Card>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info & Customization */}
        <div className="space-y-6">
          {/* Category & Title */}
          {product.category && (
            <div className="text-sm text-gray-600">
              <a href={`/shop?category=${product.category.slug}`} className="hover:underline">
                {product.category.name}
              </a>
            </div>
          )}

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${basePrice.toFixed(2)}
              </span>
              {comparePrice && comparePrice > basePrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {customizationCost > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Customization:</span>
                  <span className="font-semibold text-green-600">
                    +${customizationCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-t pt-2">
                  <span className="text-gray-600">Item Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${itemTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">
                  In Stock ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                disabled={quantity <= 1 || product.stock === 0}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock || product.stock === 0}
              >
                +
              </Button>
            </div>
          </div>

          {/* Customization Form */}
          <ProductCustomizationForm
            productId={product.id}
            onCustomizationsChange={(customizations, isValid, totalModifier) => {
              setCustomizations(customizations);
              setIsCustomizationValid(isValid);
              setCustomizationCost(totalModifier);
            }}
            disabled={product.stock === 0}
          />

          {/* Total Price (with quantity) */}
          {quantity > 1 && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total ({quantity} items):
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${grandTotal.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || !isCustomizationValid || isAddingToCart}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Adding to Cart...
              </>
            ) : addedToCart ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - ${grandTotal.toFixed(2)}
              </>
            )}
          </Button>

          {/* Validation Warning */}
          {!isCustomizationValid && Object.keys(customizations).length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Please complete all required customization fields before adding to cart.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Label component (if not using shadcn/ui Label)
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}

// Helper Loader2 component (if not using lucide-react)
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
