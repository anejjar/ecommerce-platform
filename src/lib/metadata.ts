import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateSEOMetadata(overrides?: Partial<Metadata>): Promise<Metadata> {
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

  const storeName = general.general_store_name || 'E-Commerce Platform';
  const metaTitle = seo.seo_meta_title || `${storeName} - Shop Quality Products Online`;
  const metaDescription = seo.seo_meta_description || 'Discover amazing products at great prices.';
  const metaKeywords = seo.seo_meta_keywords || 'e-commerce, online shopping, shop online';
  const ogTitle = seo.seo_og_title || metaTitle;
  const ogDescription = seo.seo_og_description || metaDescription;
  const ogImage = seo.seo_og_image || '/og-image.jpg';
  const twitterHandle = seo.seo_twitter_handle;

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
