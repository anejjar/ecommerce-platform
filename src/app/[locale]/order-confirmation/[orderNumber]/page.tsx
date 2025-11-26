import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const [order, checkoutSettings] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    }),
    prisma.checkoutSettings.findFirst(),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                {checkoutSettings?.thankYouMessage ||
                  'Thank you for your purchase. Your order has been received and is being processed.'}
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order Number</p>
                    <p className="font-bold">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-bold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Total</p>
                    <p className="font-bold">${Number(order.total).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <p className="font-bold">{order.paymentStatus}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to your email address.
                </p>
                <p className="text-sm text-gray-600">
                  You can track your order status in your account dashboard.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <Link href="/account/orders">
                  <Button size="lg">View Order Details</Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
