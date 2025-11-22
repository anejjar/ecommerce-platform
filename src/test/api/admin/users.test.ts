import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/admin/users/route'
import { NextRequest } from 'next/server'

// Mock NextAuth
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}))

// Mock feature flags
vi.mock('@/lib/features', () => ({
  isFeatureEnabled: vi.fn(() => Promise.resolve(true)),
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

describe('Admin Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/admin/users - List Admin Users', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/users')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 if user is not SUPERADMIN or ADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'MANAGER', email: 'manager@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/users')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
    })

    it('should return list of admin users for SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      const mockUsers = [
        {
          id: '1',
          name: 'Super Admin',
          email: 'super@example.com',
          role: 'SUPERADMIN',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Manager User',
          email: 'manager@example.com',
          role: 'MANAGER',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
      ]

      ;(prisma.user.findMany as any).mockResolvedValue(mockUsers)
      ;(prisma.user.count as any).mockResolvedValue(2)

      const request = new NextRequest('http://localhost:3000/api/admin/users')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.users).toHaveLength(2)
      expect(data.total).toBe(2)
      expect(data.users[0].email).toBe('super@example.com')
      expect(data.users[0]).not.toHaveProperty('password')
    })

    it('should support pagination', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      ;(prisma.user.findMany as any).mockResolvedValue([])
      ;(prisma.user.count as any).mockResolvedValue(50)

      const request = new NextRequest('http://localhost:3000/api/admin/users?page=2&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })

    it('should filter by role', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      ;(prisma.user.findMany as any).mockResolvedValue([])
      ;(prisma.user.count as any).mockResolvedValue(5)

      const request = new NextRequest('http://localhost:3000/api/admin/users?role=MANAGER')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: 'MANAGER',
          }),
        })
      )
    })
  })

  describe('POST /api/admin/users - Create Admin User', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email: 'new@example.com', role: 'MANAGER' }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 if user cannot manage ADMIN_USER', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'EDITOR', email: 'editor@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email: 'new@example.com', role: 'MANAGER' }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions')
    })

    it('should create a new admin user', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      const newUser = {
        id: '3',
        name: 'New Manager',
        email: 'newmanager@example.com',
        role: 'MANAGER',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(prisma.user.findUnique as any).mockResolvedValue(null)
      ;(prisma.user.create as any).mockResolvedValue(newUser)

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Manager',
          email: 'newmanager@example.com',
          role: 'MANAGER',
          password: 'SecurePass123!',
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.user.email).toBe('newmanager@example.com')
      expect(data.user).not.toHaveProperty('password')
    })

    it('should return 400 if email already exists', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      ;(prisma.user.findUnique as any).mockResolvedValue({ id: '2', email: 'existing@example.com' })

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          role: 'MANAGER',
          password: 'SecurePass123!',
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email already exists')
    })

    it('should validate required fields', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'SUPERADMIN', email: 'super@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email: 'incomplete@example.com' }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('required')
    })

    it('should prevent creating SUPERADMIN by non-SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'ADMIN', email: 'admin@example.com' },
      })

      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newsuperadmin@example.com',
          role: 'SUPERADMIN',
          password: 'SecurePass123!',
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Only SUPERADMIN can create SUPERADMIN users')
    })
  })
})
