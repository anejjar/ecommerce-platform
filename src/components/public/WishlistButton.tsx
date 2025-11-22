'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations();

  const isInWishlist = wishlist.productIds.includes(productId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (status === 'unauthenticated') {
      toast.error(t('wishlist.signInRequired'));
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
          toast.success(t('wishlist.removed'));
        } else {
          const error = await response.json();
          toast.error(error.error || t('wishlist.removeFailed'));
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
          toast.success(t('wishlist.added'));
        } else {
          const error = await response.json();
          toast.error(error.error || t('wishlist.addFailed'));
        }
      }
    } catch (error) {
      toast.error(t('common.error'));
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
      aria-label={isInWishlist ? t('wishlist.removeFromWishlist') : t('wishlist.addToWishlist')}
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-all',
          isInWishlist && 'fill-current'
        )}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isInWishlist ? t('wishlist.saved') : t('wishlist.save')}
        </span>
      )}
    </button>
  );
}
