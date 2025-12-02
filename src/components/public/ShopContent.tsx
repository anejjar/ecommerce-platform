'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/public/ProductCard';
import { FilterSidebar } from '@/components/public/FilterSidebar';
import { SearchAutocomplete } from '@/components/public/SearchAutocomplete';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

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

interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface ShopContentProps {
  products: Product[];
  categories: Category[];
  initialSearch: string;
  initialCategory: string;
  initialFeatured: boolean;
  initialSort: string;
  pagination: PaginationInfo;
}

export function ShopContent({
  products,
  categories,
  initialSearch,
  initialCategory,
  initialFeatured,
  initialSort,
  pagination,
}: ShopContentProps) {
  const t = useTranslations();
  const router = useRouter();
  const { theme } = useTheme();
  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (params: Record<string, string>, resetPage: boolean = true) => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.set(key, value);
    });
    if (resetPage && !params.page) {
      url.set('page', '1');
    }
    router.push(`/shop?${url.toString()}`);
  };

  const goToPage = (page: number) => {
    const params: Record<string, string> = {};
    if (initialSearch) params.search = initialSearch;
    if (initialCategory) params.category = initialCategory;
    if (initialFeatured) params.featured = 'true';
    if (initialSort !== 'newest') params.sort = initialSort;
    params.page = page.toString();
    applyFilters(params, false);
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-medium mb-3">{t('shop.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {products.length > 0 ? (
            <>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
              {pagination.total === 1 ? t('cart.item') : t('cart.items')}
            </>
          ) : (
            <>No products found</>
          )}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-8">
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
            className="px-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-ring transition-all"
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
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">{t('shop.activeFilters')}:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-lg text-sm">
                {t('shop.filterSearch')} "{search}"
                <button
                  onClick={() => {
                    setSearch('');
                    const params: Record<string, string> = {};
                    if (initialCategory) params.category = initialCategory;
                    if (initialFeatured) params.featured = 'true';
                    if (initialSort !== 'newest') params.sort = initialSort;
                    applyFilters(params);
                  }}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {initialCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-lg text-sm">
                {t('shop.filterCategory')} {categories.find(c => c.slug === initialCategory)?.name}
                <button onClick={() => handleCategoryFilter('')} className="hover:opacity-70 transition-opacity">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {initialFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-lg text-sm">
                {t('shop.filterFeatured')}
                <button onClick={handleFeaturedToggle} className="hover:opacity-70 transition-opacity">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors ml-2"
            >
              {t('shop.clearAll')}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6 lg:gap-8">
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
            <div className="bg-card border border-border rounded-lg p-12 md:p-16 text-center">
              <p className="text-foreground text-lg font-medium mb-2">{t('shop.noProducts')}</p>
              <p className="text-sm text-muted-foreground mb-6">
                {t('shop.noProductsDesc')}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">{t('shop.clearFilters')}</Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-subtle-lift"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  {pagination.page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => goToPage(pagination.page - 1)}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t('shop.pagination.previous') || 'Previous'}
                    </Button>
                  )}
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    {t('shop.pagination.page') || 'Page'} {pagination.page} {t('shop.pagination.of') || 'of'} {pagination.totalPages}
                  </span>
                  {pagination.page < pagination.totalPages && (
                    <Button
                      variant="outline"
                      onClick={() => goToPage(pagination.page + 1)}
                      className="gap-2"
                    >
                      {t('shop.pagination.next') || 'Next'}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
