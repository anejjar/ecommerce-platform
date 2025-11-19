import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductsList } from '@/components/admin/ProductsList';

export default async function ProductsPage() {
  const productsData = await prisma.product.findMany({
    include: {
      category: true,
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Convert Decimal fields to strings for client components
  const products = productsData.map(product => ({
    ...product,
    price: product.price.toString(),
    comparePrice: product.comparePrice ? product.comparePrice.toString() : null,
  }));

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/import">
            <Button variant="outline">Import CSV</Button>
          </Link>
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products yet</p>
              <Link href="/admin/products/new">
                <Button>Create your first product</Button>
              </Link>
            </div>
          ) : (
            <ProductsList products={products} categories={categories} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
