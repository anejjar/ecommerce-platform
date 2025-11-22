import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { logActivity, getClientIp, getUserAgent } from '@/lib/activity-log'

interface RouteParams {
  params: Promise<{
    id: string
    locale: string
  }>
}

/**
 * DELETE /api/admin/categories/[id]/translations/[locale]
 * Delete a category translation
 */
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'CATEGORY', 'DELETE')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id, locale } = await context.params

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if translation exists
    const translation = await prisma.categoryTranslation.findUnique({
      where: {
        categoryId_locale: {
          categoryId: id,
          locale,
        },
      },
    })

    if (!translation) {
      return NextResponse.json({ error: 'Translation not found' }, { status: 404 })
    }

    // Delete translation
    await prisma.categoryTranslation.delete({
      where: {
        categoryId_locale: {
          categoryId: id,
          locale,
        },
      },
    })

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: 'DELETE',
      resource: 'CATEGORY',
      resourceId: id,
      details: `Deleted ${locale} translation for category: ${category.name}`,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category translation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
