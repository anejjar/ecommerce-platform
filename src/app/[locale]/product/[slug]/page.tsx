import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ProductDetail } from '@/components/public/ProductDetail';
import { getProductBySlug, getProducts } from '@/lib/translations';

import { getTranslations } from 'next-intl/server';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations('metadata.product');

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return {
      title: t('notFound'),
    };
  }

  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const discount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null;

  const description = product.description
    ? product.description.substring(0, 160)
    : t('description', { name: product.name }) + (discount ? ' ' + t('save', { discount }) : '');

  const imageUrl = product.images[0]?.url || '/placeholder-product.jpg';

  return {
    title: `${product.name} - E-Commerce Platform`,
    description,
    keywords: [product.name, product.category?.name || 'products', 'buy online', 'shop'],
    openGraph: {
      title: product.name,
      description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const productData = await getProductBySlug(slug, locale);

  if (!productData || !productData.published) {
    notFound();
  }

  // Convert Decimal fields to strings
  const product = {
    ...productData,
    price: productData.price.toString(),
    comparePrice: productData.comparePrice ? productData.comparePrice.toString() : null,
    variants: productData.variants.map((v) => ({
      ...v,
      price: v.price ? v.price.toString() : null,
      comparePrice: v.comparePrice ? v.comparePrice.toString() : null,
    })),
  };

  // Fetch related products from same category
  const relatedProductsData = await getProducts(
    {
      where: {
        published: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
    },
    locale
  );

  // Convert Decimal fields for related products
  const relatedProducts = relatedProductsData.map(p => ({
    ...p,
    price: p.price.toString(),
    comparePrice: p.comparePrice ? p.comparePrice.toString() : null,
    variantOptions: [],
    variants: [],
  }));

  // Generate JSON-LD structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const localizedPath = locale === 'en' ? '' : `/${locale}`;
  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Shop ${product.name} online`,
    image: product.images.map(img => img.url),
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'E-Commerce Platform',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}${localizedPath}/product/${product.slug}`,
      priceCurrency: 'USD',
      price: price,
      priceValidUntil: comparePrice && comparePrice > price
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Sale price valid 7 days
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Regular price valid 30 days
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.category && {
      category: product.category.name,
    }),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <ProductDetail product={product} relatedProducts={relatedProducts} />
        </main>
        <Footer />
      </div>
    </>
  );
}
