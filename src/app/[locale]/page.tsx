import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { HomePageContent } from '@/components/public/HomePageContent';
import { PageOverrideRenderer } from '@/components/public/PageOverrideRenderer';
import { prisma } from '@/lib/prisma';
import { generateSEOMetadata } from '@/lib/metadata';
import { getProducts } from '@/lib/translations';
import { getPageOverride } from '@/lib/page-overrides';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return await generateSEOMetadata();
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Check for page override
  const overridePage = await getPageOverride('HOME');
  if (overridePage) {
    return <PageOverrideRenderer page={overridePage} />;
  }

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

  // Fetch featured products with translations
  const featuredProductsData = await getProducts(
    {
      where: {
        published: true,
        featured: true,
      },
      take: 8,
    },
    locale
  );

  // Fetch latest products if no featured
  const latestProductsData = await getProducts(
    {
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    },
    locale
  );

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

  // Fetch recent blog posts
  const recentPosts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: {
      author: { select: { name: true } },
      category: true,
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <HomePageContent
        storeName={storeName}
        storeTagline={storeTagline}
        displayProducts={displayProducts}
        featuredProducts={featuredProducts}
        recentPosts={recentPosts}
      />

      <Footer />
    </div>
  );
}
