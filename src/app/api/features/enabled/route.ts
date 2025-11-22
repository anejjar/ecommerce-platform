import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getEnabledFeatures } from '@/lib/features';

// Get all enabled features (for checking in UI)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Only admins and superadmins can check features
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enabledFeatures = await getEnabledFeatures();

    return NextResponse.json({ features: enabledFeatures });
  } catch (error) {
    console.error('Error fetching enabled features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enabled features' },
      { status: 500 }
    );
  }
}
