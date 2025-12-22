'use client';

import { useState, useEffect, useCallback } from 'react';
import { PLACEHOLDER_PRODUCT_IMAGE, getProductImageUrl } from '@/lib/image-utils';

/**
 * Hook for handling image errors with state
 * Use this for Next.js Image components when onError doesn't work reliably
 */
export function useImageErrorHandler(initialSrc: string | null | undefined) {
  const [imageSrc, setImageSrc] = useState<string>(
    getProductImageUrl(initialSrc)
  );
  const [hasError, setHasError] = useState(false);
  const [lastValidSrc, setLastValidSrc] = useState<string | null | undefined>(initialSrc);

  // Only update when initialSrc changes AND we haven't errored on this src
  useEffect(() => {
    if (initialSrc !== lastValidSrc) {
      setImageSrc(getProductImageUrl(initialSrc));
      setHasError(false);
      setLastValidSrc(initialSrc);
    }
  }, [initialSrc, lastValidSrc]);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(PLACEHOLDER_PRODUCT_IMAGE);
    }
  }, [hasError]);

  return { imageSrc, handleError, hasError };
}
