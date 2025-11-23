import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { OrdersList } from '@/components/admin/OrdersList';

export default async function OrdersPage() {
  const ordersData = await prisma.order.findMany({
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
  });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>
        <Link href="/admin/orders/new">
          <Button>Create Order</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link href="/admin/orders/new">
            <Button>Create your first order</Button>
          </Link>
        </div>
      ) : (
        <OrdersList orders={orders} />
      )}
    </div>
  );
}
