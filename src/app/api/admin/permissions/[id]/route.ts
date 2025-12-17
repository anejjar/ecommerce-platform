import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/permissions';
import { isFeatureEnabled } from '@/lib/features';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if multi_admin feature is enabled
    const featureEnabled = await isFeatureEnabled('multi_admin');
    if (!featureEnabled) {
      return NextResponse.json({ error: 'Feature not available' }, { status: 404 });
    }

    // Only SUPERADMIN and ADMIN can delete permissions
    if (!hasPermission(session.user.role, 'ADMIN_USER', 'MANAGE')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
    }

    await prisma.permission.delete({
      where: { id },
    });

    // Log the activity
    await prisma.adminActivityLog.create({
      data: {
        userId: session.user.id,
        action: 'PERMISSION_DELETED',
        targetType: 'Permission',
        targetId: id,
        details: {
          role: permission.role,
          resource: permission.resource,
          action: permission.action,
        },
      },
    }).catch(err => console.error('Failed to log activity:', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting permission:', error);
    return NextResponse.json(
      { error: 'Failed to delete permission' },
      { status: 500 }
    );
  }
}
