import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/permissions';
import { isFeatureEnabled } from '@/lib/features';

export async function GET() {
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

    // Only SUPERADMIN and ADMIN can view permissions
    if (!hasPermission(session.user.role, 'ADMIN_USER', 'MANAGE')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const permissions = await prisma.permission.findMany({
      orderBy: [
        { role: 'asc' },
        { resource: 'asc' },
        { action: 'asc' },
      ],
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    // Only SUPERADMIN and ADMIN can create permissions
    if (!hasPermission(session.user.role, 'ADMIN_USER', 'MANAGE')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { role, resource, action } = body;

    if (!role || !resource || !action) {
      return NextResponse.json(
        { error: 'Role, resource, and action are required' },
        { status: 400 }
      );
    }

    // Prevent granting permissions to SUPERADMIN and ADMIN (they already have all)
    if (role === 'SUPERADMIN' || role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot modify SUPERADMIN or ADMIN permissions' },
        { status: 400 }
      );
    }

    // Check if permission already exists
    const existing = await prisma.permission.findFirst({
      where: {
        role,
        resource,
        action,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This permission already exists for this role' },
        { status: 400 }
      );
    }

    const permission = await prisma.permission.create({
      data: {
        role,
        resource,
        action,
      },
    });

    // Log the activity
    await prisma.adminActivityLog.create({
      data: {
        userId: session.user.id,
        action: 'PERMISSION_CREATED',
        targetType: 'Permission',
        targetId: permission.id,
        details: {
          role,
          resource,
          action,
        },
      },
    }).catch(err => console.error('Failed to log activity:', err));

    return NextResponse.json(permission, { status: 201 });
  } catch (error) {
    console.error('Error creating permission:', error);
    return NextResponse.json(
      { error: 'Failed to create permission' },
      { status: 500 }
    );
  }
}
