import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isFeatureEnabled } from '@/lib/features'

// Manually activate a flash sale
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const enabled = await isFeatureEnabled('flash_sales')
    if (!enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const flashSale = await prisma.flashSale.findUnique({
      where: { id },
    })

    if (!flashSale) {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }

    const now = new Date()
    if (flashSale.endDate < now) {
      return NextResponse.json(
        { error: 'Cannot activate a flash sale that has already ended' },
        { status: 400 }
      )
    }

    const updated = await prisma.flashSale.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        isActive: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error activating flash sale:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Flash sale not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to activate flash sale' },
      { status: 500 }
    )
  }
}

