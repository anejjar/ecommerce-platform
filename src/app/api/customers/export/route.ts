import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
      },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Generate CSV
    const headers = ['Name', 'Email', 'Total Orders', 'Total Spent', 'Joined Date'];
    const csvRows = [headers.join(',')];

    customers.forEach((customer) => {
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      );

      const row = [
        `"${customer.name || 'N/A'}"`,
        `"${customer.email}"`,
        customer._count.orders,
        totalSpent.toFixed(2),
        new Date(customer.createdAt).toLocaleDateString(),
      ];

      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="customers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Failed to export customers:', error);
    return NextResponse.json(
      { error: 'Failed to export customers' },
      { status: 500 }
    );
  }
}
