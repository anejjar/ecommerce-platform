'use client';

import { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: {
    category?: string;
    featured?: boolean;
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
  };
  priceRange?: { min: number; max: number };
}

interface FilterState {
  category: string;
  featured: boolean;
  priceRange: [number, number];
  inStock: boolean | null;
}

export function FilterSidebar({
  categories,
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = {},
  priceRange,
}: FilterSidebarProps) {
  const t = useTranslations();
  const [filters, setFilters] = useState<FilterState>({
    category: initialFilters.category || '',
    featured: initialFilters.featured || false,
    priceRange: [
      initialFilters.priceMin || priceRange?.min || 0,
      initialFilters.priceMax || priceRange?.max || 1000,
    ],
    inStock: initialFilters.inStock !== undefined ? initialFilters.inStock : null,
  });

  const minPrice = priceRange?.min || 0;
  const maxPrice = priceRange?.max || 1000;

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      category: '',
      featured: false,
      priceRange: [minPrice, maxPrice],
      inStock: null,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  const activeFilterCount = [
    filters.category,
    filters.featured,
    filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice,
    filters.inStock !== null,
  ].filter(Boolean).length;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {t('shop.filters')}
            </h2>
            {activeFilterCount > 0 && (
              <span className="bg-amber-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {t('shop.categories')}
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <label className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2">
                  <Checkbox
                    checked={filters.category === ''}
                    onCheckedChange={(checked) => {
                      setFilters({ ...filters, category: checked ? '' : filters.category });
                    }}
                  />
                  <span className="text-sm text-gray-700">{t('shop.allCategories')}</span>
                </label>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2"
                  >
                    <Checkbox
                      checked={filters.category === category.slug}
                      onCheckedChange={(checked) => {
                        setFilters({
                          ...filters,
                          category: checked ? category.slug : '',
                        });
                      }}
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {t('shop.priceRange')}
              </h3>
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => {
                    setFilters({ ...filters, priceRange: value as [number, number] });
                  }}
                  min={minPrice}
                  max={maxPrice}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    ${filters.priceRange[0].toFixed(2)}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-600">
                    ${filters.priceRange[1].toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {t('shop.availability')}
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2">
                  <Checkbox
                    checked={filters.inStock === null}
                    onCheckedChange={(checked) => {
                      setFilters({ ...filters, inStock: checked ? null : filters.inStock });
                    }}
                  />
                  <span className="text-sm text-gray-700">{t('shop.allProducts')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2">
                  <Checkbox
                    checked={filters.inStock === true}
                    onCheckedChange={(checked) => {
                      setFilters({ ...filters, inStock: checked ? true : null });
                    }}
                  />
                  <span className="text-sm text-gray-700">{t('shop.inStockOnly')}</span>
                </label>
              </div>
            </div>

            {/* Featured */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2">
                <Checkbox
                  checked={filters.featured}
                  onCheckedChange={(checked) => {
                    setFilters({ ...filters, featured: checked as boolean });
                  }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {t('shop.featuredOnly')}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button
                onClick={handleApply}
                className="w-full bg-amber-800 hover:bg-amber-900"
              >
                {t('shop.applyFilters')}
              </Button>
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  {t('shop.resetFilters')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t('shop.filters')}
              </span>
              {activeFilterCount > 0 && (
                <span className="bg-amber-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {t('shop.categories')}
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <label className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2">
                  <Checkbox
                    checked={filters.category === ''}
                    onCheckedChange={(checked) => {
                      setFilters({ ...filters, category: checked ? '' : filters.category });
                    }}
                  />
                  <span className="text-sm text-gray-700">{t('shop.allCategories')}</span>
                </label>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2"
                  >
                    <Checkbox
                      checked={filters.category === category.slug}
                      onCheckedChange={(checked) => {
                        setFilters({
                          ...filters,
                          category: checked ? category.slug : '',
                        });
                      }}
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {t('shop.priceRange')}
              </h3>
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => {
                    setFilters({ ...filters, priceRange: value as [number, number] });
                  }}
                  min={minPrice}
                  max={maxPrice}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    ${filters.priceRange[0].toFixed(2)}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-600">
                    ${filters.priceRange[1].toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {t('shop.availability')}
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2">
                  <Checkbox
                    checked={filters.inStock === null}
                    onCheckedChange={(checked) => {
                      setFilters({ ...filters, inStock: checked ? null : filters.inStock });
                    }}
                  />
                  <span className="text-sm text-gray-700">{t('shop.allProducts')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2">
                  <Checkbox
                    checked={filters.inStock === true}
                    onCheckedChange={(checked) => {
                      setFilters({ ...filters, inStock: checked ? true : null });
                    }}
                  />
                  <span className="text-sm text-gray-700">{t('shop.inStockOnly')}</span>
                </label>
              </div>
            </div>

            {/* Featured */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer py-2 hover:bg-amber-50 rounded px-2 -mx-2">
                <Checkbox
                  checked={filters.featured}
                  onCheckedChange={(checked) => {
                    setFilters({ ...filters, featured: checked as boolean });
                  }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {t('shop.featuredOnly')}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t sticky bottom-0 bg-white pb-4">
              <Button
                onClick={handleApply}
                className="w-full bg-amber-800 hover:bg-amber-900"
              >
                {t('shop.applyFilters')}
              </Button>
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  {t('shop.resetFilters')}
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

