'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { ProductCard } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MenuItems() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  const { data: products, error, isLoading } = useSWR(
    `/api/pos/products?${selectedCategory ? `categoryId=${selectedCategory}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`,
    fetcher
  );

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories([{ id: 'all', name: 'All Menu' }, ...(data || [])]);
      })
      .catch(console.error);
  }, []);

  const filteredProducts = products?.filter((product: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Menu Items {products && `(${products.length})`}
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                All Categories
              </DropdownMenuItem>
              {categories.slice(1).map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {categories.length > 0 && (
        <Tabs
          value={selectedCategory || 'all'}
          onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-6">
            {categories.slice(0, 6).map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id === 'all' ? 'all' : cat.id}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="border rounded-lg animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-muted-foreground">
          Error loading products
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

