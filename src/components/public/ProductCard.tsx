'use client';

import { Link } from '@/navigation';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { WishlistButton } from '@/components/public/WishlistButton';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart } from '@/lib/redux/features/cartSlice';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/hooks/useCurrency';
import { useFlashSale } from '@/hooks/useFlashSale';
import { useTheme } from '@/hooks/useTheme';
import { FlashSaleBadge } from '@/components/public/FlashSaleBadge';
import { cn } from '@/lib/utils';
import { handleImageError, getProductImageUrl } from '@/lib/image-utils';

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

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const t = useTranslations();
    const { format } = useCurrency();
    const { theme } = useTheme();
    const { flashSale, product: flashSaleProduct, loading: flashSaleLoading } = useFlashSale(product.id);

    // Use flash sale price if available, otherwise use regular price
    const displayPrice = flashSaleProduct?.salePrice ?? Number(product.price);
    const originalPrice = flashSaleProduct?.originalPrice ?? (product.comparePrice ? Number(product.comparePrice) : Number(product.price));
    const hasFlashSale = flashSale !== null && flashSaleProduct !== null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(addToCart({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: displayPrice,
            image: product.images[0]?.url,
            quantity: 1
        }));
        toast.success(t('product.addedToCart') || 'Added to cart');
    };

    // Calculate discount percentage
    const discountPercentage = originalPrice > displayPrice
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : (product.comparePrice && Number(product.comparePrice) > Number(product.price)
            ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
            : 0);

    // Get theme styles
    const cardBorder = theme?.colors?.border ?? '#e5e7eb';
    const cardRadius = theme?.components?.productCard?.borderRadius ?? theme?.borderRadius?.lg ?? '0.5rem';
    const imageAspectRatio = theme?.components?.productCard?.imageAspectRatio ?? '1/1';
    const primaryColor = theme?.colors?.primary ?? '#111827';

    return (
        <div
            className={cn(
                'group relative flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden transition-all duration-300',
                'hover:-translate-y-1 hover:shadow-lg'
            )}
            style={{
                borderColor: cardBorder,
                borderRadius: cardRadius,
            }}
        >
            {/* Image Container */}
            <Link
                href={`/product/${product.slug}`}
                className="relative overflow-hidden block bg-muted"
                style={{
                    aspectRatio: imageAspectRatio,
                }}
            >
                {product.images[0] ? (
                    <Image
                        src={getProductImageUrl(product.images[0].url)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={handleImageError}
                        unoptimized={product.images[0].url?.startsWith('data:') || false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/20 rounded-lg" />
                    </div>
                )}

                {/* Single Badge Position - Top Left */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {hasFlashSale && flashSale && (
                        <FlashSaleBadge
                            discountType={flashSale.discountType}
                            discountValue={flashSale.discountValue}
                        />
                    )}
                    {!hasFlashSale && discountPercentage > 0 && (
                        <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2.5 py-1 rounded">
                            -{discountPercentage}%
                        </span>
                    )}
                    {!hasFlashSale && product.featured && discountPercentage === 0 && (
                        <span className="bg-foreground text-background text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="hidden sm:inline">{t('product.featured')}</span>
                        </span>
                    )}
                </div>

                {/* Wishlist Button - Top Right */}
                <div className="absolute top-3 right-3 z-10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-background transition-colors">
                        <WishlistButton productId={product.id} />
                    </div>
                </div>

                {/* Quick Add Button - Appears on Hover (Desktop) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block bg-background/95 backdrop-blur-sm border-t border-border">
                    <Button
                        onClick={handleAddToCart}
                        className="w-full"
                        style={{
                            backgroundColor: primaryColor,
                            color: '#ffffff',
                        }}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? (
                            t('product.outOfStock')
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {t('product.addToCart')}
                            </>
                        )}
                    </Button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 md:p-5 flex flex-col flex-grow space-y-3">
                {product.category && (
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {product.category.name}
                    </p>
                )}

                <Link href={`/product/${product.slug}`} className="block -mb-1 group/link">
                    <h3 className="font-medium text-sm md:text-base leading-snug transition-colors line-clamp-2 group-hover/link:text-primary">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto flex items-end justify-between gap-3">
                    <div className="flex flex-col min-w-0 flex-1">
                        {hasFlashSale ? (
                            <>
                                {originalPrice > displayPrice && (
                                    <span className="text-xs line-through mb-1 text-muted-foreground">
                                        {format(originalPrice)}
                                    </span>
                                )}
                                <span className="text-lg md:text-xl font-medium" style={{ color: primaryColor }}>
                                    {format(displayPrice)}
                                </span>
                            </>
                        ) : (
                            <>
                                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                                    <span className="text-xs line-through mb-1 text-muted-foreground">
                                        {format(Number(product.comparePrice))}
                                    </span>
                                )}
                                <span className="text-lg md:text-xl font-medium" style={{ color: primaryColor }}>
                                    {format(Number(product.price))}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Mobile Add Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="md:hidden p-2.5 rounded-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        style={{
                            backgroundColor: primaryColor,
                            color: '#ffffff',
                        }}
                        aria-label={product.stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
