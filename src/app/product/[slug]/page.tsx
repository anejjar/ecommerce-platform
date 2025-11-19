import { notFound } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ProductDetail } from '@/components/public/ProductDetail';
import { prisma } from '@/lib/prisma';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const productData = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { position: 'asc' },
      },
      category: true,
    },
  });

  if (!productData || !productData.published) {
    notFound();
  }

  // Convert Decimal fields to strings
  const product = {
    ...productData,
    price: productData.price.toString(),
    comparePrice: productData.comparePrice ? productData.comparePrice.toString() : null,
  };

  // Fetch related products from same category
  const relatedProductsData = await prisma.product.findMany({
    where: {
      published: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      category: true,
    },
    take: 4,
  });

  // Convert Decimal fields for related products
  const relatedProducts = relatedProductsData.map(p => ({
    ...p,
    price: p.price.toString(),
    comparePrice: p.comparePrice ? p.comparePrice.toString() : null,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}
