import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Link } from '@/navigation';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefundRequestButton } from '@/components/customer/RefundRequestButton';
import { DownloadInvoiceButton } from '@/components/customer/DownloadInvoiceButton';
import { isFeatureEnabled } from '@/lib/features';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { formatCurrencyServer, getCurrencySymbol } from '@/lib/server-currency';
import { formatCurrencyWithSymbol } from '@/lib/formatting';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('metadata.account.orderDetails');
  const order = await prisma.order.findUnique({
    where: { id },
    select: { orderNumber: true },
  });

  if (!order) {
    return {
      title: 'Order Not Found',
    };
  }

  return {
    title: t('title', { orderNumber: order.orderNumber }),
    description: t('description', { orderNumber: order.orderNumber }),
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const t = await getTranslations();

  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      shippingAddress: true,
      orderNotes: {
        where: {
          isInternal: false, // Only fetch public notes for customers
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      refunds: {
        where: {
          status: { in: ['PENDING', 'APPROVED', 'COMPLETED'] },
        },
      },
    },
  });

  // Check if user owns this order (handle guest orders)
  if (!order) {
    notFound();
  }

  // For guest orders, redirect to sign in (they can't access /account anyway)
  // For user orders, ensure they own the order
  // Check if refund feature is enabled
  const refundFeatureEnabled = await isFeatureEnabled('refund_management');

  if (order.userId !== session.user.id) {
    notFound();
  }
  // Convert Decimal fields to numbers for client components
  const orderItemsForRefund = order.items.map(item => ({
    ...item,
    price: Number(item.price),
    total: Number(item.total),
  }));

  // Get currency symbol for formatting
  const currencySymbol = await getCurrencySymbol();
  
  // Format order totals
  const formattedSubtotal = formatCurrencyWithSymbol(Number(order.subtotal), currencySymbol);
  const formattedTax = formatCurrencyWithSymbol(Number(order.tax), currencySymbol);
  const formattedShipping = formatCurrencyWithSymbol(Number(order.shipping), currencySymbol);
  const formattedTotal = formatCurrencyWithSymbol(Number(order.total), currencySymbol);
  
  // Format item prices
  const formattedItems = await Promise.all(
    order.items.map(async (item) => ({
      ...item,
      formattedPrice: await formatCurrencyServer(Number(item.price)),
      formattedTotal: await formatCurrencyServer(Number(item.total)),
    }))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{t('account.orderNumber')} #{order.orderNumber}</h1>
              <p className="text-gray-600 mt-1">
                {t('account.orderDate')} {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <DownloadInvoiceButton order={order} />
              {refundFeatureEnabled && (
                <RefundRequestButton
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  orderItems={orderItemsForRefund}
                  paymentStatus={order.paymentStatus}
                  existingRefund={order.refunds?.[0]}
                />
              )}
              <Link href="/account/orders">
                <Button variant="outline">← {t('account.backToOrders')}</Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>{t('account.status')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('account.status')}</p>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                  {/* Payment Status - HIDDEN per user request */}
                  {/* <div>
                    <p className="text-sm text-gray-600 mb-1">{t('account.paymentStatus')}</p>
                    <Badge
                      className={
                        order.paymentStatus === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.shippingAddress')}</CardTitle>
              </CardHeader>
              <CardContent>
                {order.shippingAddress ? (
                  <div className="text-sm">
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && (
                      <p>{order.shippingAddress.address2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">{t('account.noAddress')}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('account.items')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formattedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-500">{t('cart.variant')} {item.variant.optionValues}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {item.formattedPrice} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">
                      {item.formattedTotal}
                    </p>
                  </div>
                ))}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('cart.subtotal')}</span>
                    <span className="font-medium">
                      {formattedSubtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('cart.tax')}</span>
                    <span className="font-medium">
                      {formattedTax}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('cart.shipping')}</span>
                    <span className="font-medium">
                      {formattedShipping}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>{t('cart.total')}</span>
                    <span>{formattedTotal}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.orderNotes && order.orderNotes.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('account.orderNotes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">
                          {note.user.name || note.user.email || t('account.supportTeam')}
                        </span>
                        <span className="text-xs text-blue-700">
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-blue-900 whitespace-pre-wrap">
                        {note.note}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('account.needHelp')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('account.contactSupportDesc')}
              </p>
              <Link href="/contact">
                <Button variant="outline">{t('account.contactSupport')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
