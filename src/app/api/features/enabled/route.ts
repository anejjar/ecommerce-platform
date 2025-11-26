import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const features = await prisma.featureFlag.findMany({
      where: { enabled: true },
      select: { name: true },
    });

    return NextResponse.json({
      features: features.map(f => f.name),
    });
  } catch (error) {
    console.error('Error fetching enabled features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enabled features' },
      { status: 500 }
    );
  }
}
