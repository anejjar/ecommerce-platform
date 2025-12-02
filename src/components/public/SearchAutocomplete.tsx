'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/navigation';
import { Link } from '@/navigation';
import Image from 'next/image';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { handleImageError } from '@/lib/image-utils';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: Array<{ url: string }>;
  category: { name: string; slug: string } | null;
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClose?: () => void;
  placeholder?: string;
}

const STORAGE_KEY = 'recent-searches';

export function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  onClose,
  placeholder = 'Search products...',
}: SearchAutocompleteProps) {
  const t = useTranslations();
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (value.length < 2) {
      setResults([]);
      setShowSuggestions(value.length > 0);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/public-search?q=${encodeURIComponent(query)}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (query: string) => {
    addToRecentSearches(query);
    onChange(query);
    onSubmit(query);
    setShowSuggestions(false);
    onClose?.();
  };

  const handleRemoveRecent = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addToRecentSearches = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasResults = results.length > 0;
  const hasRecentSearches = recentSearches.length > 0;
  const showDropdown = showSuggestions && (hasResults || hasRecentSearches || isLoading);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (value.trim().length >= 2) {
                handleSelect(value);
              }
            } else if (e.key === 'Escape') {
              setShowSuggestions(false);
              onClose?.();
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 min-w-[24px] min-h-[24px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[500px] overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && hasResults && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Products
              </div>
              <div className="space-y-1">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      handleSelect(product.name);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-amber-50 rounded-lg transition-colors group"
                  >
                    <div className="relative w-12 h-12 bg-amber-50 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-300">
                          <span className="text-xl">☕</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-amber-900 truncate">
                        {product.name}
                      </p>
                      {product.category && (
                        <p className="text-xs text-gray-500">{product.category.name}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-semibold text-amber-900">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                        <p className="text-xs text-gray-400 line-through">
                          ${Number(product.comparePrice).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {value.length >= 2 && (
                <Link
                  href={`/shop?search=${encodeURIComponent(value)}`}
                  onClick={() => {
                    handleSelect(value);
                  }}
                  className="block px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-lg font-medium text-center border-t mt-2"
                >
                  View all results for "{value}"
                </Link>
              )}
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && !hasResults && hasRecentSearches && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(search)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-amber-50 rounded-lg transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{search}</span>
                    </div>
                    <button
                      onClick={(e) => handleRemoveRecent(search, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0 min-w-[24px] min-h-[24px] flex items-center justify-center"
                      aria-label="Remove search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !hasResults && !hasRecentSearches && value.length >= 2 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-2">No products found</p>
              <p className="text-sm text-gray-400">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

