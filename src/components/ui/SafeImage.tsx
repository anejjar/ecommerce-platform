'use client';

import { PLACEHOLDER_PRODUCT_IMAGE, handleImageError } from '@/lib/image-utils';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoad?: () => void;
}

/**
 * SafeImage component - A drop-in replacement for Next.js Image that handles 404 errors gracefully
 *
 * Uses native <img> tag with automatic error handling to prevent infinite 404 request loops.
 * When an image fails to load, it automatically shows a placeholder instead.
 *
 * Usage:
 * <SafeImage
 *   src={product.image}
 *   alt={product.name}
 *   className="w-full h-full object-cover"
 * />
 */
export function SafeImage({
  src,
  alt,
  className = '',
  width,
  height,
  fill,
  style,
  onClick,
  onLoad,
}: SafeImageProps) {
  const imageSrc = src || PLACEHOLDER_PRODUCT_IMAGE;

  // If fill is true, use absolute positioning
  const fillStyles: React.CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }
    : {};

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      style={{ ...fillStyles, ...style }}
      onError={handleImageError}
      onClick={onClick}
      onLoad={onLoad}
      loading="lazy"
    />
  );
}
