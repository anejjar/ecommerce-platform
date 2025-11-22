import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/admin/activity-logs/route'

// Mock dependencies
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

vi.mock('@/lib/permissions', () => ({
  hasPermission: vi.fn(),
}))

vi.mock('@/lib/activity-log', () => ({
  getActivityLogs: vi.fn(),
}))

import { getServerSession } from 'next-auth/next'
import { hasPermission } from '@/lib/permissions'
import { getActivityLogs } from '@/lib/activity-log'

describe('GET /api/admin/activity-logs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should return 401 if not authenticated', async () => {
      ;(getServerSession as any).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/activity-logs')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('Authorization', () => {
    it('should return 403 if user lacks permissions', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'user@example.com', role: 'VIEWER' },
      })
      ;(hasPermission as any).mockReturnValue(false)

      const request = new NextRequest('http://localhost:3000/api/admin/activity-logs')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
      expect(hasPermission).toHaveBeenCalledWith('VIEWER', 'ADMIN_USER', 'VIEW')
    })
  })

  describe('Success Cases', () => {
    it('should return activity logs with default pagination', async () => {
      const mockLogs = [
        {
          id: '1',
          userId: 'user-1',
          action: 'CREATE',
          resource: 'ADMIN_USER',
          resourceId: 'user-2',
          details: 'Created new admin user',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          createdAt: new Date('2024-01-01'),
          user: {
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'ADMIN',
          },
        },
      ]

      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockResolvedValue({
        logs: mockLogs,
        total: 100,
        page: 1,
        limit: 20,
        totalPages: 5,
      })

      const request = new NextRequest('http://localhost:3000/api/admin/activity-logs')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.logs).toHaveLength(1)
      expect(data.logs[0].id).toBe('1')
      expect(data.logs[0].action).toBe('CREATE')
      expect(data.logs[0].resource).toBe('ADMIN_USER')
      expect(data.total).toBe(100)
      expect(data.page).toBe(1)
      expect(data.limit).toBe(20)
      expect(data.totalPages).toBe(5)
      expect(getActivityLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
      })
    })

    it('should handle custom pagination parameters', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockResolvedValue({
        logs: [],
        total: 0,
        page: 2,
        limit: 50,
        totalPages: 0,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/admin/activity-logs?page=2&limit=50'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(getActivityLogs).toHaveBeenCalledWith({
        page: 2,
        limit: 50,
      })
    })

    it('should filter by userId', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockResolvedValue({
        logs: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/admin/activity-logs?userId=user-123'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(getActivityLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        userId: 'user-123',
      })
    })

    it('should filter by action', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockResolvedValue({
        logs: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/admin/activity-logs?action=DELETE'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(getActivityLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        action: 'DELETE',
      })
    })

    it('should filter by resource', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockResolvedValue({
        logs: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/admin/activity-logs?resource=ADMIN_USER'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(getActivityLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        resource: 'ADMIN_USER',
      })
    })

    it('should filter by resourceId', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockResolvedValue({
        logs: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/admin/activity-logs?resourceId=product-456'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(getActivityLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        resourceId: 'product-456',
      })
    })

    it('should filter by date range', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockResolvedValue({
        logs: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/admin/activity-logs?startDate=2024-01-01&endDate=2024-12-31'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(getActivityLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      })
    })

    it('should handle multiple filters simultaneously', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'SUPERADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockResolvedValue({
        logs: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/admin/activity-logs?userId=user-123&action=UPDATE&resource=PRODUCT&page=2&limit=10'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(getActivityLogs).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        userId: 'user-123',
        action: 'UPDATE',
        resource: 'PRODUCT',
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      ;(getServerSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' },
      })
      ;(hasPermission as any).mockReturnValue(true)
      ;(getActivityLogs as any).mockRejectedValue(new Error('Database connection error'))

      const request = new NextRequest('http://localhost:3000/api/admin/activity-logs')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})
