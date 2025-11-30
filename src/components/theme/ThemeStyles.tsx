'use client';

import { useTheme } from '@/hooks/useTheme';
import { themeToCSSVariables } from '@/lib/themes/theme-utils';
import { useEffect } from 'react';

export function ThemeStyles() {
  const { theme, loading } = useTheme();

  useEffect(() => {
    if (!theme) {
      // Remove theme styles if theme is cleared
      const existingStyle = document.getElementById('theme-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      return;
    }

    const cssVariables = themeToCSSVariables(theme);
    const customCSS = theme.customCSS || '';
    const fullCSS = cssVariables + (customCSS ? `\n\n${customCSS}` : '');

    // Remove existing theme styles if any
    const existingStyle = document.getElementById('theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Inject new theme styles
    const style = document.createElement('style');
    style.id = 'theme-styles';
    style.textContent = fullCSS;
    document.head.appendChild(style);

    console.log('Theme applied:', theme.metadata?.name);

    return () => {
      const styleToRemove = document.getElementById('theme-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [theme]);

  return null;
}

