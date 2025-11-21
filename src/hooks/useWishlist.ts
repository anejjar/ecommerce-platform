'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setWishlist, setLoading } from '@/lib/redux/features/wishlistSlice';

export function useWishlist() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    // Fetch wishlist when user is authenticated
    if (status === 'authenticated' && session?.user) {
      fetchWishlist();
    }
  }, [status, session]);

  const fetchWishlist = async () => {
    dispatch(setLoading(true));

    try {
      const response = await fetch('/api/wishlist');

      if (response.ok) {
        const items = await response.json();
        dispatch(setWishlist(items));
      } else {
        console.error('Failed to fetch wishlist');
        dispatch(setWishlist([]));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      dispatch(setWishlist([]));
    }
  };

  return {
    items: wishlist.items,
    isLoading: wishlist.isLoading,
    productIds: wishlist.productIds,
    refetch: fetchWishlist,
  };
}
