'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeConfig } from '@/lib/themes/theme-schema';

interface ThemeContextType {
  theme: ThemeConfig | null;
  loading: boolean;
  error: string | null;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveTheme = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/themes/active', {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch active theme');
      }

      const data = await response.json();
      if (data.theme) {
        setTheme(data.theme);
      } else {
        setTheme(null);
      }
    } catch (err) {
      console.error('Error fetching theme:', err);
      setError(err instanceof Error ? err.message : 'Failed to load theme');
      setTheme(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        loading,
        error,
        refreshTheme: fetchActiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

