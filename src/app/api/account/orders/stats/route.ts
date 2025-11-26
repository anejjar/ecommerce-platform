import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [total, pending, processing, shipped, delivered] = await Promise.all([
      prisma.order.count({ where: { userId: session.user.id } }),
      prisma.order.count({ where: { userId: session.user.id, status: 'PENDING' } }),
      prisma.order.count({ where: { userId: session.user.id, status: 'PROCESSING' } }),
      prisma.order.count({ where: { userId: session.user.id, status: 'SHIPPED' } }),
      prisma.order.count({ where: { userId: session.user.id, status: 'DELIVERED' } }),
    ]);

    return NextResponse.json({
      total,
      pending,
      processing,
      shipped,
      delivered,
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order stats' },
      { status: 500 }
    );
  }
}
