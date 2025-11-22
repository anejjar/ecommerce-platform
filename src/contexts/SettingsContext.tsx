'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface StoreSettings {
  // General Settings
  general_store_name?: string;
  general_store_tagline?: string;
  general_store_email?: string;
  general_store_phone?: string;
  general_store_address?: string;
  general_currency?: string;
  general_currency_symbol?: string;

  // SEO Settings
  seo_meta_title?: string;
  seo_meta_description?: string;
  seo_meta_keywords?: string;
  seo_og_title?: string;
  seo_og_description?: string;
  seo_og_image?: string;
  seo_twitter_handle?: string;
  seo_google_analytics_id?: string;

  // Appearance Settings
  appearance_logo_url?: string;
  appearance_favicon_url?: string;
  appearance_primary_color?: string;
  appearance_secondary_color?: string;
  appearance_accent_color?: string;
  appearance_font_family?: string;
  appearance_show_breadcrumbs?: string;
  appearance_show_product_reviews?: string;
  appearance_show_related_products?: string;
  appearance_custom_css?: string;
  appearance_custom_js?: string;

  // Social Media Settings
  social_facebook_url?: string;
  social_twitter_url?: string;
  social_instagram_url?: string;
  social_linkedin_url?: string;
  social_youtube_url?: string;
  social_pinterest_url?: string;
  social_tiktok_url?: string;
  social_facebook_pixel_id?: string;

  // Shipping Settings
  shipping_free_threshold?: string;
  shipping_flat_rate?: string;
  shipping_enable_free?: string;
  shipping_enable_flat_rate?: string;
  tax_rate_default?: string;
  tax_enable?: string;
}

interface SettingsContextType {
  settings: StoreSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      // Fetch all settings categories
      const categories = ['general', 'seo', 'appearance', 'social', 'shipping'];
      const promises = categories.map(async (category) => {
        const response = await fetch(`/api/settings?category=${category}`);
        if (response.ok) {
          return await response.json();
        }
        return {};
      });

      const results = await Promise.all(promises);
      const allSettings = results.reduce((acc, result) => ({ ...acc, ...result }), {});
      setSettings(allSettings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
