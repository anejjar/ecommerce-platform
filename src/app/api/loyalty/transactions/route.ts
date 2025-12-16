import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get loyalty account
    const account = await prisma.customerLoyaltyAccount.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Loyalty account not found' },
        { status: 404 }
      );
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // Optional filter by type

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { accountId: account.id };
    if (type) {
      where.type = type;
    }

    // Get transactions
    const [transactions, total] = await Promise.all([
      prisma.loyaltyPointsTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.loyaltyPointsTransaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        points: tx.points,
        description: tx.description,
        referenceType: tx.referenceType,
        referenceId: tx.referenceId,
        expiresAt: tx.expiresAt,
        expired: tx.expired,
        createdAt: tx.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get loyalty transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to get loyalty transactions' },
      { status: 500 }
    );
  }
}
