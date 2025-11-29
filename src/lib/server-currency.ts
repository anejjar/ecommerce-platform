import { prisma } from '@/lib/prisma';
import { formatCurrencyWithSymbol, formatCurrencyWithSymbolNoDecimals } from '@/lib/formatting';

/**
 * Get currency symbol from settings (server-side)
 */
export async function getCurrencySymbol(): Promise<string> {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key: 'general_currency_symbol' },
    });
    return setting?.value || '$';
  } catch (error) {
    console.error('Error fetching currency symbol:', error);
    return '$';
  }
}

/**
 * Format currency with symbol from settings (server-side)
 */
export async function formatCurrencyServer(amount: number | string): Promise<string> {
  const symbol = await getCurrencySymbol();
  return formatCurrencyWithSymbol(amount, symbol);
}

/**
 * Format currency with symbol from settings, no decimals (server-side)
 */
export async function formatCurrencyServerNoDecimals(amount: number | string): Promise<string> {
  const symbol = await getCurrencySymbol();
  return formatCurrencyWithSymbolNoDecimals(amount, symbol);
}

