'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import { PLACEHOLDER_PRODUCT_IMAGE, handleImageError } from '@/lib/image-utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  author: { name: string } | null;
  category: { name: string; slug: string } | null;
}

interface BlogGridConfig {
  selectionMode?: 'auto' | 'manual';
  postIds?: string[];
  category?: string;
  featured?: boolean;
  latest?: boolean;
  sortOrder?: 'newest' | 'oldest' | 'title';
  limit?: number;
  columns?: number;
  cardStyle?: 'default' | 'minimal' | 'detailed';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface BlogGridProps {
  config: BlogGridConfig;
}

export const BlogGrid: React.FC<BlogGridProps> = ({ config }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    selectionMode = 'auto',
    postIds = [],
    category = '',
    featured = false,
    latest = true,
    sortOrder = 'newest',
    limit = 6,
    columns = 3,
    cardStyle = 'default',
    showExcerpt = true,
    showAuthor = true,
    showDate = true,
    paddingTop = '60px',
    paddingBottom = '60px',
    backgroundColor = '#ffffff',
    maxWidth = '1280px',
  } = config;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = '/api/blog/posts?';
        const params = new URLSearchParams();

        if (selectionMode === 'manual' && postIds.length > 0) {
          params.append('ids', postIds.join(','));
        } else {
          params.append('status', 'PUBLISHED');
          if (category) params.append('category', category);
          if (latest) params.append('latest', 'true');
          params.append('sort', sortOrder);
          params.append('limit', limit.toString());
        }

        url += params.toString();
        const response = await fetch(url);
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectionMode, postIds, category, featured, latest, sortOrder, limit]);

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const colClass = gridCols[columns as keyof typeof gridCols] || gridCols[3];

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
        <div className={`grid ${colClass} gap-6`}>
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl aspect-[4/3]" />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <p className="text-center text-gray-500">No blog posts found.</p>
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
        <div className={`grid ${colClass} gap-6`}>
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
                {post.featuredImage && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.featuredImage || PLACEHOLDER_PRODUCT_IMAGE}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={handleImageError}
                      unoptimized={post.featuredImage?.startsWith('data:') || false}
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  {post.category && (
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {showExcerpt && post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto">
                    {showAuthor && post.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    {showDate && post.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

