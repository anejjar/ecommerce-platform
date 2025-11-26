import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { locales, defaultLocale } from '@/i18n';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const products = await prisma.product.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

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
