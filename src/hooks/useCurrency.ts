'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { formatCurrencyWithSymbol, formatCurrencyWithSymbolNoDecimals } from '@/lib/formatting';

/**
 * Custom hook to format currency using the currency symbol from settings
 * This hook should be used throughout the application instead of hardcoding currency symbols
 */
export function useCurrency() {
  const { settings } = useSettings();
  const currencySymbol = settings.general_currency_symbol || '$';

  /**
   * Format currency with 2 decimal places
   */
  const format = (amount: number | string): string => {
    return formatCurrencyWithSymbol(amount, currencySymbol);
  };

  /**
   * Format currency without decimal places
   */
  const formatNoDecimals = (amount: number | string): string => {
    return formatCurrencyWithSymbolNoDecimals(amount, currencySymbol);
  };

  /**
   * Get the currency symbol
   */
  const symbol = currencySymbol;

  /**
   * Format a number with the currency symbol (for custom formatting)
   */
  const formatWithSymbol = (amount: number | string, options?: { decimals?: number }): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) {
      return `${currencySymbol}0${options?.decimals === 0 ? '' : '.00'}`;
    }

    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: options?.decimals ?? 2,
      maximumFractionDigits: options?.decimals ?? 2,
    }).format(numAmount);

    return `${currencySymbol}${formatted}`;
  };

  return {
    format,
    formatNoDecimals,
    symbol,
    formatWithSymbol,
  };
}

