'use client';

import { ThemeProvider as ThemeContextProvider } from '@/contexts/ThemeContext';
import { ThemeStyles } from '@/components/theme/ThemeStyles';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContextProvider>
      <ThemeStyles />
      {children}
    </ThemeContextProvider>
  );
}

