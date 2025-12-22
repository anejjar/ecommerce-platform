import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { locales, defaultLocale } from '@/i18n';
import { PostStatus } from '@prisma/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let products: Array<{ slug: string; updatedAt: Date }> = [];
  let categories: Array<{ slug: string; updatedAt: Date }> = [];
  let blogPosts: Array<{ slug: string; updatedAt: Date }> = [];

  // Skip database call during build time when DATABASE_URL is not available
  if (process.env.DATABASE_URL) {
    try {
      products = await prisma.product.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      });

      categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      });

      blogPosts = await prisma.blogPost.findMany({
        where: { status: PostStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      });
    } catch (error) {
      console.error('Error fetching sitemap data:', error);
      // Return static pages only on error
    }
  }

  const generateLocalizedUrls = (
    path: string,
    lastModified: Date,
    changeFrequency: 'daily' | 'weekly' | 'monthly',
    priority: number
  ) => {
    return locales.map((locale) => {
      const localizedPath = locale === defaultLocale ? path : `/${locale}${path}`;

      const alternates: Record<string, string> = {};
      locales.forEach((loc) => {
        const altPath = loc === defaultLocale ? path : `/${loc}${path}`;
        alternates[loc] = `${baseUrl}${altPath}`;
      });

      return {
        url: `${baseUrl}${localizedPath}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: alternates,
        },
      };
    });
  };

  const staticPages = [
    ...generateLocalizedUrls('/', new Date(), 'daily', 1),
    ...generateLocalizedUrls('/shop', new Date(), 'daily', 0.9),
    ...generateLocalizedUrls('/cart', new Date(), 'weekly', 0.6),
    ...generateLocalizedUrls('/account', new Date(), 'weekly', 0.5),
    ...generateLocalizedUrls('/blog', new Date(), 'daily', 0.8),
  ];

  const productPages = products.flatMap((product) =>
    generateLocalizedUrls(`/product/${product.slug}`, product.updatedAt, 'weekly', 0.8)
  );

  const categoryPages = categories.flatMap((category) =>
    generateLocalizedUrls(`/shop?category=${category.slug}`, category.updatedAt, 'weekly', 0.7)
  );

  const blogPages = blogPosts.flatMap((post) =>
    generateLocalizedUrls(`/blog/${post.slug}`, post.updatedAt, 'weekly', 0.7)
  );

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}
