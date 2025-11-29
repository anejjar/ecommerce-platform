import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercentage,
  formatRelativeTime,
  formatFileSize,
  getCurrencySymbol,
  formatList,
  formatCompactNumber,
  getLocaleConfig,
} from '@/lib/formatting';

describe('formatting', () => {
  describe('formatCurrency', () => {
    it('should format USD currency with default locale', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('should format currency with different locale', () => {
      const result = formatCurrency(1234.56, 'de', 'EUR');
      expect(result).toContain('1.234,56');
    });

    it('should handle string amounts', () => {
      const result = formatCurrency('1234.56');
      expect(result).toBe('$1,234.56');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toBe('$0.00');
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(-100);
      expect(result).toContain('-');
      expect(result).toContain('100');
    });

    it('should fallback to USD on invalid currency', () => {
      const result = formatCurrency(100, 'en', 'INVALID');
      expect(result).toBe('$100.00');
    });

    it('should handle large numbers', () => {
      const result = formatCurrency(1000000);
      expect(result).toBe('$1,000,000.00');
    });

    it('should handle decimal precision', () => {
      const result = formatCurrency(10.999);
      expect(result).toBe('$11.00');
    });
  });

  describe('formatDate', () => {
    it('should format date with default options', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('January');
      expect(result).toContain('15');
    });

    it('should format string date', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('2024');
    });

    it('should format with custom locale', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'fr');
      expect(result).toContain('2024');
      expect(result).toContain('janvier');
    });

    it('should format with custom options', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'en', { month: 'short', day: '2-digit' });
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toContain('2024');
      expect(result).toContain('January');
      expect(result).toContain('15');
    });

    it('should include time in output', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDateTime(date, 'en');
      expect(result).toMatch(/\d{1,2}:\d{2}/); // Match time pattern
    });

    it('should handle string dates', () => {
      const result = formatDateTime('2024-01-15T14:30:00');
      expect(result).toContain('2024');
    });
  });

  describe('formatNumber', () => {
    it('should format number with default locale', () => {
      const result = formatNumber(1234.56);
      expect(result).toBe('1,234.56');
    });

    it('should format with different locale', () => {
      const result = formatNumber(1234.56, 'de');
      expect(result).toBe('1.234,56');
    });

    it('should handle string numbers', () => {
      const result = formatNumber('1234.56');
      expect(result).toBe('1,234.56');
    });

    it('should handle custom options', () => {
      const result = formatNumber(1234.56, 'en', {
        minimumFractionDigits: 3,
      });
      expect(result).toBe('1,234.560');
    });

    it('should handle zero', () => {
      const result = formatNumber(0);
      expect(result).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with default decimals', () => {
      const result = formatPercentage(50);
      expect(result).toBe('50%');
    });

    it('should format with custom decimals', () => {
      const result = formatPercentage(50.555, 'en', 2);
      expect(result).toBe('50.55%');
    });

    it('should handle string values', () => {
      const result = formatPercentage('75');
      expect(result).toBe('75%');
    });

    it('should handle decimal percentages', () => {
      const result = formatPercentage(0.5, 'en', 2);
      expect(result).toBe('0.50%');
    });

    it('should handle 100%', () => {
      const result = formatPercentage(100);
      expect(result).toBe('100%');
    });

    it('should handle zero', () => {
      const result = formatPercentage(0);
      expect(result).toBe('0%');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format seconds ago', () => {
      const date = new Date(Date.now() - 30 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toContain('30 seconds ago');
    });

    it('should format minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toContain('5 minutes ago');
    });

    it('should format hours ago', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toContain('2 hours ago');
    });

    it('should format days ago', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toContain('3 days ago');
    });

    it('should handle string dates', () => {
      const dateString = new Date(Date.now() - 60 * 1000).toISOString();
      const result = formatRelativeTime(dateString);
      expect(result).toContain('1 minute ago');
    });

    it('should handle future dates', () => {
      const date = new Date(Date.now() + 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toContain('in');
    });

    it('should handle now', () => {
      const date = new Date();
      const result = formatRelativeTime(date);
      expect(result).toBeDefined();
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      const result = formatFileSize(100);
      expect(result).toContain('100');
      expect(result).toContain('Bytes');
    });

    it('should format kilobytes', () => {
      const result = formatFileSize(1024);
      expect(result).toContain('1');
      expect(result).toContain('KB');
    });

    it('should format megabytes', () => {
      const result = formatFileSize(1024 * 1024);
      expect(result).toContain('1');
      expect(result).toContain('MB');
    });

    it('should format gigabytes', () => {
      const result = formatFileSize(1024 * 1024 * 1024);
      expect(result).toContain('1');
      expect(result).toContain('GB');
    });

    it('should handle zero', () => {
      const result = formatFileSize(0);
      expect(result).toBe('0 Bytes');
    });

    it('should handle custom decimals', () => {
      const result = formatFileSize(1536, 'en', 1);
      expect(result).toContain('1.5');
      expect(result).toContain('KB');
    });

    it('should format large files', () => {
      const result = formatFileSize(1024 * 1024 * 1024 * 1024);
      expect(result).toContain('TB');
    });
  });

  describe('getCurrencySymbol', () => {
    it('should get USD symbol', () => {
      const result = getCurrencySymbol('en', 'USD');
      expect(result).toBe('$');
    });

    it('should get EUR symbol', () => {
      const result = getCurrencySymbol('en', 'EUR');
      expect(result).toBe('€');
    });

    it('should get GBP symbol', () => {
      const result = getCurrencySymbol('en', 'GBP');
      expect(result).toBe('£');
    });

    it('should handle different locales', () => {
      const result = getCurrencySymbol('fr', 'EUR');
      expect(result).toBeDefined();
    });
  });

  describe('formatList', () => {
    it('should format list with conjunction', () => {
      const result = formatList(['apple', 'banana', 'orange']);
      expect(result).toContain('apple');
      expect(result).toContain('banana');
      expect(result).toContain('orange');
      expect(result).toContain('and');
    });

    it('should format list with disjunction', () => {
      const result = formatList(['red', 'blue', 'green'], 'en', 'disjunction');
      expect(result).toContain('or');
    });

    it('should handle single item', () => {
      const result = formatList(['apple']);
      expect(result).toBe('apple');
    });

    it('should handle empty list', () => {
      const result = formatList([]);
      expect(result).toBe('');
    });

    it('should handle two items', () => {
      const result = formatList(['apple', 'banana']);
      expect(result).toContain('apple');
      expect(result).toContain('banana');
    });

    it('should handle different locale', () => {
      const result = formatList(['pomme', 'banane', 'orange'], 'fr');
      expect(result).toBeDefined();
    });
  });

  describe('formatCompactNumber', () => {
    it('should format thousands', () => {
      const result = formatCompactNumber(1000);
      expect(result).toBe('1K');
    });

    it('should format millions', () => {
      const result = formatCompactNumber(1000000);
      expect(result).toBe('1M');
    });

    it('should format billions', () => {
      const result = formatCompactNumber(1000000000);
      expect(result).toBe('1B');
    });

    it('should handle small numbers', () => {
      const result = formatCompactNumber(999);
      expect(result).toBe('999');
    });

    it('should handle string numbers', () => {
      const result = formatCompactNumber('5000');
      expect(result).toBe('5K');
    });

    it('should handle decimal values', () => {
      const result = formatCompactNumber(1500);
      expect(result).toContain('1');
    });

    it('should handle zero', () => {
      const result = formatCompactNumber(0);
      expect(result).toBe('0');
    });
  });

  describe('getLocaleConfig', () => {
    it('should get English locale config', () => {
      const result = getLocaleConfig('en');
      expect(result).toEqual({
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
      });
    });

    it('should get French locale config', () => {
      const result = getLocaleConfig('fr');
      expect(result).toEqual({
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
      });
    });

    it('should default to English for unknown locale', () => {
      const result = getLocaleConfig('unknown');
      expect(result).toEqual({
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
      });
    });
  });
});
