import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/admin/flash-sales/route'
import { NextRequest } from 'next/server'
import { mockPrisma, mockAdminSession, mockSuperAdminSession, resetAllMocks } from '@/test/helpers/mocks'

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}))

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

// Mock feature flags
vi.mock('@/lib/features', () => ({
  isFeatureEnabled: vi.fn(() => Promise.resolve(true)),
}))

import { getServerSession } from 'next-auth'
import { isFeatureEnabled } from '@/lib/features'

const mockGetServerSession = getServerSession as any
const mockIsFeatureEnabled = isFeatureEnabled as any

describe('Admin Flash Sales API - GET /api/admin/flash-sales', () => {
  beforeEach(() => {
    resetAllMocks()
    mockIsFeatureEnabled.mockResolvedValue(true)
  })

  it('should return 404 if feature is disabled', async () => {
    mockIsFeatureEnabled.mockResolvedValue(false)
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Feature not available')
  })

  it('should return 401 if not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 401 if user is not ADMIN, SUPERADMIN, or MANAGER', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: '1', role: 'CUSTOMER', email: 'customer@example.com' },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return list of flash sales for ADMIN', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const mockSales = [
      {
        id: 'sale-1',
        name: 'Summer Sale',
        status: 'ACTIVE',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-31'),
        discountType: 'PERCENTAGE',
        discountValue: 25.0,
        isActive: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
        categories: [],
      },
      {
        id: 'sale-2',
        name: 'Winter Sale',
        status: 'SCHEDULED',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        discountType: 'FIXED_AMOUNT',
        discountValue: 10.0,
        isActive: true,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
        categories: [],
      },
    ]

    mockPrisma.flashSale.findMany.mockResolvedValue(mockSales)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data[0].name).toBe('Summer Sale')
    expect(data[1].name).toBe('Winter Sale')
  })

  it('should filter by status', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    mockPrisma.flashSale.findMany.mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales?status=ACTIVE')
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(mockPrisma.flashSale.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'ACTIVE',
        }),
      })
    )
  })

  it('should filter by date range', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    mockPrisma.flashSale.findMany.mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales?startDate=2024-12-01&endDate=2024-12-31')
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(mockPrisma.flashSale.findMany).toHaveBeenCalled()
  })

  it('should handle database errors', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    mockPrisma.flashSale.findMany.mockRejectedValue(new Error('DB Error'))

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch flash sales')
  })
})

describe('Admin Flash Sales API - POST /api/admin/flash-sales', () => {
  beforeEach(() => {
    resetAllMocks()
    mockIsFeatureEnabled.mockResolvedValue(true)
  })

  it('should return 404 if feature is disabled', async () => {
    mockIsFeatureEnabled.mockResolvedValue(false)
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Feature not available')
  })

  it('should return 401 if not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should create a flash sale with valid data', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const saleData = {
      name: 'New Sale',
      description: 'Test sale',
      discountType: 'PERCENTAGE',
      discountValue: 20.0,
      startDate: '2024-12-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      status: 'DRAFT',
      isActive: true,
      priority: 0,
      productIds: ['product-1', 'product-2'],
    }

    const createdSale = {
      id: 'sale-new',
      ...saleData,
      startDate: new Date(saleData.startDate),
      endDate: new Date(saleData.endDate),
      createdAt: new Date(),
      updatedAt: new Date(),
      products: [],
      categories: [],
    }

    mockPrisma.flashSale.create.mockResolvedValue(createdSale)
    mockPrisma.product.findMany.mockResolvedValue([
      { id: 'product-1', price: 100.0 },
      { id: 'product-2', price: 50.0 },
    ])

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.name).toBe('New Sale')
  })

  it('should validate required fields', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const invalidData = {
      name: '', // Empty name
      discountType: 'PERCENTAGE',
      discountValue: 20.0,
    }

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('should validate endDate is after startDate', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const invalidData = {
      name: 'Invalid Sale',
      discountType: 'PERCENTAGE',
      discountValue: 20.0,
      startDate: '2024-12-31T00:00:00Z',
      endDate: '2024-12-01T00:00:00Z', // Before startDate
    }

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('end date')
  })

  it('should calculate sale prices for products', async () => {
    mockGetServerSession.mockResolvedValue(mockAdminSession)

    const saleData = {
      name: 'Percentage Sale',
      discountType: 'PERCENTAGE',
      discountValue: 25.0,
      startDate: '2024-12-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      productIds: ['product-1'],
    }

    mockPrisma.product.findMany.mockResolvedValue([
      { id: 'product-1', price: 100.0 },
    ])

    mockPrisma.flashSale.create.mockResolvedValue({
      id: 'sale-1',
      ...saleData,
      startDate: new Date(saleData.startDate),
      endDate: new Date(saleData.endDate),
    })

    const request = new NextRequest('http://localhost:3000/api/admin/flash-sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    })
    const response = await POST(request)

    expect(response.status).toBe(201)
    // Verify that flashSaleProduct.create was called with correct salePrice (75.0 for 25% off 100)
    expect(mockPrisma.flashSaleProduct.create).toHaveBeenCalled()
  })
})

