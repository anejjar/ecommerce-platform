import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getEarlyAccessGrants } from '@/lib/loyalty/early-access';

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
      select: {
        id: true,
        tier: {
          select: {
            earlyAccessEnabled: true,
            earlyAccessHours: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Loyalty account not found' },
        { status: 404 }
      );
    }

    // Get active early access grants
    const grants = await getEarlyAccessGrants(account.id);

    return NextResponse.json({
      earlyAccessEnabled: account.tier.earlyAccessEnabled,
      earlyAccessHours: account.tier.earlyAccessHours,
      activeGrants: grants.map((grant) => ({
        id: grant.id,
        accessType: grant.accessType,
        referenceId: grant.referenceId,
        grantedAt: grant.grantedAt,
        expiresAt: grant.expiresAt,
        accessed: grant.accessed,
      })),
    });
  } catch (error) {
    console.error('Get early access grants error:', error);
    return NextResponse.json(
      { error: 'Failed to get early access grants' },
      { status: 500 }
    );
  }
}
