'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/navigation';
import Image from 'next/image';
import { Search, Filter, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WishlistButton } from '@/components/public/WishlistButton';
import { ProductCard } from '@/components/public/ProductCard';
import { FilterSidebar } from '@/components/public/FilterSidebar';
import { SearchAutocomplete } from '@/components/public/SearchAutocomplete';
import { useTranslations } from 'next-intl';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: any;
  comparePrice: any;
  stock: number;
  featured: boolean;
  images: { url: string }[];
  category: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopContentProps {
  products: Product[];
  categories: Category[];
  initialSearch: string;
  initialCategory: string;
  initialFeatured: boolean;
  initialSort: string;
}

export function ShopContent({
  products,
  categories,
  initialSearch,
  initialCategory,
  initialFeatured,
  initialSort,
}: ShopContentProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (params: Record<string, string>) => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.set(key, value);
    });
    router.push(`/shop?${url.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = { search };
    if (initialCategory) params.category = initialCategory;
    if (initialFeatured) params.featured = 'true';
    if (initialSort !== 'newest') params.sort = initialSort;
    applyFilters(params);
  };

  const handleCategoryFilter = (categorySlug: string) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (categorySlug) params.category = categorySlug;
    if (initialFeatured) params.featured = 'true';
    if (initialSort !== 'newest') params.sort = initialSort;
    applyFilters(params);
  };

  const handleFeaturedToggle = () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (initialCategory) params.category = initialCategory;
    if (!initialFeatured) params.featured = 'true';
    if (initialSort !== 'newest') params.sort = initialSort;
    applyFilters(params);
  };

  const handleSortChange = (sortValue: string) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (initialCategory) params.category = initialCategory;
    if (initialFeatured) params.featured = 'true';
    if (sortValue !== 'newest') params.sort = sortValue;
    applyFilters(params);
  };

  const clearFilters = () => {
    setSearch('');
    router.push('/shop');
  };

  const hasActiveFilters = search || initialCategory || initialFeatured;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('shop.title')}</h1>
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? t('cart.item') : t('cart.items')} found
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <SearchAutocomplete
              value={search}
              onChange={setSearch}
              onSubmit={(value) => {
                const params: Record<string, string> = { search: value };
                if (initialCategory) params.category = initialCategory;
                if (initialFeatured) params.featured = 'true';
                if (initialSort !== 'newest') params.sort = initialSort;
                applyFilters(params);
              }}
              placeholder={t('shop.searchPlaceholder')}
            />
          </form>

          {/* Sort */}
          <select
            value={initialSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="newest">{t('shop.sort.newest')}</option>
            <option value="price-asc">{t('shop.sort.priceLowHigh')}</option>
            <option value="price-desc">{t('shop.sort.priceHighLow')}</option>
            <option value="name">{t('shop.sort.nameAZ')}</option>
          </select>

          {/* Filter Toggle (Mobile) */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden min-h-[44px]"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('shop.filters')}
          </Button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600">{t('shop.activeFilters')}</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {t('shop.filterSearch')} {search}
                <button
                  onClick={() => {
                    setSearch('');
                    const params: Record<string, string> = {};
                    if (initialCategory) params.category = initialCategory;
                    if (initialFeatured) params.featured = 'true';
                    if (initialSort !== 'newest') params.sort = initialSort;
                    applyFilters(params);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {initialCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {t('shop.filterCategory')} {categories.find(c => c.slug === initialCategory)?.name}
                <button onClick={() => handleCategoryFilter('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {initialFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {t('shop.filterFeatured')}
                <button onClick={handleFeaturedToggle}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline ml-2"
            >
              {t('shop.clearAll')}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <FilterSidebar
          categories={categories}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApplyFilters={(filters) => {
            const params: Record<string, string> = {};
            if (filters.category) params.category = filters.category;
            if (filters.featured) params.featured = 'true';
            if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
              params.priceMin = filters.priceRange[0].toString();
              params.priceMax = filters.priceRange[1].toString();
            }
            if (filters.inStock === true) params.inStock = 'true';
            if (search) params.search = search;
            if (initialSort !== 'newest') params.sort = initialSort;
            applyFilters(params);
          }}
          initialFilters={{
            category: initialCategory,
            featured: initialFeatured,
          }}
          priceRange={{ min: 0, max: 1000 }}
        />

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-2">{t('shop.noProducts')}</p>
              <p className="text-sm text-gray-400 mb-4">
                {t('shop.noProductsDesc')}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters}>{t('shop.clearFilters')}</Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
