'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductReviews } from './ProductReviews';
import { Package, FileText, Star } from 'lucide-react';

interface ProductTabsProps {
  description: string | null;
  specifications?: Record<string, string>;
  productId: string;
}

export function ProductTabs({
  description,
  specifications = {},
  productId,
}: ProductTabsProps) {
  const hasSpecs = Object.keys(specifications).length > 0;

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-amber-50">
        <TabsTrigger 
          value="description" 
          className="data-[state=active]:bg-white data-[state=active]:text-amber-900"
        >
          <FileText className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Description</span>
          <span className="sm:hidden">Info</span>
        </TabsTrigger>
        {hasSpecs && (
          <TabsTrigger 
            value="specifications"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-900"
          >
            <Package className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Specifications</span>
            <span className="sm:hidden">Specs</span>
          </TabsTrigger>
        )}
        <TabsTrigger 
          value="reviews"
          className="data-[state=active]:bg-white data-[state=active]:text-amber-900"
        >
          <Star className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Reviews</span>
          <span className="sm:hidden">Reviews</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose prose-amber max-w-none">
          {description ? (
            <div 
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className="text-gray-500 italic">No description available.</p>
          )}
        </div>
      </TabsContent>

      {hasSpecs && (
        <TabsContent value="specifications" className="mt-6">
          <div className="bg-amber-50 rounded-lg p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="border-b border-amber-200 pb-3 last:border-0">
                  <dt className="text-sm font-semibold text-amber-900 uppercase tracking-wide mb-1">
                    {key}
                  </dt>
                  <dd className="text-gray-700">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </TabsContent>
      )}

      <TabsContent value="reviews" className="mt-6">
        <ProductReviews productId={productId} />
      </TabsContent>
    </Tabs>
  );
}

