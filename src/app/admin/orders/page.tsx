import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { OrdersList } from '@/components/admin/OrdersList';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
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

      <OrdersList orders={orders} />
    </div>
  );
}
