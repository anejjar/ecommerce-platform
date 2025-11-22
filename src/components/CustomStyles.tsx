'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { useEffect } from 'react';

export function CustomStyles() {
  const { settings } = useSettings();

  const customCSS = settings.appearance_custom_css;

  useEffect(() => {
    // Inject custom CSS if provided
    if (customCSS) {
      const style = document.createElement('style');
      style.textContent = customCSS;
      style.id = 'custom-store-styles';
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById('custom-store-styles');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [customCSS]);

  return null; // This component doesn't render anything
}
