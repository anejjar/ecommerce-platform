import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { StoreProvider } from '@/lib/redux/StoreProvider';
import { SessionProvider } from '@/components/SessionProvider';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { CustomScripts } from '@/components/CustomScripts';
import { CustomStyles } from '@/components/CustomStyles';
import { PopupManager } from '@/components/PopupManager';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <SettingsProvider>
          <StoreProvider>
            <CustomStyles />
            <CustomScripts />
            {children}
            <PopupManager />
          </StoreProvider>
        </SettingsProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
