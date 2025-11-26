import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Fetch orders with items
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'Order Number',
        'Date',
        'Status',
        'Payment Status',
        'Items',
        'Subtotal',
        'Tax',
        'Shipping',
        'Total',
        'Tracking Number',
        'Carrier',
      ];

      const csvRows = orders.map((order) => {
        const itemsList = order.items
          .map((item) => `${item.product.name} x${item.quantity}`)
          .join('; ');

        return [
          order.orderNumber,
          new Date(order.createdAt).toLocaleDateString(),
          order.status,
          order.paymentStatus,
          `"${itemsList}"`,
          order.subtotal.toString(),
          order.tax.toString(),
          order.shipping.toString(),
          order.total.toString(),
          order.trackingNumber || '',
          order.carrier || '',
        ].join(',');
      });

      const csv = [csvHeaders.join(','), ...csvRows].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="order-history-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (format === 'json') {
      // Return JSON format
      return NextResponse.json(orders);
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting orders:', error);
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    );
  }
}
