'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import { useRouter } from '@/navigation';
import { Star, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart, openCart } from '@/lib/redux/features/cartSlice';
import { ProductCard } from '@/components/public/ProductCard';
import { ProductReviews } from '@/components/public/ProductReviews';
import { WishlistButton } from '@/components/public/WishlistButton';
import { ProductImageGallery } from '@/components/public/ProductImageGallery';
import { VariantSelector } from '@/components/public/VariantSelector';
import { ProductTabs } from '@/components/public/ProductTabs';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface VariantOptionValue {
  id: string;
  value: string;
  position: number;
}

interface VariantOption {
  id: string;
  name: string;
  position: number;
  values: VariantOptionValue[];
}

interface ProductVariant {
  id: string;
  sku: string | null;
  price: string | null;
  comparePrice: string | null;
  stock: number;
  image: string | null;
  optionValues: string; // JSON array
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: any;
  comparePrice: any;
  stock: number;
  featured: boolean;
  sku: string | null;
  images: { id: string; url: string; alt: string | null }[];
  category: { name: string; slug: string } | null;
  variantOptions: VariantOption[];
  variants: ProductVariant[];
}

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Track selected option values for each variant option
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Check if product has variants
  const hasVariants = product.variantOptions.length > 0 && product.variants.length > 0;

  // Find the selected variant based on selected options
  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;

    // If not all options are selected, return null
    const allOptionsSelected = product.variantOptions.every(
      (option) => selectedOptions[option.id]
    );
    if (!allOptionsSelected) return null;

    // Find matching variant
    return product.variants.find((variant) => {
      const variantValues = JSON.parse(variant.optionValues);
      return product.variantOptions.every((option, index) => {
        return variantValues[index] === selectedOptions[option.id];
      });
    });
  }, [selectedOptions, product.variantOptions, product.variants, hasVariants]);

  // Get current price and stock (from variant or base product)
  const currentPrice = selectedVariant
    ? Number(selectedVariant.price || product.price)
    : Number(product.price);

  const currentComparePrice = selectedVariant
    ? selectedVariant.comparePrice
      ? Number(selectedVariant.comparePrice)
      : null
    : product.comparePrice
      ? Number(product.comparePrice)
      : null;

  // Calculate available stock
  // If has variants: sum of all variant stocks (or selected variant if chosen)
  // If no variants: use product stock
  const currentStock = useMemo(() => {
    if (hasVariants) {
      if (selectedVariant) {
        return selectedVariant.stock;
      }
      // Sum all variant stocks to show total availability
      return product.variants.reduce((sum, v) => sum + v.stock, 0);
    }
    return product.stock;
  }, [selectedVariant, product.variants, product.stock, hasVariants]);

  // Get image for cart (variant image or first product image)
  const currentImage = selectedVariant?.image || product.images[0]?.url;

  const discount =
    currentComparePrice && currentComparePrice > currentPrice
      ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
      : null;

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const handleAddToCart = () => {
    // Check if all variant options are selected
    if (hasVariants && !selectedVariant) {
      toast.error(t('product.selectOptions'), {
        duration: 3000,
      });
      return;
    }

    // Build variant name for display
    let variantName = '';
    if (hasVariants && selectedVariant) {
      const variantValues = JSON.parse(selectedVariant.optionValues);
      variantName = product.variantOptions
        .map((option, index) => `${option.name}: ${variantValues[index]}`)
        .join(', ');
    }

    dispatch(
      addToCart({
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: currentPrice,
        quantity,
        image: currentImage,
        variantId: selectedVariant?.id,
        variantName,
      })
    );

    toast.success(t('success.addedToCart'), {
      duration: 2000,
    });

    dispatch(openCart());
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const incrementQuantity = () => {
    if (quantity < currentStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">
                {t('product.home')}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-blue-600">
                {t('product.shop')}
              </Link>
            </li>
            {product.category && (
              <>
                <li>/</li>
                <li>
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="hover:text-blue-600"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <ProductImageGallery
                images={product.images.map(img => ({
                  id: img.id,
                  url: img.url,
                  alt: img.alt,
                }))}
                productName={product.name}
                variantImage={selectedVariant?.image || null}
                featured={product.featured}
                discount={discount}
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {product.category && (
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="inline-block text-sm text-blue-600 hover:underline mb-4"
                >
                  {product.category.name}
                </Link>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ${currentPrice.toFixed(2)}
                  </span>
                  {currentComparePrice && currentComparePrice > currentPrice && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        ${currentComparePrice.toFixed(2)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {t('product.save')} ${(currentComparePrice - currentPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {currentStock > 0 ? (
                  <p className="text-green-600 font-medium">
                    ✓ {t('product.inStock')} ({currentStock} {t('product.available')})
                  </p>
                ) : (
                  <p className="text-red-600 font-medium">✗ {t('product.outOfStock')}</p>
                )}
              </div>

              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-gray-600 mb-6">
                  {t('product.sku')}: <span className="font-mono">{product.sku}</span>
                </p>
              )}

              {/* Variant Options */}
              {hasVariants && (
                <div className="mb-6">
                  <VariantSelector
                    options={product.variantOptions}
                    variants={product.variants.map(v => ({
                      id: v.id,
                      stock: v.stock,
                      optionValues: v.optionValues,
                    }))}
                    selectedOptions={selectedOptions}
                    onOptionChange={handleOptionChange}
                    disabled={currentStock === 0}
                  />
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">{t('product.quantity')}</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 font-semibold border-x">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= currentStock}
                      className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {t('product.total')}:{' '}
                    <span className="font-bold">${(currentPrice * quantity).toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="flex-1"
                  size="lg"
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      {t('product.addedToCart')}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {t('product.addToCart')}
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={currentStock === 0}
                  variant="secondary"
                  size="lg"
                >
                  {t('product.buyNow')}
                </Button>
                <div className="border rounded-lg flex items-center justify-center px-4 hover:bg-gray-50">
                  <WishlistButton productId={product.id} showText={false} />
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
                <p>✓ {t('product.freeShipping')}</p>
                <p>✓ {t('product.moneyBack')}</p>
                <p>✓ {t('product.secureCheckout')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs (Description, Specs, Reviews) */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <ProductTabs
            description={product.description}
            productId={product.id}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('product.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
