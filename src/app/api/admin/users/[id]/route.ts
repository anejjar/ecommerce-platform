import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { isFeatureEnabled } from '@/lib/features'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * PATCH /api/admin/users/[id]
 * Update an existing admin user
 */
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'ADMIN_USER', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check feature flag
    const featureEnabled = await isFeatureEnabled('multi_admin')
    if (!featureEnabled) {
      return NextResponse.json({ error: 'Feature not available' }, { status: 404 })
    }

    const { id } = await context.params
    const body = await request.json()
    const { name, email, role } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent non-SUPERADMIN from updating SUPERADMIN users
    if (existingUser.role === 'SUPERADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Only SUPERADMIN can update SUPERADMIN users' },
        { status: 403 }
      )
    }

    // Prevent updating role to SUPERADMIN if not SUPERADMIN
    if (role === 'SUPERADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Only SUPERADMIN can create SUPERADMIN users' },
        { status: 403 }
      )
    }

    // Prevent user from changing their own role
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot change your own role' },
        { status: 400 }
      )
    }

    // Update user
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (role !== undefined) {
      updateData.role = role
      // Invalidate all sessions when role changes (force re-login)
      updateData.sessionsInvalidatedAt = new Date()
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Log activity
    const changes = []
    if (name !== undefined) changes.push(`name to ${name}`)
    if (email !== undefined) changes.push(`email to ${email}`)
    if (role !== undefined) changes.push(`role to ${role}`)

    await logActivity({
      userId: session.user.id,
      action: 'UPDATE',
      resource: 'ADMIN_USER',
      resourceId: user.id,
      details: `Updated admin user: ${changes.join(', ')}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating admin user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete an admin user
 */
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'ADMIN_USER', 'DELETE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check feature flag
    const featureEnabled = await isFeatureEnabled('multi_admin')
    if (!featureEnabled) {
      return NextResponse.json({ error: 'Feature not available' }, { status: 404 })
    }

    const { id } = await context.params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent deleting SUPERADMIN users
    if (existingUser.role === 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'SUPERADMIN users cannot be deleted' },
        { status: 403 }
      )
    }

    // Prevent user from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete yourself' },
        { status: 400 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'ADMIN_USER',
      resourceId: id,
      details: `Deleted admin user: ${existingUser.email} (${existingUser.role})`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
