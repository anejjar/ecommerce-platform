'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        <h1 className="text-4xl font-bold mb-2">Shop All Products</h1>
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Sort */}
          <select
            value={initialSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          {/* Filter Toggle (Mobile) */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: {search}
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
                Category: {categories.find(c => c.slug === initialCategory)?.name}
                <button onClick={() => handleCategoryFilter('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {initialFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Featured Only
                <button onClick={handleFeaturedToggle}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Filters</h2>

            {/* Featured Toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={initialFeatured}
                  onChange={handleFeaturedToggle}
                  className="w-4 h-4"
                />
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Featured Only</span>
              </label>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`block w-full text-left px-3 py-2 rounded text-sm ${
                    !initialCategory
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.slug)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm ${
                      initialCategory === category.slug
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-sm text-gray-400 mb-4">
                Try adjusting your filters or search terms
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters}>Clear Filters</Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      )}
                      {product.comparePrice &&
                        Number(product.comparePrice) > Number(product.price) && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Sale
                          </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {product.category && (
                        <p className="text-xs text-gray-500 mb-1">
                          {product.category.name}
                        </p>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        {product.comparePrice &&
                          Number(product.comparePrice) > Number(product.price) && (
                            <span className="text-sm text-gray-500 line-through">
                              ${Number(product.comparePrice).toFixed(2)}
                            </span>
                          )}
                      </div>
                      {product.stock === 0 && (
                        <p className="text-xs text-red-600 mt-2">Out of Stock</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
