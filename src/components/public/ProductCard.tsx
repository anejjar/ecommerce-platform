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
import { FlashSaleBadge } from '@/components/public/FlashSaleBadge';

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

    return (
        <div className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden border border-amber-100 hover:border-amber-300 hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-amber-50 overflow-hidden block touch-manipulation">
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
                        className="w-full bg-amber-800 text-white hover:bg-amber-900 shadow-xl border-none font-semibold"
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
                    <p className="text-xs text-amber-700 mb-0.5 md:mb-1 font-semibold uppercase tracking-wide">
                        {product.category.name}
                    </p>
                )}

                <Link href={`/product/${product.slug}`} className="block -mb-1">
                    <h3 className="font-semibold text-sm md:text-base text-amber-900 leading-tight group-hover:text-amber-700 transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="flex flex-col min-w-0 flex-1">
                        {hasFlashSale ? (
                            <>
                                {originalPrice > displayPrice && (
                                    <span className="text-xs text-gray-400 line-through mb-0.5">
                                        {format(originalPrice)}
                                    </span>
                                )}
                                <span className="text-lg md:text-xl font-bold text-amber-900">
                                    {format(displayPrice)}
                                </span>
                            </>
                        ) : (
                            <>
                                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                                    <span className="text-xs text-gray-400 line-through mb-0.5">
                                        {format(Number(product.comparePrice))}
                                    </span>
                                )}
                                <span className="text-lg md:text-xl font-bold text-amber-900">
                                    {format(Number(product.price))}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Mobile Add Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="md:hidden bg-amber-100 p-3 rounded-full text-amber-900 hover:bg-amber-800 hover:text-white active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                        aria-label={product.stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
