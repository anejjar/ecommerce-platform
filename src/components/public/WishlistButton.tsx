'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
  addToWishlist,
  removeFromWishlist,
  setLoading,
} from '@/lib/redux/features/wishlistSlice';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  showText?: boolean;
}

export function WishlistButton({
  productId,
  className,
  showText = false,
}: WishlistButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist);
  const [isProcessing, setIsProcessing] = useState(false);

  const isInWishlist = wishlist.productIds.has(productId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (status === 'unauthenticated') {
      toast.error('Please sign in to use the wishlist');
      router.push('/auth/signin?callbackUrl=' + window.location.pathname);
      return;
    }

    if (status === 'loading') {
      return;
    }

    setIsProcessing(true);
    dispatch(setLoading(true));

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(
          `/api/wishlist?productId=${productId}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          dispatch(removeFromWishlist(productId));
          toast.success('Removed from wishlist');
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          const item = await response.json();
          dispatch(addToWishlist(item));
          toast.success('Added to wishlist');
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isProcessing || status === 'loading'}
      className={cn(
        'flex items-center gap-2 transition-colors',
        isInWishlist
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500',
        isProcessing && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-all',
          isInWishlist && 'fill-current'
        )}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isInWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
