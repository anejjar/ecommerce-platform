import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all feature flags (SUPERADMIN only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const features = await prisma.featureFlag.findMany({
      orderBy: [{ category: 'asc' }, { displayName: 'asc' }],
    });

    return NextResponse.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    );
  }
}

// Create a new feature flag (SUPERADMIN only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, displayName, description, category, tier, enabled } = body;

    if (!name || !displayName || !category) {
      return NextResponse.json(
        { error: 'Name, display name, and category are required' },
        { status: 400 }
      );
    }

    const feature = await prisma.featureFlag.create({
      data: {
        name,
        displayName,
        description: description || null,
        category,
        tier: tier || 'PRO',
        enabled: enabled ?? false,
      },
    });

    return NextResponse.json(feature);
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    );
  }
}
