'use client';

import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/public/ProductCard';
import { NewsletterForm } from '@/components/public/NewsletterForm';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Package, Award } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

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
  const { theme } = useTheme();
  const primaryColor = theme?.colors?.primary ?? '#111827';

  const features = [
    {
      icon: Truck,
      title: t('features.shipping.title'),
      description: t('features.shipping.desc')
    },
    {
      icon: ShieldCheck,
      title: t('features.quality.title'),
      description: t('features.quality.desc')
    },
    {
      icon: RefreshCw,
      title: t('features.returns.title'),
      description: t('features.returns.desc')
    },
    {
      icon: Award,
      title: t('features.award.title'),
      description: t('features.award.desc')
    }
  ];

  return (
    <main className="flex-1 bg-background">
      {/* Hero Section - Generic Luxury */}
      <section className="relative bg-background text-foreground overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
          <div className="max-w-3xl animate-subtle-lift">
            {storeTagline && (
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block py-1.5 px-4 rounded-full bg-muted text-foreground text-sm font-medium border border-border">
                  {storeTagline}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 leading-tight tracking-tight">
              {t('heroTitle') || `Welcome to ${storeName}`}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
              {t('heroDescription') || 'Discover our curated collection of premium products, crafted with attention to detail and quality.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-medium" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>
                  {t('shopNow') || 'Shop Now'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-medium">
                  {t('ourStory') || 'Our Story'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-muted/50 transition-colors duration-300 group">
                <div className="p-4 bg-muted rounded-lg mb-4 group-hover:bg-foreground/5 transition-colors">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: primaryColor }} />
                </div>
                <h3 className="font-medium text-sm md:text-base mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-medium mb-3">{t('featuredProducts') || 'Featured Products'}</h2>
                <p className="text-muted-foreground">{t('featuredDesc') || 'Handpicked selections for you'}</p>
              </div>
              <Link href="/shop?featured=true">
                <Button variant="outline" className="gap-2">
                  {t('viewAll') || 'View All'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-subtle-lift"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      {displayProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-medium mb-3">{t('latestProducts') || 'Latest Products'}</h2>
                <p className="text-muted-foreground">{t('latestDesc') || 'New arrivals you don\'t want to miss'}</p>
              </div>
              <Link href="/shop">
                <Button variant="outline" className="gap-2">
                  {t('viewAll') || 'View All'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.slice(0, 8).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-subtle-lift"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-medium mb-3">{t('blog.title')}</h2>
                <p className="text-muted-foreground">{t('blog.subtitle')}</p>
              </div>
              <Link href="/blog">
                <Button variant="outline" className="gap-2">
                  {t('blog.readMore')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {post.featuredImage ? (
                    <div className="relative aspect-video">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/20 rounded" />
                    </div>
                  )}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="space-y-2">
                      {post.category && (
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="text-xl font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                    </p>
                    <div className="pt-4 mt-auto border-t border-border flex items-center justify-between text-xs text-muted-foreground">
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
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: theme?.layout?.containerMaxWidth || '1280px' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">{t('newsletter.title') || 'Stay Updated'}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('newsletter.subtitle') || 'Subscribe to our newsletter for exclusive offers and updates'}
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
