'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, Package, FolderTree, Loader2 } from 'lucide-react';
import { locales } from '@/i18n';
import Link from 'next/link';

interface TranslationStats {
  locale: string;
  productCount: number;
  totalProducts: number;
  categoryCount: number;
  totalCategories: number;
}

export function TranslationStatusOverview() {
  const [stats, setStats] = useState<TranslationStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real implementation, you'd have an API endpoint for this
      // For now, we'll fetch products and categories and calculate stats
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);

      if (productsRes.ok && categoriesRes.ok) {
        const products = await productsRes.json();
        const categories = await categoriesRes.json();

        // Calculate stats for each non-default locale
        const translationStats: TranslationStats[] = [];

        for (const locale of locales) {
          if (locale === 'en') continue; // Skip default locale

          // Count products with translations for this locale
          const productsWithTranslation = products.filter((p: any) =>
            p.translations?.some((t: any) => t.locale === locale)
          ).length;

          // Count categories with translations for this locale
          const categoriesWithTranslation = categories.filter((c: any) =>
            c.translations?.some((t: any) => t.locale === locale)
          ).length;

          translationStats.push({
            locale,
            productCount: productsWithTranslation,
            totalProducts: products.length,
            categoryCount: categoriesWithTranslation,
            totalCategories: categories.length,
          });
        }

        setStats(translationStats);
      }
    } catch (error) {
      console.error('Failed to fetch translation stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletionPercentage = (count: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const getCompletionStatus = (percentage: number): 'low' | 'medium' | 'high' => {
    if (percentage >= 75) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Translation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Translation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No translation data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Translation Status
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Track translation progress across your catalog
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat) => {
          const productPercentage = getCompletionPercentage(
            stat.productCount,
            stat.totalProducts
          );
          const categoryPercentage = getCompletionPercentage(
            stat.categoryCount,
            stat.totalCategories
          );
          const overallPercentage = Math.round(
            (productPercentage + categoryPercentage) / 2
          );
          const status = getCompletionStatus(overallPercentage);

          return (
            <div key={stat.locale} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {stat.locale.toUpperCase()}
                  </h3>
                  <Badge
                    variant={
                      status === 'high'
                        ? 'default'
                        : status === 'medium'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {overallPercentage}% Complete
                  </Badge>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Products</span>
                  </div>
                  <span className="font-medium">
                    {stat.productCount} / {stat.totalProducts}
                  </span>
                </div>
                <Progress value={productPercentage} className="h-2" />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Categories</span>
                  </div>
                  <span className="font-medium">
                    {stat.categoryCount} / {stat.totalCategories}
                  </span>
                </div>
                <Progress value={categoryPercentage} className="h-2" />
              </div>

              {overallPercentage < 100 && (
                <div className="pt-2">
                  <Link
                    href={`/admin/products?untranslated=${stat.locale}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View untranslated items →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
