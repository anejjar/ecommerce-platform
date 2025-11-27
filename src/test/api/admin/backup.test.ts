import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/admin/backup/route'
import { NextRequest } from 'next/server'

// Mock NextAuth
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    backup: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    product: { findMany: vi.fn() },
    category: { findMany: vi.fn() },
    order: { findMany: vi.fn() },
    user: { findMany: vi.fn() },
    storeSetting: { findMany: vi.fn() },
    discountCode: { findMany: vi.fn() },
    featureFlag: { findMany: vi.fn() },
    mediaLibrary: { findMany: vi.fn() },
  },
}))

// Mock cloudinary
vi.mock('@/lib/cloudinary', () => ({
  default: {
    uploader: {
      upload: vi.fn(),
    },
  },
}))

// Mock activity log
vi.mock('@/lib/activity-log', () => ({
  logActivity: vi.fn(() => Promise.resolve()),
  getClientIp: vi.fn(() => '127.0.0.1'),
  getUserAgent: vi.fn(() => 'test-agent'),
}))

import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

const mockGetServerSession = getServerSession as any

describe('Admin Backup API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/admin/backup', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/backup')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 if user is not ADMIN or SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'MANAGER', email: 'manager@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/backup')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
    })

    it('should return list of backups for ADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@example.com' },
      })

      const mockBackups = [
        {
          id: '1',
          filename: 'backup-1.json',
          type: 'MANUAL',
          status: 'COMPLETED',
          fileSize: 1024,
          createdAt: new Date('2024-01-01'),
          createdBy: {
            id: '1',
            name: 'Admin',
            email: 'admin@example.com',
          },
        },
      ]

      ;(prisma.backup.findMany as any).mockResolvedValue(mockBackups)
      ;(prisma.backup.count as any).mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/admin/backup')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.backups).toHaveLength(1)
      expect(data.total).toBe(1)
    })

    it('should support pagination', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      ;(prisma.backup.findMany as any).mockResolvedValue([])
      ;(prisma.backup.count as any).mockResolvedValue(50)

      const request = new NextRequest('http://localhost:3000/api/admin/backup?page=2&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(prisma.backup.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })

    it('should filter by type', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@example.com' },
      })

      ;(prisma.backup.findMany as any).mockResolvedValue([])
      ;(prisma.backup.count as any).mockResolvedValue(5)

      const request = new NextRequest('http://localhost:3000/api/admin/backup?type=MANUAL')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.backup.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'MANUAL' },
        })
      )
    })

    it('should filter by status', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@example.com' },
      })

      ;(prisma.backup.findMany as any).mockResolvedValue([])
      ;(prisma.backup.count as any).mockResolvedValue(5)

      const request = new NextRequest('http://localhost:3000/api/admin/backup?status=COMPLETED')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.backup.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'COMPLETED' },
        })
      )
    })
  })

  describe('POST /api/admin/backup', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/backup', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 if user is not ADMIN or SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'MANAGER', email: 'manager@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/backup', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
    })

    it('should create a new backup', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@example.com' },
      })

      const mockBackup = {
        id: 'backup-1',
        filename: 'backup-1234567890.json',
        status: 'IN_PROGRESS',
        type: 'MANUAL',
        fileSize: 0,
        includeProducts: true,
        includeOrders: true,
        includeCustomers: true,
        includeMedia: false,
        includeSettings: true,
        createdById: '1',
      }

      ;(prisma.backup.create as any).mockResolvedValue(mockBackup)

      const request = new NextRequest('http://localhost:3000/api/admin/backup', {
        method: 'POST',
        body: JSON.stringify({
          includeProducts: true,
          includeOrders: true,
          includeCustomers: true,
          includeMedia: false,
          includeSettings: true,
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.backup.id).toBe('backup-1')
      expect(data.backup.status).toBe('IN_PROGRESS')
    })

    it('should use default values for backup options', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      const mockBackup = {
        id: 'backup-1',
        status: 'IN_PROGRESS',
      }

      ;(prisma.backup.create as any).mockResolvedValue(mockBackup)

      const request = new NextRequest('http://localhost:3000/api/admin/backup', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(prisma.backup.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            includeProducts: true,
            includeOrders: true,
            includeCustomers: true,
            includeMedia: false,
            includeSettings: true,
            type: 'MANUAL',
          }),
        })
      )
    })
  })
})
