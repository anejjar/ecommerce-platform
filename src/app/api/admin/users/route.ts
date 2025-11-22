import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { hasPermission } from '@/lib/permissions'
import { isFeatureEnabled } from '@/lib/features'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

/**
 * GET /api/admin/users
 * List all admin users with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'ADMIN_USER', 'VIEW')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check feature flag
    const featureEnabled = await isFeatureEnabled('multi_admin')
    if (!featureEnabled) {
      return NextResponse.json({ error: 'Feature not available' }, { status: 404 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {
      role: {
        in: ['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'SUPPORT', 'VIEWER'],
      },
    }

    if (role) {
      where.role = role
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/users
 * Create a new admin user
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'ADMIN_USER', 'CREATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check feature flag
    const featureEnabled = await isFeatureEnabled('multi_admin')
    if (!featureEnabled) {
      return NextResponse.json({ error: 'Feature not available' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { name, email, role, password } = body

    // Validate required fields
    if (!email || !role || !password) {
      return NextResponse.json(
        { error: 'Email, role, and password are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'SUPPORT', 'VIEWER']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Only SUPERADMIN can create SUPERADMIN users
    if (role === 'SUPERADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Only SUPERADMIN can create SUPERADMIN users' },
        { status: 403 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
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
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      resource: 'ADMIN_USER',
      resourceId: user.id,
      details: `Created new admin user: ${email} with role ${role}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
