import { SessionProvider } from '@/components/SessionProvider';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale } from '@/i18n';
import { StoreProvider } from '@/lib/redux/StoreProvider';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const dynamic = 'force-dynamic';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use default locale for auth pages since they're not localized
  const locale = defaultLocale;
  
  // Import messages using the same pattern as i18n.ts
  // From src/app/auth/ to messages/ = ../../../messages/
  let messages;
  try {
    // Try to load translations from the messages directory
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    // If no translation file exists, fall back to English
    console.warn(`Translation file for ${locale} not found, using English`);
    messages = (await import(`../../../messages/en.json`)).default;
  }

  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <SettingsProvider>
          <ThemeProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </ThemeProvider>
        </SettingsProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
