'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

interface Popup {
  id: string;
  title: string | null;
  content: string;
  type: string;
  triggerValue: number | null;
  position: string;
  width: number;
  height: number | null;
  backgroundColor: string;
  textColor: string;
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  showCloseButton: boolean;
  overlayColor: string;
  imageUrl: string | null;
  frequency: string;
  delaySeconds: number;
  ctaType: string;
  ctaUrl: string | null;
  discountCode: string | null;
}

export function PopupManager() {
  const pathname = usePathname();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [activePopup, setActivePopup] = useState<Popup | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Determine current page type
  const getPageType = () => {
    if (pathname === '/') return 'HOMEPAGE';
    if (pathname.startsWith('/products/')) return 'PRODUCT_PAGES';
    if (pathname === '/cart') return 'CART_PAGE';
    if (pathname.startsWith('/checkout')) return 'CHECKOUT';
    if (pathname.startsWith('/blog')) return 'BLOG';
    return 'ALL_PAGES';
  };

  // Check if popup should be shown based on frequency
  const shouldShowPopup = (popup: Popup): boolean => {
    const storageKey = `popup_${popup.id}_last_shown`;
    const lastShown = localStorage.getItem(storageKey);

    if (!lastShown) return true;

    const lastShownTime = parseInt(lastShown);
    const now = Date.now();

    switch (popup.frequency) {
      case 'always':
        return true;
      case 'once_per_session':
        return false; // Already shown this session
      case 'once_per_day':
        return now - lastShownTime > 24 * 60 * 60 * 1000;
      case 'once_per_week':
        return now - lastShownTime > 7 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  };

  // Mark popup as shown
  const markPopupShown = (popup: Popup) => {
    const storageKey = `popup_${popup.id}_last_shown`;
    localStorage.setItem(storageKey, Date.now().toString());
  };

  // Track analytics event
  const trackEvent = async (popupId: string, event: string) => {
    try {
      await fetch(`/api/popups/${popupId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });
    } catch (error) {
      console.error('Error tracking popup event:', error);
    }
  };

  // Show popup
  const showPopup = useCallback((popup: Popup) => {
    if (!shouldShowPopup(popup)) return;

    setActivePopup(popup);
    setIsVisible(true);
    markPopupShown(popup);
    trackEvent(popup.id, 'view');
  }, []);

  // Close popup
  const closePopup = () => {
    if (activePopup) {
      trackEvent(activePopup.id, 'dismissal');
    }
    setIsVisible(false);
    setTimeout(() => setActivePopup(null), 300); // Allow animation to complete
  };

  // Handle CTA click
  const handleCTAClick = () => {
    if (!activePopup) return;

    trackEvent(activePopup.id, 'click');

    if (activePopup.ctaType === 'link' && activePopup.ctaUrl) {
      window.location.href = activePopup.ctaUrl;
    } else if (activePopup.ctaType === 'discount_code') {
      // Copy discount code to clipboard
      if (activePopup.discountCode) {
        navigator.clipboard.writeText(activePopup.discountCode);
        alert(`Discount code ${activePopup.discountCode} copied to clipboard!`);
      }
    } else if (activePopup.ctaType === 'email_capture') {
      trackEvent(activePopup.id, 'conversion');
      closePopup();
    }
  };

  // Fetch active popups
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const pageType = getPageType();
        const response = await fetch(`/api/popups/active?page=${pageType}&url=${pathname}`);
        if (response.ok) {
          const data = await response.json();
          setPopups(data);
        }
      } catch (error) {
        console.error('Error fetching popups:', error);
      }
    };

    fetchPopups();
  }, [pathname]);

  // Setup triggers
  useEffect(() => {
    if (popups.length === 0 || activePopup) return;

    const triggerPopup = popups[0]; // Take highest priority popup

    // Wait for initial delay
    const initialDelay = setTimeout(() => {
      switch (triggerPopup.type) {
        case 'EXIT_INTENT':
          setupExitIntent(triggerPopup);
          break;
        case 'TIMED':
          setTimeout(() => showPopup(triggerPopup), (triggerPopup.triggerValue || 5) * 1000);
          break;
        case 'SCROLL_BASED':
          setupScrollTrigger(triggerPopup);
          break;
        case 'PAGE_LOAD':
          showPopup(triggerPopup);
          break;
      }
    }, triggerPopup.delaySeconds * 1000);

    return () => clearTimeout(initialDelay);
  }, [popups, activePopup, showPopup]);

  // Exit intent detection
  const setupExitIntent = (popup: Popup) => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup(popup);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  };

  // Scroll-based trigger
  const setupScrollTrigger = (popup: Popup) => {
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercentage >= (popup.triggerValue || 50)) {
        showPopup(popup);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  };

  // Get position styles
  const getPositionStyles = () => {
    if (!activePopup) return {};

    const base: any = {
      position: 'fixed',
      zIndex: 9999,
      width: `${activePopup.width}px`,
      height: activePopup.height ? `${activePopup.height}px` : 'auto',
    };

    switch (activePopup.position) {
      case 'CENTER':
        return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'TOP':
        return { ...base, top: 0, left: 0, right: 0, width: '100%' };
      case 'BOTTOM':
        return { ...base, bottom: 0, left: 0, right: 0, width: '100%' };
      case 'TOP_LEFT':
        return { ...base, top: '20px', left: '20px' };
      case 'TOP_RIGHT':
        return { ...base, top: '20px', right: '20px' };
      case 'BOTTOM_LEFT':
        return { ...base, bottom: '20px', left: '20px' };
      case 'BOTTOM_RIGHT':
        return { ...base, bottom: '20px', right: '20px' };
      default:
        return base;
    }
  };

  if (!activePopup) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: activePopup.overlayColor,
          zIndex: 9998,
        }}
        onClick={closePopup}
      />

      {/* Popup */}
      <div
        className={`transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          ...getPositionStyles(),
          backgroundColor: activePopup.backgroundColor,
          color: activePopup.textColor,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-lg shadow-2xl overflow-hidden">
          {/* Close button */}
          {activePopup.showCloseButton && (
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Image */}
            {activePopup.imageUrl && (
              <img
                src={activePopup.imageUrl}
                alt="Popup"
                className="w-full h-auto rounded"
              />
            )}

            {/* Title */}
            {activePopup.title && (
              <h2 className="text-2xl font-bold">{activePopup.title}</h2>
            )}

            {/* Content */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: activePopup.content }}
            />

            {/* Email capture form */}
            {activePopup.ctaType === 'email_capture' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCTAClick();
                }}
                className="space-y-2"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded font-semibold transition-colors"
                  style={{
                    backgroundColor: activePopup.buttonColor,
                    color: activePopup.buttonTextColor,
                  }}
                >
                  {activePopup.buttonText}
                </button>
              </form>
            )}

            {/* Discount code display */}
            {activePopup.ctaType === 'discount_code' && activePopup.discountCode && (
              <div className="space-y-2">
                <div className="p-4 bg-gray-100 rounded text-center">
                  <div className="text-sm text-gray-600 mb-1">Your discount code:</div>
                  <div className="text-2xl font-bold tracking-wider">{activePopup.discountCode}</div>
                </div>
                <button
                  onClick={handleCTAClick}
                  className="w-full py-3 rounded font-semibold transition-colors"
                  style={{
                    backgroundColor: activePopup.buttonColor,
                    color: activePopup.buttonTextColor,
                  }}
                >
                  {activePopup.buttonText}
                </button>
              </div>
            )}

            {/* Link button */}
            {activePopup.ctaType === 'link' && (
              <button
                onClick={handleCTAClick}
                className="w-full py-3 rounded font-semibold transition-colors"
                style={{
                  backgroundColor: activePopup.buttonColor,
                  color: activePopup.buttonTextColor,
                }}
              >
                {activePopup.buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
