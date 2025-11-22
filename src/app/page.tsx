import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { HomePageContent } from '@/components/public/HomePageContent';
import { prisma } from '@/lib/prisma';
import { generateSEOMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  return await generateSEOMetadata();
}

export default async function HomePage() {
  // Fetch store settings for hero section
  const storeSettings = await prisma.storeSetting.findMany({
    where: {
      key: {
        in: ['general_store_name', 'general_store_tagline'],
      },
    },
  });

  const settings = storeSettings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  const storeName = settings.general_store_name || 'YourStore';
  const storeTagline = settings.general_store_tagline || "Discover amazing products at unbeatable prices. Shop the latest trends and find exactly what you're looking for.";

  // Fetch featured products
  const featuredProductsData = await prisma.product.findMany({
    where: {
      published: true,
      featured: true,
    },
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      category: true,
    },
    take: 8,
  });

  // Fetch latest products if no featured
  const latestProductsData = await prisma.product.findMany({
    where: {
      published: true,
    },
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 8,
  });

  // Convert Decimal fields to strings
  const featuredProducts = featuredProductsData.map(product => ({
    ...product,
    price: product.price.toString(),
    comparePrice: product.comparePrice ? product.comparePrice.toString() : null,
  }));

  const latestProducts = latestProductsData.map(product => ({
    ...product,
    price: product.price.toString(),
    comparePrice: product.comparePrice ? product.comparePrice.toString() : null,
  }));

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : latestProducts;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <HomePageContent
        storeName={storeName}
        storeTagline={storeTagline}
        displayProducts={displayProducts}
        featuredProducts={featuredProducts}
      />

      <Footer />
    </div>
  );
}
