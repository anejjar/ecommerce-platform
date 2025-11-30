'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/navigation';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

interface BlogCategoriesConfig {
  showCategoryCount?: boolean;
  layout?: 'list' | 'grid';
  showActiveIndicator?: boolean;
  categoryStyle?: 'default' | 'pills' | 'buttons';
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface BlogCategoriesProps {
  config: BlogCategoriesConfig;
}

export const BlogCategories: React.FC<BlogCategoriesProps> = ({ config }) => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    showCategoryCount = true,
    layout = 'list',
    showActiveIndicator = true,
    categoryStyle = 'default',
    paddingTop = '40px',
    paddingBottom = '40px',
    backgroundColor = '#ffffff',
    maxWidth = '800px',
  } = config;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/blog/categories');
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching blog categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const styleClasses = {
    default: 'text-blue-600 hover:text-blue-800 hover:underline',
    pills: 'px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 hover:text-gray-900',
    buttons: 'px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900',
  };

  if (loading) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-1/5" />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <p className="text-center text-gray-500">No categories available.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop,
        paddingBottom,
        backgroundColor,
      }}
      className="w-full"
    >
      <div className="container mx-auto px-4" style={{ maxWidth }}>
        <div className={layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-2'}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.slug}`}
              className={`block transition-colors ${styleClasses[categoryStyle]}`}
            >
              <div className="flex items-center justify-between">
                <span>{category.name}</span>
                {showCategoryCount && category._count && (
                  <span className="text-sm text-gray-500 ml-2">({category._count.posts})</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

