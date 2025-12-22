'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/navigation';
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
import { useFlashSale } from '@/hooks/useFlashSale';
import { FlashSaleBadge } from '@/components/public/FlashSaleBadge';
import { CountdownTimer } from '@/components/checkout/CountdownTimer';
import { useCurrency } from '@/hooks/useCurrency';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

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
  const { format } = useCurrency();
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { flashSale, product: flashSaleProduct, loading: flashSaleLoading } = useFlashSale(product.id);

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
  const basePrice = selectedVariant
    ? Number(selectedVariant.price || product.price)
    : Number(product.price);
  
  const currentPrice = flashSaleProduct?.salePrice ?? basePrice;
  const originalPrice = flashSaleProduct?.originalPrice ?? (selectedVariant?.comparePrice ? Number(selectedVariant.comparePrice) : (product.comparePrice ? Number(product.comparePrice) : basePrice));
  const hasFlashSale = flashSale !== null && flashSaleProduct !== null;

  const currentComparePrice = selectedVariant
    ? selectedVariant.comparePrice
      ? Number(selectedVariant.comparePrice)
      : null
    : product.comparePrice
      ? Number(product.comparePrice)
      : null;

  // Calculate available stock
  const currentStock = useMemo(() => {
    if (hasVariants) {
      if (selectedVariant) {
        return selectedVariant.stock;
      }
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

  const primaryColor = theme?.colors?.primary ?? '#111827';

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
    <div className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                {t('product.home')}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-foreground transition-colors">
                {t('product.shop')}
              </Link>
            </li>
            {product.category && (
              <>
                <li>/</li>
                <li>
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-foreground font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-card border border-border rounded-lg mb-12 md:mb-16 p-6 md:p-8 lg:p-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
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
            <div className="flex flex-col">
              <div className="mb-6">
                {product.category && (
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="inline-block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
                  >
                    {product.category.name}
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl font-medium mb-4 leading-tight">{product.name}</h1>
                {hasFlashSale && flashSale && (
                  <div className="mb-4">
                    <FlashSaleBadge
                      discountType={flashSale.discountType}
                      discountValue={flashSale.discountValue}
                    />
                  </div>
                )}
              </div>

              {/* Flash Sale Countdown Timer */}
              {hasFlashSale && flashSale && (
                <div className="mb-6">
                  <CountdownTimer
                    endDate={new Date(flashSale.endDate)}
                    text={flashSale.bannerText || 'Flash Sale Ends In'}
                  />
                </div>
              )}

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-4xl md:text-5xl font-medium" style={{ color: primaryColor }}>
                    {format(currentPrice)}
                  </span>
                  {hasFlashSale ? (
                    originalPrice > currentPrice && (
                      <>
                        <span className="text-xl md:text-2xl text-muted-foreground line-through">
                          {format(originalPrice)}
                        </span>
                        <span className="text-sm font-medium text-destructive">
                          {t('product.save')} {format(originalPrice - currentPrice)}
                        </span>
                      </>
                    )
                  ) : (
                    currentComparePrice && currentComparePrice > currentPrice && (
                      <>
                        <span className="text-xl md:text-2xl text-muted-foreground line-through">
                          {format(currentComparePrice)}
                        </span>
                        <span className="text-sm font-medium text-destructive">
                          {t('product.save')} {format(currentComparePrice - currentPrice)}
                        </span>
                      </>
                    )
                  )}
                </div>
                {hasFlashSale && flashSaleProduct && flashSaleProduct.maxQuantity !== null && (
                  <p className="text-sm text-destructive mt-2 font-medium">
                    Only {flashSaleProduct.available} left at this price!
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {currentStock > 0 ? (
                  <p className="text-sm font-medium text-green-600">
                    ✓ {t('product.inStock')} ({currentStock} {t('product.available')})
                  </p>
                ) : (
                  <p className="text-sm font-medium text-destructive">✗ {t('product.outOfStock')}</p>
                )}
              </div>

              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-muted-foreground mb-6">
                  {t('product.sku')}: <span className="font-mono">{product.sku}</span>
                </p>
              )}

              {/* Variant Options */}
              {hasVariants && (
                <div className="mb-8">
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
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">{t('product.quantity')}</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2.5 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2.5 font-medium border-x border-border min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= currentStock}
                      className="px-4 py-2.5 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t('product.total')}:{' '}
                    <span className="font-medium text-foreground">{format(currentPrice * quantity)}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="flex-1"
                  size="lg"
                  style={{ backgroundColor: primaryColor, color: '#ffffff' }}
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
                  variant="outline"
                  size="lg"
                >
                  {t('product.buyNow')}
                </Button>
                <div className="border border-border rounded-lg flex items-center justify-center px-4 hover:bg-muted transition-colors">
                  <WishlistButton productId={product.id} showText={false} />
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t border-border pt-6 space-y-2 text-sm text-muted-foreground">
                <p>✓ {t('product.freeShipping')}</p>
                <p>✓ {t('product.moneyBack')}</p>
                <p>✓ {t('product.secureCheckout')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs (Description, Specs, Reviews) */}
        <div className="bg-card border border-border rounded-lg mb-12 md:mb-16 p-6 md:p-8 lg:p-12">
          <ProductTabs
            description={product.description}
            productId={product.id}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-medium mb-8">{t('product.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className="animate-subtle-lift"
                  style={{ animationDelay: `${index * 50}ms` }}
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
