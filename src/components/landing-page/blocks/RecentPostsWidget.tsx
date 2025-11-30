'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
}

interface RecentPostsWidgetConfig {
  numberOfPosts?: number;
  showImages?: boolean;
  showExcerpt?: boolean;
  showDate?: boolean;
  widgetStyle?: 'default' | 'minimal' | 'detailed';
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface RecentPostsWidgetProps {
  config: RecentPostsWidgetConfig;
}

export const RecentPostsWidget: React.FC<RecentPostsWidgetProps> = ({ config }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    numberOfPosts = 5,
    showImages = true,
    showExcerpt = true,
    showDate = true,
    widgetStyle = 'default',
    paddingTop = '40px',
    paddingBottom = '40px',
    backgroundColor = '#ffffff',
    maxWidth = '400px',
  } = config;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog/posts?status=PUBLISHED&latest=true&sort=newest&limit=${numberOfPosts}`);
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [numberOfPosts]);

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
        <div className="animate-pulse space-y-4">
          {[...Array(numberOfPosts)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
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
        <p className="text-center text-gray-500">No recent posts.</p>
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
        <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block group hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex gap-4">
                {showImages && post.featuredImage && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="80px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  {showExcerpt && post.excerpt && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-1">{post.excerpt}</p>
                  )}
                  {showDate && post.publishedAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

