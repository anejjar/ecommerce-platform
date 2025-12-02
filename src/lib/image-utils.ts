import { useState, useEffect, useCallback } from 'react';

/**
 * Placeholder image data URL for product images
 * A simple SVG placeholder that works as a data URL
 */
export const PLACEHOLDER_PRODUCT_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#f3f4f6"/>
    <rect x="150" y="150" width="100" height="100" fill="#d1d5db" rx="8"/>
    <path d="M170 190 L200 160 L230 190 L230 230 L170 230 Z" fill="#9ca3af"/>
  </svg>`
)}`;

/**
 * Handle image error by replacing with placeholder
 * Works with both regular img elements and Next.js Image component
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  // Prevent infinite loop if placeholder also fails
  const currentSrc = target.src || target.getAttribute('src') || '';
  
  if (currentSrc && !currentSrc.includes('data:image/svg+xml') && !currentSrc.includes('placeholder')) {
    try {
      // For Next.js Image, we need to update the src directly
      // The onError handler receives the native img element
      target.src = PLACEHOLDER_PRODUCT_IMAGE;
      target.setAttribute('src', PLACEHOLDER_PRODUCT_IMAGE);
      target.onerror = null; // Prevent infinite loop
    } catch (error) {
      // If setting src fails, try to hide the image and show placeholder
      console.warn('Failed to set placeholder image:', error);
    }
  }
}

/**
 * Get product image URL with fallback to placeholder
 */
export function getProductImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return PLACEHOLDER_PRODUCT_IMAGE;
  }
  return imageUrl;
}

/**
 * Hook for handling image errors with state
 * Use this for Next.js Image components when onError doesn't work reliably
 */
export function useImageErrorHandler(initialSrc: string | null | undefined) {
  const [imageSrc, setImageSrc] = useState<string>(
    getProductImageUrl(initialSrc)
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (initialSrc && initialSrc !== imageSrc && !hasError) {
      setImageSrc(initialSrc);
      setHasError(false);
    }
  }, [initialSrc, imageSrc, hasError]);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(PLACEHOLDER_PRODUCT_IMAGE);
    }
  }, [hasError]);

  return { imageSrc, handleError, hasError };
}

