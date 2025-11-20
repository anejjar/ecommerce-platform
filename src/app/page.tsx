import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import { Star } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Commerce Platform - Shop Quality Products Online',
  description: 'Discover amazing products at great prices. Shop electronics, clothing, books and more with free shipping on orders over $50.',
  keywords: ['e-commerce', 'online shopping', 'electronics', 'clothing', 'books', 'shop online'],
  authors: [{ name: 'E-Commerce Platform' }],
  openGraph: {
    title: 'E-Commerce Platform - Shop Quality Products Online',
    description: 'Discover amazing products at great prices. Shop electronics, clothing, books and more.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'E-Commerce Platform',
    images: [
      {
        url: '/og-image.jpg', // You can add this later
        width: 1200,
        height: 630,
        alt: 'E-Commerce Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Commerce Platform - Shop Quality Products Online',
    description: 'Discover amazing products at great prices. Shop electronics, clothing, books and more.',
    images: ['/og-image.jpg'],
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

export default async function HomePage() {
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-6">
                Welcome to YourStore
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover amazing products at unbeatable prices. Shop the latest trends and find exactly what you're looking for.
              </p>
              <div className="flex gap-4">
                <Link href="/shop">
                  <Button size="lg" variant="secondary">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/shop?featured=true">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    Featured Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link href="/shop?category=electronics" className="group">
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="font-semibold">Electronics</h3>
                </div>
              </Link>
              <Link href="/shop?category=clothing" className="group">
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-2xl">👕</span>
                  </div>
                  <h3 className="font-semibold">Clothing</h3>
                </div>
              </Link>
              <Link href="/shop?category=home" className="group">
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="font-semibold">Home & Garden</h3>
                </div>
              </Link>
              <Link href="/shop?category=sports" className="group">
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <span className="text-2xl">⚽</span>
                  </div>
                  <h3 className="font-semibold">Sports</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">
                {featuredProducts.length > 0 ? 'Featured Products' : 'Latest Products'}
              </h2>
              <Link href="/shop">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            {displayProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products available yet.</p>
                <p className="text-sm text-gray-400 mt-2">Check back soon for amazing deals!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">📦</span>
                          </div>
                        )}
                        {product.featured && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </div>
                        )}
                        {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Sale
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {product.category && (
                          <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                        )}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                            <span className="text-sm text-gray-500 line-through">
                              ${Number(product.comparePrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.stock === 0 && (
                          <p className="text-xs text-red-600 mt-2">Out of Stock</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover why we're the best choice for your online shopping needs.
            </p>
            <Link href="/shop">
              <Button size="lg" variant="secondary">
                Browse All Products
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
