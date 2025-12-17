import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { ProductsList } from '@/components/admin/ProductsList';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { requirePermission, checkPermission } from '@/lib/permission-guard';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Require VIEW permission for PRODUCT resource
  await requirePermission('PRODUCT', 'VIEW');

  // Check if user can create products (for conditional rendering)
  const { hasAccess: canCreate } = await checkPermission('PRODUCT', 'CREATE');

  const params = await searchParams;
  const pageParam = parseInt(params.page || '1', 10);
  const page = pageParam > 0 ? pageParam : 1;
  const limit = 20; // Products per page
  const skip = (page - 1) * limit;

  // Get total count and products with pagination
  const [productsData, total] = await Promise.all([
    prisma.product.findMany({
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
      skip,
      take: limit,
    }),
    prisma.product.count(),
  ]);

  // Convert Decimal fields to strings for client components
  const products = productsData.map(product => ({
    ...product,
    price: product.price.toString(),
    comparePrice: product.comparePrice ? product.comparePrice.toString() : null,
  }));

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">
            Showing {products.length > 0 ? skip + 1 : 0} to {Math.min(skip + limit, total)} of {total} products
          </p>
        </div>
        <div className="flex gap-2">
          {canCreate && (
            <>
              <Link href="/admin/products/import">
                <Button variant="outline">Import CSV</Button>
              </Link>
              <Link href="/admin/products/new">
                <Button>Add Product</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">No products yet</p>
          {canCreate && (
            <Link href="/admin/products/new">
              <Button>Create your first product</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <ProductsList products={products} categories={categories} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Link href={`/admin/products?page=${page - 1}`}>
                <Button
                  variant="outline"
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              </Link>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Link href={`/admin/products?page=${page + 1}`}>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
