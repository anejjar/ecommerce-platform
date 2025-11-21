import { Suspense } from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ShopContent } from '@/components/public/ShopContent';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Shop - Browse All Products | E-Commerce Platform',
  description: 'Browse our wide selection of quality products. Shop electronics, clothing, books and more with great prices and free shipping on orders over $50.',
  openGraph: {
    title: 'Shop All Products - E-Commerce Platform',
    description: 'Browse our wide selection of quality products at great prices.',
    type: 'website',
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const featured = params.featured === 'true';
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';

  // Build where clause
  const where: any = {
    published: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category) {
    const categoryRecord = await prisma.category.findUnique({
      where: { slug: category },
    });
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

  // Fetch products
  const productsData = await prisma.product.findMany({
    where,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      category: true,
    },
    orderBy,
  });

  // Convert Decimal fields to strings for client components
  const products = productsData.map(product => ({
    ...product,
    price: product.price.toString(),
    comparePrice: product.comparePrice ? product.comparePrice.toString() : null,
  }));

  // Fetch categories for filter
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

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
