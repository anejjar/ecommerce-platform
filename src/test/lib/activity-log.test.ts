import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  logActivity,
  getActivityLogs,
  getActivityLogsByUser,
  getActivityLogsByResource,
} from '@/lib/activity-log'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    adminActivityLog: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

describe('Activity Log System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('logActivity', () => {
    it('should log admin activity with all required fields', async () => {
      const mockLog = {
        id: '1',
        userId: 'user-123',
        action: 'CREATE',
        resource: 'ADMIN_USER',
        resourceId: 'new-user-456',
        details: 'Created new manager user',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        createdAt: new Date(),
      }

      ;(prisma.adminActivityLog.create as any).mockResolvedValue(mockLog)

      const result = await logActivity({
        userId: 'user-123',
        action: 'CREATE',
        resource: 'ADMIN_USER',
        resourceId: 'new-user-456',
        details: 'Created new manager user',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      })

      expect(result).toEqual(mockLog)
      expect(prisma.adminActivityLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          action: 'CREATE',
          resource: 'ADMIN_USER',
          resourceId: 'new-user-456',
          details: 'Created new manager user',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
        },
      })
    })

    it('should log activity without optional fields', async () => {
      const mockLog = {
        id: '2',
        userId: 'user-123',
        action: 'VIEW',
        resource: 'CUSTOMER',
        createdAt: new Date(),
      }

      ;(prisma.adminActivityLog.create as any).mockResolvedValue(mockLog)

      const result = await logActivity({
        userId: 'user-123',
        action: 'VIEW',
        resource: 'CUSTOMER',
      })

      expect(result).toBeDefined()
      expect(prisma.adminActivityLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          action: 'VIEW',
          resource: 'CUSTOMER',
          resourceId: undefined,
          details: undefined,
          ipAddress: undefined,
          userAgent: undefined,
        },
      })
    })

    it('should handle errors gracefully', async () => {
      ;(prisma.adminActivityLog.create as any).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        logActivity({
          userId: 'user-123',
          action: 'DELETE',
          resource: 'PRODUCT',
        })
      ).rejects.toThrow('Database error')
    })
  })

  describe('getActivityLogs', () => {
    it('should fetch activity logs with pagination', async () => {
      const mockLogs = [
        {
          id: '1',
          userId: 'user-123',
          action: 'CREATE',
          resource: 'PRODUCT',
          createdAt: new Date(),
        },
        {
          id: '2',
          userId: 'user-456',
          action: 'UPDATE',
          resource: 'ORDER',
          createdAt: new Date(),
        },
      ]

      ;(prisma.adminActivityLog.findMany as any).mockResolvedValue(mockLogs)
      ;(prisma.adminActivityLog.count as any).mockResolvedValue(50)

      const result = await getActivityLogs({ page: 1, limit: 10 })

      expect(result.logs).toEqual(mockLogs)
      expect(result.total).toBe(50)
      expect(result.page).toBe(1)
      expect(result.totalPages).toBe(5)
      expect(prisma.adminActivityLog.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      })
    })

    it('should filter logs by action', async () => {
      ;(prisma.adminActivityLog.findMany as any).mockResolvedValue([])
      ;(prisma.adminActivityLog.count as any).mockResolvedValue(0)

      await getActivityLogs({ action: 'DELETE' })

      expect(prisma.adminActivityLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { action: 'DELETE' },
        })
      )
    })

    it('should filter logs by resource', async () => {
      ;(prisma.adminActivityLog.findMany as any).mockResolvedValue([])
      ;(prisma.adminActivityLog.count as any).mockResolvedValue(0)

      await getActivityLogs({ resource: 'ADMIN_USER' })

      expect(prisma.adminActivityLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { resource: 'ADMIN_USER' },
        })
      )
    })

    it('should filter logs by date range', async () => {
      ;(prisma.adminActivityLog.findMany as any).mockResolvedValue([])
      ;(prisma.adminActivityLog.count as any).mockResolvedValue(0)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      await getActivityLogs({ startDate, endDate })

      expect(prisma.adminActivityLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        })
      )
    })
  })

  describe('getActivityLogsByUser', () => {
    it('should fetch logs for a specific user', async () => {
      const mockLogs = [
        {
          id: '1',
          userId: 'user-123',
          action: 'CREATE',
          resource: 'PRODUCT',
          createdAt: new Date(),
        },
      ]

      ;(prisma.adminActivityLog.findMany as any).mockResolvedValue(mockLogs)
      ;(prisma.adminActivityLog.count as any).mockResolvedValue(10)

      const result = await getActivityLogsByUser('user-123', { page: 1, limit: 20 })

      expect(result.logs).toEqual(mockLogs)
      expect(prisma.adminActivityLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123' },
        })
      )
    })
  })

  describe('getActivityLogsByResource', () => {
    it('should fetch logs for a specific resource and ID', async () => {
      const mockLogs = [
        {
          id: '1',
          userId: 'user-123',
          action: 'UPDATE',
          resource: 'PRODUCT',
          resourceId: 'product-789',
          createdAt: new Date(),
        },
      ]

      ;(prisma.adminActivityLog.findMany as any).mockResolvedValue(mockLogs)
      ;(prisma.adminActivityLog.count as any).mockResolvedValue(5)

      const result = await getActivityLogsByResource('PRODUCT', 'product-789')

      expect(result.logs).toEqual(mockLogs)
      expect(prisma.adminActivityLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            resource: 'PRODUCT',
            resourceId: 'product-789',
          },
        })
      )
    })
  })

  describe('Edge cases', () => {
    it('should handle empty results', async () => {
      ;(prisma.adminActivityLog.findMany as any).mockResolvedValue([])
      ;(prisma.adminActivityLog.count as any).mockResolvedValue(0)

      const result = await getActivityLogs({})

      expect(result.logs).toEqual([])
      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(0)
    })

    it('should handle very large page numbers', async () => {
      ;(prisma.adminActivityLog.findMany as any).mockResolvedValue([])
      ;(prisma.adminActivityLog.count as any).mockResolvedValue(100)

      const result = await getActivityLogs({ page: 999, limit: 10 })

      expect(result.logs).toEqual([])
      expect(prisma.adminActivityLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 9980, // (999-1) * 10
        })
      )
    })
  })
})
