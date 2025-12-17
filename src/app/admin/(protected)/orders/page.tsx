import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { OrdersList } from '@/components/admin/OrdersList';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { requirePermission, checkPermission } from '@/lib/permission-guard';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Require VIEW permission for ORDER resource
  await requirePermission('ORDER', 'VIEW');

  // Check if user can create orders
  const { hasAccess: canCreate } = await checkPermission('ORDER', 'CREATE');

  const params = await searchParams;
  const pageParam = parseInt(params.page || '1', 10);
  const page = pageParam > 0 ? pageParam : 1;
  const limit = 20; // Orders per page
  const skip = (page - 1) * limit;

  // Get total count and orders with pagination
  const [ordersData, total] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: true,
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.order.count(),
  ]);

  // Convert Decimal fields to strings for client components
  const orders = ordersData.map(order => ({
    ...order,
    total: order.total.toString(),
    subtotal: order.subtotal.toString(),
    tax: order.tax.toString(),
    shipping: order.shipping.toString(),
    discountAmount: order.discountAmount.toString(),
    user: order.user || { name: 'Guest', email: order.guestEmail || 'N/A' },
    items: order.items.map(item => ({
      ...item,
      price: item.price.toString(),
      total: item.total.toString(),
    })),
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-2">
            Showing {orders.length > 0 ? skip + 1 : 0} to {Math.min(skip + limit, total)} of {total} orders
          </p>
        </div>
        {canCreate && (
          <Link href="/admin/orders/new">
            <Button>Create Order</Button>
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">No orders yet</p>
          {canCreate && (
            <Link href="/admin/orders/new">
              <Button>Create your first order</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <OrdersList orders={orders} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Link href={`/admin/orders?page=${page - 1}`}>
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
              <Link href={`/admin/orders?page=${page + 1}`}>
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
