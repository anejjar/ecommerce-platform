import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales - can be managed from admin
export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();
  console.log(locale);
  try {
    // Try to load translations from the messages directory (admin managed)
    const messages = (await import(`../messages/${locale}.json`)).default;
    return {
      locale: locale as string,
      messages
    };
  } catch (error) {
    // If no translation file exists, fall back to English
    console.warn(`Translation file for ${locale} not found, using English`);
    const messages = (await import(`../messages/en.json`)).default;
    return {
      locale: locale as string,
      messages
    };
  }
});
