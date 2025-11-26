import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isFeatureEnabled } from '@/lib/check-feature';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const feature = searchParams.get('feature');

    if (!feature) {
      return NextResponse.json({ error: 'Feature name required' }, { status: 400 });
    }

    const enabled = await isFeatureEnabled(feature);

    return NextResponse.json({ enabled, feature });
  } catch (error) {
    console.error('Error checking feature:', error);
    return NextResponse.json(
      { error: 'Failed to check feature' },
      { status: 500 }
    );
  }
}
