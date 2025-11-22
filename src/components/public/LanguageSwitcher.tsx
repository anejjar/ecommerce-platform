'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { locales } from '@/i18n';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const switchLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Save to localStorage
    localStorage.setItem('locale', newLocale);

    // Dispatch custom event to update IntlProvider
    const event = new CustomEvent('localeChange', { detail: { locale: newLocale } });
    window.dispatchEvent(event);

    // Reload the page to apply new locale
    window.location.reload();
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-100">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {languages.find((l) => l.code === currentLocale)?.flag}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={'w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ' + (currentLocale === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : '')}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLocale === lang.code && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
