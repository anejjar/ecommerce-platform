'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';

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

interface BlogPostCardConfig {
  postId: string;
  showImage?: boolean;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  cardStyle?: 'default' | 'minimal' | 'detailed';
  linkBehavior?: 'link' | 'no-link';
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
  alignment?: 'left' | 'center' | 'right';
}

interface BlogPostCardProps {
  config: BlogPostCardConfig;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ config }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    postId,
    showImage = true,
    showExcerpt = true,
    showAuthor = true,
    showDate = true,
    showCategory = true,
    cardStyle = 'default',
    linkBehavior = 'link',
    paddingTop = '40px',
    paddingBottom = '40px',
    backgroundColor = '#ffffff',
    maxWidth = '600px',
    alignment = 'center',
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

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
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
        <div className={`flex ${alignmentClasses[alignment]}`}>
          <div className="animate-pulse bg-gray-200 rounded-xl w-full" style={{ maxWidth, aspectRatio: '4/3' }} />
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

  const cardContent = (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col" style={{ maxWidth, width: '100%' }}>
      {showImage && post.featuredImage && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        {showCategory && post.category && (
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
            {post.category.name}
          </span>
        )}
        <h3 className="text-xl font-bold mb-3">{post.title}</h3>
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
  );

  return (
    <div
      style={{
        paddingTop,
        paddingBottom,
        backgroundColor,
      }}
      className="w-full"
    >
      <div className="container mx-auto px-4">
        <div className={`flex ${alignmentClasses[alignment]}`}>
          {linkBehavior === 'link' ? (
            <Link href={`/blog/${post.slug}`} className="group">
              {cardContent}
            </Link>
          ) : (
            cardContent
          )}
        </div>
      </div>
    </div>
  );
};

