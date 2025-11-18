'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface ProductsFilterProps {
  categories: Category[];
  onFilterChange: (filters: {
    search: string;
    categoryId: string;
    status: string;
    featured: string;
  }) => void;
}

export function ProductsFilter({ categories, onFilterChange }: ProductsFilterProps) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [featured, setFeatured] = useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, categoryId, status, featured });
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    onFilterChange({ search, categoryId: value, status, featured });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, categoryId, status: value, featured });
  };

  const handleFeaturedChange = (value: string) => {
    setFeatured(value);
    onFilterChange({ search, categoryId, status, featured: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured">Featured</Label>
        <select
          id="featured"
          value={featured}
          onChange={(e) => handleFeaturedChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All Products</option>
          <option value="true">Featured Only</option>
          <option value="false">Non-Featured</option>
        </select>
      </div>
    </div>
  );
}
