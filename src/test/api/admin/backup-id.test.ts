import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, DELETE } from '@/app/api/admin/backup/[id]/route'
import { NextRequest } from 'next/server'

// Mock NextAuth
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    backup: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

// Mock cloudinary
vi.mock('@/lib/cloudinary', () => ({
  default: {
    uploader: {
      destroy: vi.fn(),
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
import cloudinary from '@/lib/cloudinary'

const mockGetServerSession = getServerSession as any

describe('Admin Backup [id] API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/admin/backup/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/backup/1')
      const response = await GET(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 if user is not SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/backup/1')
      const response = await GET(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
    })

    it('should return 404 if backup not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      ;(prisma.backup.findUnique as any).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/backup/999')
      const response = await GET(request, { params: { id: '999' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Backup not found')
    })

    it('should return backup details for SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      const mockBackup = {
        id: '1',
        filename: 'backup-1.json',
        type: 'MANUAL',
        status: 'COMPLETED',
        fileSize: 1024,
        createdAt: new Date('2024-01-01'),
        createdBy: {
          id: '1',
          name: 'Super Admin',
          email: 'super@example.com',
        },
      }

      ;(prisma.backup.findUnique as any).mockResolvedValue(mockBackup)

      const request = new NextRequest('http://localhost:3000/api/admin/backup/1')
      const response = await GET(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.backup.id).toBe('1')
      expect(data.backup.filename).toBe('backup-1.json')
    })
  })

  describe('DELETE /api/admin/backup/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/backup/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 if user is not SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/backup/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
    })

    it('should return 404 if backup not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      ;(prisma.backup.findUnique as any).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/backup/999', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: { id: '999' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Backup not found')
    })

    it('should delete backup successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      const mockBackup = {
        id: '1',
        filename: 'backup-1.json',
        fileUrl: 'https://cloudinary.com/backup-1.json',
      }

      ;(prisma.backup.findUnique as any).mockResolvedValue(mockBackup)
      ;(prisma.backup.delete as any).mockResolvedValue(mockBackup)
      ;(cloudinary.uploader.destroy as any).mockResolvedValue({ result: 'ok' })

      const request = new NextRequest('http://localhost:3000/api/admin/backup/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Backup deleted successfully')
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        'ecommerce/backups/backup-1',
        { resource_type: 'raw' }
      )
      expect(prisma.backup.delete).toHaveBeenCalledWith({ where: { id: '1' } })
    })

    it('should delete backup even if Cloudinary deletion fails', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      const mockBackup = {
        id: '1',
        filename: 'backup-1.json',
        fileUrl: 'https://cloudinary.com/backup-1.json',
      }

      ;(prisma.backup.findUnique as any).mockResolvedValue(mockBackup)
      ;(prisma.backup.delete as any).mockResolvedValue(mockBackup)
      ;(cloudinary.uploader.destroy as any).mockRejectedValue(new Error('Cloudinary error'))

      const request = new NextRequest('http://localhost:3000/api/admin/backup/1', {
        method: 'DELETE',
      })
      const response = await DELETE(request, { params: { id: '1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Backup deleted successfully')
      expect(prisma.backup.delete).toHaveBeenCalled()
    })
  })
})
