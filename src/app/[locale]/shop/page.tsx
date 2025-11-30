import { Suspense } from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ShopContent } from '@/components/public/ShopContent';
import { PageOverrideRenderer } from '@/components/public/PageOverrideRenderer';
import { getProducts, getCategories, getCategoryBySlug, countProducts } from '@/lib/translations';
import { getPageOverride } from '@/lib/page-overrides';

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

  // Check for page override
  const overridePage = await getPageOverride('SHOP');
  if (overridePage) {
    return <PageOverrideRenderer page={overridePage} />;
  }
  const urlParams = await searchParams;
  
  const search = typeof urlParams.search === 'string' ? urlParams.search : '';
  const category = typeof urlParams.category === 'string' ? urlParams.category : '';
  const featured = urlParams.featured === 'true';
  const sort = typeof urlParams.sort === 'string' ? urlParams.sort : 'newest';
  const pageParam = parseInt(typeof urlParams.page === 'string' ? urlParams.page : '1', 10);
  const requestedPage = pageParam > 0 ? pageParam : 1; // Ensure page is at least 1
  const limit = 24; // Products per page

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

  // Get total count first to validate page number
  const total = await countProducts(where);
  const totalPages = Math.ceil(total / limit);
  const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;
  const skip = (page - 1) * limit;

  // Fetch products with translations and pagination
  const productsData = await getProducts({ where, orderBy, take: limit, skip }, locale);

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
            pagination={{
              page,
              totalPages,
              total,
              limit,
            }}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
