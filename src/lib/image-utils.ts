import { useState, useEffect, useCallback } from 'react';

/**
 * Placeholder image data URL for product images
 * A professional SVG placeholder with icon
 */
export const PLACEHOLDER_PRODUCT_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f9fafb;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <g transform="translate(200, 200)">
      <!-- Shopping bag icon -->
      <path d="M-40 -20 L-40 60 L40 60 L40 -20 Z" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2"/>
      <rect x="-35" y="-15" width="70" height="70" fill="#e5e7eb"/>
      <path d="M-25 -20 Q-25 -45 0 -45 Q25 -45 25 -20" fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>
      <!-- Shopping bag icon bottom -->
      <circle cx="0" cy="20" r="3" fill="#9ca3af"/>
    </g>
    <text x="200" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" font-weight="500">No Image Available</text>
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
 * Handle image error for native HTML img elements
 * Use this for standard <img> tags (non-Next.js Image components)
 */
export function handleNativeImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  const currentSrc = target.src || '';

  if (currentSrc && !currentSrc.includes('data:image/svg+xml') && !currentSrc.includes('placeholder')) {
    target.onerror = null; // Prevent infinite loop
    target.src = PLACEHOLDER_PRODUCT_IMAGE;
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
