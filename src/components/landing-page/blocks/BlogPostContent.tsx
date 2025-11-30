'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, User, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featuredImage: string | null;
  publishedAt: string | null;
  author: { name: string } | null;
  category: { name: string; slug: string } | null;
  tags: Array<{ name: string; slug: string }>;
}

interface BlogPostContentConfig {
  postId: string;
  showTitle?: boolean;
  showFeaturedImage?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
}

interface BlogPostContentProps {
  config: BlogPostContentConfig;
}

export const BlogPostContent: React.FC<BlogPostContentProps> = ({ config }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    postId,
    showTitle = true,
    showFeaturedImage = true,
    showAuthor = true,
    showDate = true,
    showCategory = true,
    showTags = true,
    contentWidth = 'medium',
    paddingTop = '60px',
    paddingBottom = '60px',
    backgroundColor = '#ffffff',
  } = config;

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog/posts?ids=${postId}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPost(data[0]);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const widthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full',
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
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <p className="text-center text-gray-500">Blog post not found.</p>
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
      <div className={`container mx-auto px-4 ${widthClasses[contentWidth]}`}>
        {showTitle && (
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
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
          {showCategory && post.category && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {post.category.name}
            </span>
          )}
        </div>

        {showFeaturedImage && post.featuredImage && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}

        {showTags && post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {post.tags.map((tag) => (
              <span
                key={tag.slug}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

