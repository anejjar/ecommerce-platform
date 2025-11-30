/**
 * useTheme Hook
 * Convenience hook to access theme configuration
 */

import { useThemeContext } from '@/contexts/ThemeContext';
import { ThemeConfig } from '@/lib/themes/theme-schema';

export function useTheme(): {
  theme: ThemeConfig | null;
  loading: boolean;
  error: string | null;
  refreshTheme: () => Promise<void>;
} {
  return useThemeContext();
}

