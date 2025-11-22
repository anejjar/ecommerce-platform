import { Metadata } from 'next';
import { locales, defaultLocale, Locale } from '@/i18n';

interface LocalizedMetadataParams {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
}

/**
 * Generate metadata with proper hreflang tags and locale-specific content
 */
export function generateLocalizedMetadata({
  locale,
  path,
  title,
  description,
  keywords = [],
  image,
}: LocalizedMetadataParams): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Build canonical URL
  const localizedPath = locale === defaultLocale ? path : `/${locale}${path}`;
  const canonicalUrl = `${baseUrl}${localizedPath}`;

  // Build alternates for all locales
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    const altPath = loc === defaultLocale ? path : `/${loc}${path}`;
    languages[loc] = `${baseUrl}${altPath}`;
  });

  // Add x-default for the default locale
  languages['x-default'] = `${baseUrl}${path}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Organicaf',
      images: image ? [{ url: image }] : [],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
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
  };
}

/**
 * Generate product metadata with schema.org structured data
 */
export function generateProductMetadata({
  locale,
  product,
}: {
  locale: Locale;
  product: {
    name: string;
    description: string;
    slug: string;
    price: number;
    image?: string;
    stock: number;
  };
}): Metadata {
  return generateLocalizedMetadata({
    locale,
    path: `/product/${product.slug}`,
    title: `${product.name} - Organicaf`,
    description: product.description,
    keywords: [product.name, 'organic', 'eco-friendly'],
    image: product.image,
  });
}
