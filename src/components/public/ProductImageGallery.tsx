'use client';

import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageErrorHandler } from '@/hooks/useImageErrorHandler';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  variantImage?: string | null;
  featured?: boolean;
  discount?: number | null;
}

export function ProductImageGallery({
  images,
  productName,
  variantImage,
  featured,
  discount,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Use variant image if provided, otherwise use selected image
  const displayImages = variantImage && images.length === 0
    ? [{ id: 'variant', url: variantImage, alt: productName }]
    : images;

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  // Use error handler for main image
  const { imageSrc: mainImageSrc, handleError: handleMainError } = useImageErrorHandler(currentImage?.url);

  // Handle swipe gestures for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedIndex < displayImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
    if (isRightSwipe && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowLeft' && selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        } else if (e.key === 'ArrowRight' && selectedIndex < displayImages.length - 1) {
          setSelectedIndex(selectedIndex + 1);
        } else if (e.key === 'Escape') {
          setLightboxOpen(false);
          setIsZoomed(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, selectedIndex, displayImages.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  const nextImage = () => {
    if (selectedIndex < displayImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (!currentImage) {
    return (
      <div className="relative aspect-square bg-amber-50 rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-amber-300">
          <span className="text-6xl">☕</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          ref={imageRef}
          className="relative aspect-square bg-amber-50 rounded-lg overflow-hidden group cursor-zoom-in touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => displayImages.length > 0 && setLightboxOpen(true)}
        >
          <SafeImage
            src={mainImageSrc}
            alt={currentImage?.alt || productName}
            fill
            className={`object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            priority
            onLoad={() => {}}
          />

          {/* Badges */}
          {featured && (
            <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg z-10">
              <span>⭐</span>
              <span className="hidden sm:inline">Featured</span>
            </div>
          )}
          {discount && discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10">
              -{discount}% OFF
            </div>
          )}

          {/* Zoom Button (Desktop) */}
          {displayImages.length > 0 && (
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:block">
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
              >
                {isZoomed ? (
                  <ZoomOut className="w-5 h-5" />
                ) : (
                  <ZoomIn className="w-5 h-5" />
                )}
              </Button>
            </div>
          )}

          {/* Navigation Arrows (Desktop) */}
          {displayImages.length > 1 && (
            <>
              {selectedIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {selectedIndex < displayImages.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          {/* Mobile Swipe Indicator */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
              <div className="flex gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                {displayImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === selectedIndex ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {displayImages.map((image, index) => {
              return (
                <button
                  key={image.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsZoomed(false);
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedIndex === index
                      ? 'border-amber-600 ring-2 ring-amber-200'
                      : 'border-transparent hover:border-amber-300'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <SafeImage
                    src={image.url}
                    alt={image.alt || `${productName} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {selectedIndex === index && (
                    <div className="absolute inset-0 bg-amber-600/20" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && displayImages.length > 0 && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setLightboxOpen(false);
            setIsZoomed(false);
          }}
        >
          <button
            onClick={() => {
              setLightboxOpen(false);
              setIsZoomed(false);
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <SafeImage
              src={mainImageSrc}
              alt={currentImage?.alt || productName}
              fill
              className="object-contain"
              priority
            />

            {/* Navigation in Lightbox */}
            {displayImages.length > 1 && (
              <>
                {selectedIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                {selectedIndex < displayImages.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                  {selectedIndex + 1} / {displayImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

