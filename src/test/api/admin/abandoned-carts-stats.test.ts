import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/admin/abandoned-carts/stats/route'
import { NextRequest } from 'next/server'
import { mockPrisma, mockAdminSession, resetAllMocks } from '@/test/helpers/mocks'

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

describe('Admin Abandoned Carts Stats API', () => {
  beforeEach(() => {
    resetAllMocks()
    mockIsFeatureEnabled.mockResolvedValue(true)
  })

  describe('GET /api/admin/abandoned-carts/stats', () => {
    it('should return 404 if feature is disabled', async () => {
      mockIsFeatureEnabled.mockResolvedValue(false)
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Feature not available')
    })

    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 401 if user is not ADMIN or SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'MANAGER', email: 'manager@example.com' },
      } as any)

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return statistics for ADMIN', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      mockPrisma.abandonedCart.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(60) // abandoned
        .mockResolvedValueOnce(30) // recovered
        .mockResolvedValueOnce(10) // expired

      mockPrisma.abandonedCart.findMany
        .mockResolvedValueOnce([
          { totalValue: 100.00 },
          { totalValue: 200.50 },
        ]) // abandoned carts
        .mockResolvedValueOnce([
          { totalValue: 150.00 },
        ]) // recovered carts

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.total).toBe(100)
      expect(data.abandoned).toBe(60)
      expect(data.recovered).toBe(30)
      expect(data.expired).toBe(10)
      expect(data.totalValue).toBe(300.50)
      expect(data.recoveredValue).toBe(150.00)
      expect(data.recoveryRate).toBe(30)
    })

    it('should calculate recovery rate correctly when total is zero', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      mockPrisma.abandonedCart.count
        .mockResolvedValueOnce(0) // total
        .mockResolvedValueOnce(0) // abandoned
        .mockResolvedValueOnce(0) // recovered
        .mockResolvedValueOnce(0) // expired

      mockPrisma.abandonedCart.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.recoveryRate).toBe(0)
    })

    it('should handle database errors', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      mockPrisma.abandonedCart.count.mockRejectedValue(new Error('DB Error'))

      const request = new NextRequest('http://localhost:3000/api/admin/abandoned-carts/stats')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch stats')
    })
  })
})
