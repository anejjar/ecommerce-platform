import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'
import { Decimal } from '@prisma/client/runtime/library'

/**
 * GET /api/admin/inventory/reports
 * Generate inventory reports
 * Query params: type (current-stock, low-stock, valuation, movement)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'INVENTORY', 'VIEW') ||
        !hasPermission(session.user.role, 'ANALYTICS', 'VIEW')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const reportType = searchParams.get('type') || 'current-stock'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const categoryId = searchParams.get('categoryId')

    let reportData: any = {}

    switch (reportType) {
      case 'current-stock': {
        // Current Stock Report
        const where: any = {}
        if (categoryId) {
          where.categoryId = categoryId
        }

        const products = await prisma.product.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            variants: {
              select: {
                id: true,
                sku: true,
                stock: true,
                price: true,
                optionValues: true,
              },
            },
            stockAlert: true,
          },
          orderBy: { name: 'asc' },
        })

        const summary = {
          totalProducts: products.length,
          totalStock: products.reduce((sum, p) => sum + p.stock, 0),
          totalVariants: products.reduce((sum, p) => sum + p.variants.length, 0),
          totalVariantStock: products.reduce(
            (sum, p) => sum + p.variants.reduce((vs, v) => vs + v.stock, 0),
            0
          ),
          productsInStock: products.filter(p => p.stock > 0).length,
          productsOutOfStock: products.filter(p => p.stock === 0).length,
          productsLowStock: products.filter(
            p => p.stockAlert && p.stock <= p.stockAlert.threshold
          ).length,
        }

        reportData = {
          type: 'current-stock',
          summary,
          products: products.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            stock: p.stock,
            category: p.category?.name,
            variants: p.variants,
            hasLowStock: p.stockAlert ? p.stock <= p.stockAlert.threshold : false,
            threshold: p.stockAlert?.threshold,
          })),
        }
        break
      }

      case 'low-stock': {
        // Low Stock Report
        const defaultThreshold = 10

        const productsWithAlerts = await prisma.product.findMany({
          where: {
            stockAlert: { isNot: null },
          },
          include: {
            stockAlert: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            variants: {
              select: {
                id: true,
                sku: true,
                stock: true,
                optionValues: true,
              },
            },
          },
        })

        const lowStockProducts = productsWithAlerts.filter(
          p => p.stock <= (p.stockAlert?.threshold || defaultThreshold)
        )

        const productsWithoutAlerts = await prisma.product.findMany({
          where: {
            stockAlert: null,
            stock: { lte: defaultThreshold },
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })

        const allLowStock = [...lowStockProducts, ...productsWithoutAlerts]
          .sort((a, b) => a.stock - b.stock)

        reportData = {
          type: 'low-stock',
          summary: {
            totalLowStock: allLowStock.length,
            criticalStock: allLowStock.filter(p => p.stock === 0).length,
            needsReorder: allLowStock.filter(p => p.stock > 0).length,
          },
          products: allLowStock.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            stock: p.stock,
            threshold: p.stockAlert?.threshold || defaultThreshold,
            belowBy: (p.stockAlert?.threshold || defaultThreshold) - p.stock,
            category: p.category?.name,
          })),
        }
        break
      }

      case 'valuation': {
        // Inventory Valuation Report
        const products = await prisma.product.findMany({
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            variants: {
              select: {
                stock: true,
                price: true,
              },
            },
          },
        })

        let totalValue = 0
        const valuationData = products.map(p => {
          const productValue = p.stock * p.price.toNumber()
          const variantsValue = p.variants.reduce(
            (sum, v) => sum + (v.stock * (v.price?.toNumber() || p.price.toNumber())),
            0
          )
          const totalProductValue = productValue + variantsValue
          totalValue += totalProductValue

          return {
            id: p.id,
            name: p.name,
            sku: p.sku,
            stock: p.stock,
            price: p.price.toNumber(),
            productValue,
            variantsValue,
            totalValue: totalProductValue,
            category: p.category?.name,
          }
        })

        reportData = {
          type: 'valuation',
          summary: {
            totalProducts: products.length,
            totalInventoryValue: totalValue,
            averageProductValue: totalValue / (products.length || 1),
          },
          products: valuationData.sort((a, b) => b.totalValue - a.totalValue),
        }
        break
      }

      case 'movement': {
        // Stock Movement Report
        const where: any = {}

        if (startDate || endDate) {
          where.createdAt = {}
          if (startDate) {
            where.createdAt.gte = new Date(startDate)
          }
          if (endDate) {
            where.createdAt.lte = new Date(endDate)
          }
        } else {
          // Default to last 30 days
          where.createdAt = {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          }
        }

        const stockHistory = await prisma.stockHistory.findMany({
          where,
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
            supplier: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        })

        // Calculate summary by change type
        const byChangeType: Record<string, { count: number; totalChange: number }> = {}
        stockHistory.forEach(h => {
          if (!byChangeType[h.changeType]) {
            byChangeType[h.changeType] = { count: 0, totalChange: 0 }
          }
          byChangeType[h.changeType].count++
          byChangeType[h.changeType].totalChange += h.quantityChange
        })

        // Group by date for chart data
        const byDate: Record<string, { in: number; out: number }> = {}
        stockHistory.forEach(h => {
          const date = h.createdAt.toISOString().split('T')[0]
          if (!byDate[date]) {
            byDate[date] = { in: 0, out: 0 }
          }
          if (h.quantityChange > 0) {
            byDate[date].in += h.quantityChange
          } else {
            byDate[date].out += Math.abs(h.quantityChange)
          }
        })

        reportData = {
          type: 'movement',
          period: {
            startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: endDate || new Date().toISOString(),
          },
          summary: {
            totalMovements: stockHistory.length,
            byChangeType,
            totalStockIn: stockHistory
              .filter(h => h.quantityChange > 0)
              .reduce((sum, h) => sum + h.quantityChange, 0),
            totalStockOut: Math.abs(
              stockHistory
                .filter(h => h.quantityChange < 0)
                .reduce((sum, h) => sum + h.quantityChange, 0)
            ),
          },
          chartData: Object.entries(byDate)
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => a.date.localeCompare(b.date)),
          movements: stockHistory.slice(0, 100), // Limit to 100 most recent
        }
        break
      }

      case 'dashboard': {
        // Dashboard Report - Aggregate data for the main inventory dashboard
        const defaultThreshold = 10

        // Get all products with comprehensive data
        const products = await prisma.product.findMany({
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            variants: {
              select: {
                id: true,
                stock: true,
                price: true,
              },
            },
            stockAlert: true,
          },
        })

        // Calculate summary statistics
        const totalProducts = products.length
        const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

        const lowStockProducts = products.filter(
          p => p.stockAlert ? p.stock <= p.stockAlert.threshold : p.stock <= defaultThreshold
        )
        const lowStockCount = lowStockProducts.length

        const outOfStockCount = products.filter(p => p.stock === 0).length

        // Calculate total inventory value
        const inventoryValue = products.reduce((sum, p) => {
          const productValue = p.stock * p.price.toNumber()
          const variantsValue = p.variants.reduce(
            (vSum, v) => vSum + (v.stock * (v.price?.toNumber() || p.price.toNumber())),
            0
          )
          return sum + productValue + variantsValue
        }, 0)

        // Get recent stock changes (last 10)
        const recentChanges = await prisma.stockHistory.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })

        // Get stock trend data (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const stockMovements = await prisma.stockHistory.findMany({
          where: {
            createdAt: { gte: thirtyDaysAgo },
          },
          select: {
            createdAt: true,
            quantityChange: true,
          },
          orderBy: { createdAt: 'asc' },
        })

        // Group by date for trend chart
        const trendByDate: Record<string, { in: number; out: number }> = {}
        stockMovements.forEach(h => {
          const date = h.createdAt.toISOString().split('T')[0]
          if (!trendByDate[date]) {
            trendByDate[date] = { in: 0, out: 0 }
          }
          if (h.quantityChange > 0) {
            trendByDate[date].in += h.quantityChange
          } else {
            trendByDate[date].out += Math.abs(h.quantityChange)
          }
        })

        // Stock by category
        const stockByCategory: Record<string, { products: number; totalStock: number; value: number }> = {}
        products.forEach(p => {
          const categoryName = p.category?.name || 'Uncategorized'
          if (!stockByCategory[categoryName]) {
            stockByCategory[categoryName] = { products: 0, totalStock: 0, value: 0 }
          }
          stockByCategory[categoryName].products++
          stockByCategory[categoryName].totalStock += p.stock
          stockByCategory[categoryName].value += p.stock * p.price.toNumber()
        })

        reportData = {
          type: 'dashboard',
          summary: {
            totalProducts,
            totalStock,
            lowStockCount,
            outOfStockCount,
            inventoryValue: Math.round(inventoryValue * 100) / 100,
          },
          recentChanges: recentChanges.map(change => ({
            id: change.id,
            productId: change.productId,
            productName: change.product.name,
            productSku: change.product.sku,
            changeType: change.changeType,
            quantityBefore: change.quantityBefore,
            quantityAfter: change.quantityAfter,
            quantityChange: change.quantityChange,
            createdAt: change.createdAt,
            createdBy: change.user?.name || 'System',
          })),
          lowStockAlerts: lowStockProducts.slice(0, 10).map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            stock: p.stock,
            threshold: p.stockAlert?.threshold || defaultThreshold,
            category: p.category?.name,
          })),
          stockTrend: Object.entries(trendByDate)
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => a.date.localeCompare(b.date)),
          stockByCategory: Object.entries(stockByCategory)
            .map(([category, data]) => ({ category, ...data }))
            .sort((a, b) => b.totalStock - a.totalStock),
        }
        break
      }

      default: {
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
      }
    }

    return NextResponse.json({
      report: reportData,
      generatedAt: new Date().toISOString(),
      generatedBy: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    })
  } catch (error) {
    console.error('Error generating inventory report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
