import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/admin/categories/[id]/translations
 * Get all translations for a category
 */
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'CATEGORY', 'VIEW')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await context.params

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        translations: {
          orderBy: {
            locale: 'asc',
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ translations: category.translations })
  } catch (error) {
    console.error('Error fetching category translations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/categories/[id]/translations
 * Create or update a category translation
 */
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'CATEGORY', 'UPDATE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await context.params
    const body = await request.json()
    const { locale, name, description, slug } = body

    // Validate required fields
    if (!locale || !name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: locale, name, slug' },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if translation already exists
    const existingTranslation = await prisma.categoryTranslation.findUnique({
      where: {
        categoryId_locale: {
          categoryId: id,
          locale,
        },
      },
    })

    // Create or update translation
    const translation = await prisma.categoryTranslation.upsert({
      where: {
        categoryId_locale: {
          categoryId: id,
          locale,
        },
      },
      create: {
        categoryId: id,
        locale,
        name,
        description: description || null,
        slug,
      },
      update: {
        name,
        description: description || null,
        slug,
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: existingTranslation ? 'UPDATE' : 'CREATE',
      resource: 'CATEGORY',
      resourceId: id,
      details: `${existingTranslation ? 'Updated' : 'Created'} ${locale} translation for category: ${category.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Error creating/updating category translation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
