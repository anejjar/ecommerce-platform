import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, PATCH, DELETE } from '@/app/api/admin/popups/[id]/route'
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

import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as any

describe('Admin Popups API - [id] Route', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  describe('GET /api/admin/popups/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123')
      const response = await GET(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 if popup not found', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)
      mockPrisma.popup.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123')
      const response = await GET(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Popup not found')
    })

    it('should return popup with analytics', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const mockPopup = {
        id: 'popup-123',
        name: 'Test Popup',
        title: 'Test Title',
        content: 'Test content',
        type: 'EXIT_INTENT',
        isActive: true,
        analytics: [
          {
            id: 'analytics-1',
            date: new Date(),
            views: 100,
            clicks: 10,
            conversions: 5,
            dismissals: 5,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.popup.findUnique.mockResolvedValue(mockPopup)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123')
      const response = await GET(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('popup-123')
      expect(data.analytics).toHaveLength(1)
      expect(mockPrisma.popup.findUnique).toHaveBeenCalledWith({
        where: { id: 'popup-123' },
        include: {
          analytics: {
            orderBy: { date: 'desc' },
            take: 30,
          },
        },
      })
    })
  })

  describe('PATCH /api/admin/popups/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated Name' }),
      })

      const response = await PATCH(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 if popup not found', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)
      mockPrisma.popup.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated Name' }),
      })

      const response = await PATCH(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Popup not found')
    })

    it('should update popup successfully', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const existingPopup = {
        id: 'popup-123',
        name: 'Test Popup',
        content: 'Test content',
      }

      const updatedPopup = {
        ...existingPopup,
        name: 'Updated Name',
        title: 'Updated Title',
        isActive: false,
      }

      mockPrisma.popup.findUnique.mockResolvedValue(existingPopup)
      mockPrisma.popup.update.mockResolvedValue(updatedPopup)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123', {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Name',
          title: 'Updated Title',
          isActive: false,
        }),
      })

      const response = await PATCH(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Updated Name')
      expect(data.title).toBe('Updated Title')
      expect(data.isActive).toBe(false)
      expect(mockPrisma.popup.update).toHaveBeenCalled()
    })

    it('should only update provided fields', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const existingPopup = {
        id: 'popup-123',
        name: 'Test Popup',
        content: 'Test content',
        isActive: true,
      }

      mockPrisma.popup.findUnique.mockResolvedValue(existingPopup)
      mockPrisma.popup.update.mockResolvedValue({
        ...existingPopup,
        isActive: false,
      })

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123', {
        method: 'PATCH',
        body: JSON.stringify({
          isActive: false,
        }),
      })

      const response = await PATCH(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })

      expect(response.status).toBe(200)
      const updateCall = mockPrisma.popup.update.mock.calls[0][0]
      expect(updateCall.data).toEqual({ isActive: false })
    })
  })

  describe('DELETE /api/admin/popups/[id]', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123', {
        method: 'DELETE',
      })

      const response = await DELETE(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 if popup not found', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)
      mockPrisma.popup.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123', {
        method: 'DELETE',
      })

      const response = await DELETE(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Popup not found')
    })

    it('should delete popup successfully', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const existingPopup = {
        id: 'popup-123',
        name: 'Test Popup',
      }

      mockPrisma.popup.findUnique.mockResolvedValue(existingPopup)
      mockPrisma.popup.delete.mockResolvedValue(existingPopup)

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123', {
        method: 'DELETE',
      })

      const response = await DELETE(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Popup deleted successfully')
      expect(mockPrisma.popup.delete).toHaveBeenCalledWith({
        where: { id: 'popup-123' },
      })
    })

    it('should handle database errors', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)
      mockPrisma.popup.findUnique.mockResolvedValue({ id: 'popup-123' })
      mockPrisma.popup.delete.mockRejectedValue(new Error('DB Error'))

      const request = new NextRequest('http://localhost:3000/api/admin/popups/popup-123', {
        method: 'DELETE',
      })

      const response = await DELETE(request, {
        params: Promise.resolve({ id: 'popup-123' }),
      })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})

