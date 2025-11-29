/**
 * Localized formatting utilities for currency, dates, and numbers
 */

/**
 * Format currency based on locale
 */
export function formatCurrency(
  amount: number | string,
  locale: string = 'en',
  currency: string = 'USD'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(numAmount);
  } catch (error) {
    // Fallback to USD if currency not supported
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  }
}

/**
 * Format date based on locale
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format date and time based on locale
 */
export function formatDateTime(
  date: Date | string,
  locale: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format number based on locale
 */
export function formatNumber(
  number: number | string,
  locale: string = 'en',
  options?: Intl.NumberFormatOptions
): string {
  const num = typeof number === 'string' ? parseFloat(number) : number;

  return new Intl.NumberFormat(locale, options).format(num);
}

/**
 * Format percentage based on locale
 */
export function formatPercentage(
  value: number | string,
  locale: string = 'en',
  decimals: number = 0
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num / 100);
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(diffInSeconds > 0 ? -count : count, interval.unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Format file size with locale-specific number formatting
 */
export function formatFileSize(
  bytes: number,
  locale: string = 'en',
  decimals: number = 2
): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);
  const formatted = formatNumber(value, locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${formatted} ${sizes[i]}`;
}

/**
 * Get locale-specific currency symbol
 */
export function getCurrencySymbol(locale: string = 'en', currency: string = 'USD'): string {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0);

  // Extract symbol by removing the number
  return formatted.replace(/\d/g, '').trim();
}

/**
 * Format currency amount with custom symbol
 * This is used when you want to use the currency symbol from settings
 */
export function formatCurrencyWithSymbol(
  amount: number | string,
  symbol: string = '$',
  locale: string = 'en-US'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return `${symbol}0.00`;
  }

  // Format the number with locale-specific formatting
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);

  return `${symbol}${formatted}`;
}

/**
 * Format currency amount with custom symbol (no decimals)
 */
export function formatCurrencyWithSymbolNoDecimals(
  amount: number | string,
  symbol: string = '$',
  locale: string = 'en-US'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return `${symbol}0`;
  }

  // Format the number with locale-specific formatting
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);

  return `${symbol}${formatted}`;
}

/**
 * Format list of items based on locale
 */
export function formatList(
  items: string[],
  locale: string = 'en',
  type: 'conjunction' | 'disjunction' = 'conjunction'
): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];

  const formatter = new Intl.ListFormat(locale, {
    style: 'long',
    type,
  });

  return formatter.format(items);
}

/**
 * Format compact number (e.g., 1K, 1M)
 */
export function formatCompactNumber(
  number: number | string,
  locale: string = 'en'
): string {
  const num = typeof number === 'string' ? parseFloat(number) : number;

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Locale configuration for specific locales
 */
export const localeConfigs = {
  en: {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  fr: {
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  },
} as const;

/**
 * Get locale configuration
 */
export function getLocaleConfig(locale: string) {
  return localeConfigs[locale as keyof typeof localeConfigs] || localeConfigs.en;
}
