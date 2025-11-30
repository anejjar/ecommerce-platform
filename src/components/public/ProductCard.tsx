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
            price: displayPrice, // Use flash sale price if available
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

    // Get theme styles - use theme values or fallbacks
    const cardBg = theme?.colors?.surface ?? '#ffffff';
    const cardBorder = theme?.colors?.border ?? '#e5e7eb';
    const cardRadius = theme?.components?.productCard?.borderRadius ?? theme?.borderRadius?.lg ?? '0.5rem';
    const cardPadding = theme?.components?.productCard?.padding ?? '0';
    const imageAspectRatio = theme?.components?.productCard?.imageAspectRatio ?? '4/5';
    const hoverEffect = theme?.components?.productCard?.hoverEffect ?? 'lift';

    return (
        <div
            className={cn(
                'group relative overflow-hidden flex flex-col h-full transition-all duration-300',
                hoverEffect === 'scale' && 'hover:scale-105',
                hoverEffect === 'lift' && 'hover:-translate-y-1',
                hoverEffect === 'glow' && 'hover:shadow-2xl',
            )}
            style={{
                backgroundColor: cardBg,
                borderColor: cardBorder,
                borderRadius: cardRadius,
                padding: cardPadding,
                borderWidth: '1px',
                borderStyle: 'solid',
            }}
        >
            {/* Image Container */}
            <Link
                href={`/product/${product.slug}`}
                className="relative overflow-hidden block touch-manipulation"
                style={{
                    aspectRatio: imageAspectRatio,
                    backgroundColor: theme?.colors?.background || '#f9fafb',
                }}
            >
                {product.images[0] ? (
                    <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-300 bg-amber-50">
                        <span className="text-4xl">☕</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5 md:gap-2 z-10">
                    {hasFlashSale && flashSale && (
                        <FlashSaleBadge
                            discountType={flashSale.discountType}
                            discountValue={flashSale.discountValue}
                        />
                    )}
                    {!hasFlashSale && discountPercentage > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-md">
                            -{discountPercentage}%
                        </span>
                    )}
                    {product.featured && (
                        <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="hidden sm:inline">{t('product.featured')}</span>
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white rounded-full p-2 shadow-lg hover:scale-110 active:scale-95 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center">
                        <WishlistButton productId={product.id} />
                    </div>
                </div>

                {/* Quick Add Overlay (Desktop) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block bg-gradient-to-t from-black/60 to-transparent">
                    <Button
                        onClick={handleAddToCart}
                        className="w-full shadow-xl border-none font-semibold"
                        style={{
                            backgroundColor: theme?.components?.buttons?.primaryColor || theme?.colors?.primary || '#000000',
                            color: theme?.components?.buttons?.textColor || '#ffffff',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme?.components?.buttons?.hoverColor || theme?.colors?.accent || '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = theme?.components?.buttons?.primaryColor || theme?.colors?.primary || '#000000';
                        }}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? t('product.outOfStock') : (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {t('product.addToCart')}
                            </>
                        )}
                    </Button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-3 md:p-4 flex flex-col flex-grow space-y-2">
                {product.category && (
                    <p
                        className="text-xs mb-0.5 md:mb-1 font-semibold uppercase tracking-wide"
                        style={{ color: theme?.colors?.text?.secondary || '#6b7280' }}
                    >
                        {product.category.name}
                    </p>
                )}

                <Link href={`/product/${product.slug}`} className="block -mb-1">
                    <h3
                        className="font-semibold text-sm md:text-base leading-tight transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]"
                        style={{ color: theme?.colors?.text?.primary || '#111827' }}
                    >
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="flex flex-col min-w-0 flex-1">
                        {hasFlashSale ? (
                            <>
                                {originalPrice > displayPrice && (
                                    <span
                                        className="text-xs line-through mb-0.5"
                                        style={{ color: theme?.colors?.text?.muted || '#9ca3af' }}
                                    >
                                        {format(originalPrice)}
                                    </span>
                                )}
                                <span
                                    className="text-lg md:text-xl font-bold"
                                    style={{ color: theme?.colors?.primary || '#111827' }}
                                >
                                    {format(displayPrice)}
                                </span>
                            </>
                        ) : (
                            <>
                                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                                    <span
                                        className="text-xs line-through mb-0.5"
                                        style={{ color: theme?.colors?.text?.muted || '#9ca3af' }}
                                    >
                                        {format(Number(product.comparePrice))}
                                    </span>
                                )}
                                <span
                                    className="text-lg md:text-xl font-bold"
                                    style={{ color: theme?.colors?.primary || '#111827' }}
                                >
                                    {format(Number(product.price))}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Mobile Add Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="md:hidden p-3 rounded-full active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                        style={{
                            backgroundColor: theme?.components?.buttons?.primaryColor || theme?.colors?.primary || '#000000',
                            color: theme?.components?.buttons?.textColor || '#ffffff',
                            borderRadius: theme?.components?.buttons?.borderRadius || theme?.borderRadius?.full || '9999px',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme?.components?.buttons?.hoverColor || theme?.colors?.accent || '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = theme?.components?.buttons?.primaryColor || theme?.colors?.primary || '#000000';
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
