import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/loyalty/accounts
 * List all loyalty accounts with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const tierId = searchParams.get('tierId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { referralCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tierId) {
      where.tierId = tierId;
    }

    // Get total count
    const total = await prisma.customerLoyaltyAccount.count({ where });

    // Get accounts
    const accounts = await prisma.customerLoyaltyAccount.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        tier: {
          select: {
            id: true,
            name: true,
            color: true,
            pointsRequired: true,
          },
        },
        _count: {
          select: {
            transactions: true,
            redemptions: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json({
      accounts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching loyalty accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty accounts', details: error.message },
      { status: 500 }
    );
  }
}
