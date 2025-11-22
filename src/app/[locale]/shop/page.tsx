import { Suspense } from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ShopContent } from '@/components/public/ShopContent';
import { getProducts, getCategories, getCategoryBySlug } from '@/lib/translations';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('metadata.shop');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
    },
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const urlParams = await searchParams;
  
  const search = typeof urlParams.search === 'string' ? urlParams.search : '';
  const category = typeof urlParams.category === 'string' ? urlParams.category : '';
  const featured = urlParams.featured === 'true';
  const sort = typeof urlParams.sort === 'string' ? urlParams.sort : 'newest';

  // Build where clause
  const where: any = {
    published: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      {
        translations: {
          some: {
            locale,
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          },
        },
      },
    ];
  }

  if (category) {
    const categoryRecord = await getCategoryBySlug(category, locale);
    if (categoryRecord) {
      where.categoryId = categoryRecord.id;
    }
  }

  if (featured) {
    where.featured = true;
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }; // default
  if (sort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else if (sort === 'name') {
    orderBy = { name: 'asc' };
  }

  // Fetch products with translations
  const productsData = await getProducts({ where, orderBy }, locale);

  // Convert Decimal fields to strings for client components
  const products = productsData.map(product => ({
    ...product,
    price: product.price.toString(),
    comparePrice: product.comparePrice ? product.comparePrice.toString() : null,
  }));

  // Fetch categories with translations
  const categories = await getCategories(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Suspense fallback={<div>Loading...</div>}>
          <ShopContent
            products={products}
            categories={categories}
            initialSearch={search}
            initialCategory={category}
            initialFeatured={featured}
            initialSort={sort}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
