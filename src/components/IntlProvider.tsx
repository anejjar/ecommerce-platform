'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import { defaultLocale } from '@/i18n';

interface IntlProviderProps {
  children: ReactNode;
}

export function IntlProvider({ children }: IntlProviderProps) {
  const [messages, setMessages] = useState<any>(null);
  const [locale, setLocale] = useState<string>(defaultLocale);

  useEffect(() => {
    const supportedLocales = ['en', 'es', 'fr', 'de', 'ar', 'zh', 'ja'];

    // Try to get locale from localStorage
    const savedLocale = localStorage.getItem('locale');
    const currentLocale = savedLocale && supportedLocales.includes(savedLocale) ? savedLocale : defaultLocale;

    setLocale(currentLocale);

    // Load messages for the locale
    import(`../../messages/${currentLocale}.json`)
      .then((module) => setMessages(module.default))
      .catch(() => {
        // Fallback to English if translation file doesn't exist
        import(`../../messages/en.json`).then((module) => setMessages(module.default));
      });

    // Listen for locale change events
    const handleLocaleChange = (event: CustomEvent) => {
      const newLocale = event.detail.locale;
      if (supportedLocales.includes(newLocale)) {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);

        import(`../../messages/${newLocale}.json`)
          .then((module) => setMessages(module.default))
          .catch(() => {
            import(`../../messages/en.json`).then((module) => setMessages(module.default));
          });
      }
    };

    window.addEventListener('localeChange' as any, handleLocaleChange);

    return () => {
      window.removeEventListener('localeChange' as any, handleLocaleChange);
    };
  }, []);

  // Always render the provider, use empty messages as fallback
  return (
    <NextIntlClientProvider locale={locale} messages={messages || {}}>
      {children}
    </NextIntlClientProvider>
  );
}
