'use client';

import { useState, useTransition } from 'react';
import { usePathname, useRouter } from '@/navigation';
import { useLocale } from 'next-intl';
import { Globe, Loader2 } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);

  const switchLanguage = (newLocale: string) => {
    if (newLocale === currentLocale || isPending) return;

    setSelectedLocale(newLocale);

    startTransition(() => {
      // Use next-intl's router which automatically handles locale prefixes
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {languages.find((l) => l.code === currentLocale)?.flag}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((lang) => {
            const isActive = currentLocale === lang.code;
            const isLoading = isPending && selectedLocale === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                disabled={isPending}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-200'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {isLoading && (
                  <Loader2 className="ml-auto w-3 h-3 animate-spin" />
                )}
                {isActive && !isLoading && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
