import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateSEOMetadata(overrides?: Partial<Metadata>): Promise<Metadata> {
  // Default values
  const defaultStoreName = 'E-Commerce Platform';
  const defaultMetaTitle = `${defaultStoreName} - Shop Quality Products Online`;
  const defaultMetaDescription = 'Discover amazing products at great prices.';
  const defaultMetaKeywords = 'e-commerce, online shopping, shop online';
  const defaultOgImage = '/og-image.jpg';

  let storeName = defaultStoreName;
  let metaTitle = defaultMetaTitle;
  let metaDescription = defaultMetaDescription;
  let metaKeywords = defaultMetaKeywords;
  let ogTitle = defaultMetaTitle;
  let ogDescription = defaultMetaDescription;
  let ogImage = defaultOgImage;
  let twitterHandle: string | undefined;

  // Skip database call during build time when DATABASE_URL is not available
  if (process.env.DATABASE_URL) {
    try {
      // Fetch SEO settings from database
      const seoSettings = await prisma.storeSetting.findMany({
        where: {
          category: 'seo',
        },
      });

      const generalSettings = await prisma.storeSetting.findMany({
        where: {
          category: 'general',
        },
      });

      // Convert to key-value object
      const seo = seoSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      const general = generalSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      storeName = general.general_store_name || defaultStoreName;
      metaTitle = seo.seo_meta_title || `${storeName} - Shop Quality Products Online`;
      metaDescription = seo.seo_meta_description || defaultMetaDescription;
      metaKeywords = seo.seo_meta_keywords || defaultMetaKeywords;
      ogTitle = seo.seo_og_title || metaTitle;
      ogDescription = seo.seo_og_description || metaDescription;
      ogImage = seo.seo_og_image || defaultOgImage;
      twitterHandle = seo.seo_twitter_handle;
    } catch (error) {
      console.error('Error fetching SEO metadata:', error);
      // Use defaults on error
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const metadata: Metadata = {
    metadataBase: new URL(appUrl),
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords.split(',').map(k => k.trim()),
    authors: [{ name: storeName }],
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: appUrl,
      siteName: storeName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: storeName,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
      ...(twitterHandle && { creator: twitterHandle }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...overrides,
  };

  return metadata;
}
