'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToCart } from '@/lib/redux/features/cartSlice';
import { removeFromWishlist } from '@/lib/redux/features/wishlistSlice';
import toast from 'react-hot-toast';
import { useState } from 'react';

export function WishlistContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { items, isLoading } = useWishlist();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const handleRemove = async (productId: string) => {
    setRemovingIds((prev) => new Set(prev).add(productId));

    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        dispatch(removeFromWishlist(productId));
        toast.success('Removed from wishlist');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to remove from wishlist');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    dispatch(
      addToCart({
        id: `${product.id}`,
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        image: product.images[0]?.url || null,
        variantId: undefined,
      })
    );
    toast.success('Added to cart');
  };

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin?callbackUrl=/wishlist');
    return null;
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Save your favorite products to your wishlist and shop them later!
            </p>
            <Link href="/shop">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const product = item.product;
          const price = Number(product.price);
          const comparePrice = product.comparePrice
            ? Number(product.comparePrice)
            : null;
          const discount =
            comparePrice && comparePrice > price
              ? Math.round(((comparePrice - price) / comparePrice) * 100)
              : null;
          const isRemoving = removingIds.has(product.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-square bg-gray-100 group">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                  {discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      -{discount}%
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                {product.category && (
                  <p className="text-xs text-gray-500 mb-1">
                    {product.category.name}
                  </p>
                )}
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${price.toFixed(2)}
                  </span>
                  {comparePrice && comparePrice > price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {product.stock === 0 ? (
                  <p className="text-xs text-red-600 mb-3">Out of Stock</p>
                ) : (
                  <p className="text-xs text-green-600 mb-3">In Stock</p>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleRemove(product.id)}
                    disabled={isRemoving}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
