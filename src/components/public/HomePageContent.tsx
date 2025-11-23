'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/public/ProductCard';
import { NewsletterForm } from '@/components/public/NewsletterForm';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Coffee, Package, Leaf, Award } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  stock: number;
  featured: boolean;
  images: Array<{ url: string }>;
  category: { name: string } | null;
}

interface HomePageContentProps {
  storeName: string;
  storeTagline: string;
  displayProducts: Product[];
  featuredProducts: Product[];
  recentPosts?: any[];
}

export function HomePageContent({
  storeName,
  storeTagline,
  displayProducts,
  featuredProducts,
  recentPosts
}: HomePageContentProps) {
  const t = useTranslations('home');

  const features = [
    {
      icon: Truck,
      title: t('features.shipping.title'),
      description: t('features.shipping.desc')
    },
    {
      icon: Leaf,
      title: t('features.organic.title'),
      description: t('features.organic.desc')
    },
    {
      icon: Coffee,
      title: t('features.roasting.title'),
      description: t('features.roasting.desc')
    },
    {
      icon: Award,
      title: t('features.quality.title'),
      description: t('features.quality.desc')
    }
  ];

  const categories = [
    {
      name: t('categories.beans.name'),
      slug: 'coffee-beans',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=500',
      count: t('categories.beans.count'),
      icon: '☕'
    },
    {
      name: t('categories.machines.name'),
      slug: 'machines',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=500',
      count: t('categories.machines.count'),
      icon: '🔧'
    },
    {
      name: t('categories.spices.name'),
      slug: 'spices',
      image: 'https://images.unsplash.com/photo-1596040033229-a0b3b6b2b6f1?auto=format&fit=crop&q=80&w=500',
      count: t('categories.spices.count'),
      icon: '🌶️'
    },
    {
      name: t('categories.packs.name'),
      slug: 'pack-degustation',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=500',
      count: t('categories.packs.count'),
      icon: '🎁'
    },
  ];

  const origins = [
    {
      name: t('origins.colombia.name'),
      flag: '🇨🇴',
      description: t('origins.colombia.desc'),
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: t('origins.ethiopia.name'),
      flag: '🇪🇹',
      description: t('origins.ethiopia.desc'),
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: t('origins.honduras.name'),
      flag: '🇭🇳',
      description: t('origins.honduras.desc'),
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400'
    },
  ];

  return (
    <main className="flex-1 bg-white">
      {/* Hero Section - Coffee Themed */}
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1920"
            alt="Coffee Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-transparent" />

        {/* Decorative Coffee Beans */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-amber-700/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-32 lg:py-40 relative z-10">
          <div className="max-w-3xl animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-3 mb-6">
              <Coffee className="w-8 h-8 text-amber-300" />
              <span className="inline-block py-1 px-4 rounded-full bg-amber-700/30 border border-amber-500/30 text-amber-100 text-sm font-semibold backdrop-blur-sm">
                {t('heroSubtitle')}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-amber-100 mb-10 leading-relaxed max-w-2xl">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto bg-white text-amber-900 hover:bg-amber-50 font-semibold px-8 h-14 text-lg rounded-full shadow-xl">
                  {t('shopNow')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-300/50 text-white hover:bg-amber-700/30 font-semibold px-8 h-14 text-lg rounded-full backdrop-blur-sm">
                  {t('ourStory')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-amber-50 border-b border-amber-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <div className="p-4 bg-amber-100 text-amber-800 rounded-full mb-4 group-hover:bg-amber-800 group-hover:text-white transition-colors">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-amber-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-amber-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee Origins Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">{t('origins.title')}</h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              {t('origins.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {origins.map((origin, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64">
                  <Image
                    src={origin.image}
                    alt={origin.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900 via-amber-900/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-4xl mb-2">{origin.flag}</div>
                  <h3 className="text-2xl font-bold mb-2">{origin.name}</h3>
                  <p className="text-amber-100">{origin.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">{t('categories.title')}</h2>
            <p className="text-lg text-amber-700">{t('categories.subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900 via-amber-900/60 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-amber-100">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-amber-900 mb-2">{t('featuredProducts')}</h2>
                <p className="text-lg text-amber-700">{t('featuredDesc')}</p>
              </div>
              <Link href="/shop?featured=true">
                <Button variant="outline" className="border-amber-800 text-amber-900 hover:bg-amber-50">
                  {t('viewAll')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      {displayProducts.length > 0 && (
        <section className="py-20 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-amber-900 mb-2">{t('latestProducts')}</h2>
                <p className="text-lg text-amber-700">{t('latestDesc')}</p>
              </div>
              <Link href="/shop">
                <Button variant="outline" className="border-amber-800 text-amber-900 hover:bg-amber-100">
                  {t('viewAll')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-amber-900 to-amber-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">{t('whyChooseUs.title')}</h2>
            <p className="text-xl text-amber-100 mb-12">
              {t('whyChooseUs.subtitle')}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-amber-800/30 rounded-2xl backdrop-blur-sm border border-amber-700/30">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold mb-2">{t('whyChooseUs.organic.title')}</h3>
                <p className="text-amber-100">{t('whyChooseUs.organic.desc')}</p>
              </div>
              <div className="p-6 bg-amber-800/30 rounded-2xl backdrop-blur-sm border border-amber-700/30">
                <div className="text-4xl mb-4">👨‍🍳</div>
                <h3 className="text-xl font-bold mb-2">{t('whyChooseUs.roasting.title')}</h3>
                <p className="text-amber-100">{t('whyChooseUs.roasting.desc')}</p>
              </div>
              <div className="p-6 bg-amber-800/30 rounded-2xl backdrop-blur-sm border border-amber-700/30">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2">{t('whyChooseUs.quality.title')}</h3>
                <p className="text-amber-100">{t('whyChooseUs.quality.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="py-20 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-amber-900 mb-2">From Our Blog</h2>
                <p className="text-lg text-amber-700">Latest news and stories</p>
              </div>
              <Link href="/blog">
                <Button variant="outline" className="border-amber-800 text-amber-900 hover:bg-amber-100">
                  Read More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {post.featuredImage ? (
                    <div className="relative aspect-video">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-amber-100 flex items-center justify-center">
                      <Coffee className="w-12 h-12 text-amber-300" />
                    </div>
                  )}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="space-y-2">
                      {post.category && (
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-amber-700 line-clamp-3 text-sm">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                    </p>
                    <div className="pt-4 mt-auto border-t border-amber-100 flex items-center justify-between text-xs text-amber-600">
                      <span>{post.author.name || 'Admin'}</span>
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Coffee className="w-16 h-16 text-amber-800 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-amber-900 mb-4">{t('newsletter.title')}</h2>
            <p className="text-lg text-amber-700 mb-8">
              {t('newsletter.subtitle')}
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
