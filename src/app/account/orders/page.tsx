import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default async function OrderHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/account/orders');
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Order History</h1>
            <Link href="/account">
              <Button variant="outline">← Back to Account</Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No orders yet</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b">
                    <div>
                      <h2 className="font-bold text-lg">
                        Order #{order.orderNumber}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment</p>
                        <Badge
                          className={
                            order.paymentStatus === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-500">Variant: {item.variant.optionValues}</p>
                          )}
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold">
                          ${Number(item.total).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold">
                        ${Number(order.total).toFixed(2)}
                      </p>
                    </div>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
