import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/admin/popups/route'
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

import { getServerSession } from 'next-auth'

const mockGetServerSession = getServerSession as any

describe('Admin Popups API - Route', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  describe('GET /api/admin/popups', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/popups')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 401 if user is not ADMIN or SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', role: 'CUSTOMER', email: 'customer@example.com' },
      } as any)

      const request = new NextRequest('http://localhost:3000/api/admin/popups')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return list of popups for ADMIN', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const mockPopups = [
        {
          id: 'popup-1',
          name: 'Test Popup 1',
          title: 'Test Title',
          content: 'Test content',
          type: 'EXIT_INTENT',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { analytics: 10 },
        },
        {
          id: 'popup-2',
          name: 'Test Popup 2',
          title: 'Test Title 2',
          content: 'Test content 2',
          type: 'TIMED',
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { analytics: 5 },
        },
      ]

      mockPrisma.popup.findMany.mockResolvedValue(mockPopups)

      const request = new NextRequest('http://localhost:3000/api/admin/popups')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
      expect(data[0].id).toBe('popup-1')
      expect(mockPrisma.popup.findMany).toHaveBeenCalled()
    })

    it('should return list of popups for SUPERADMIN', async () => {
      mockGetServerSession.mockResolvedValue(mockSuperAdminSession)

      mockPrisma.popup.findMany.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/admin/popups')
      const response = await GET(request)

      expect(response.status).toBe(200)
    })

    it('should handle database errors', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)
      mockPrisma.popup.findMany.mockRejectedValue(new Error('DB Error'))

      const request = new NextRequest('http://localhost:3000/api/admin/popups')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('POST /api/admin/popups', () => {
    it('should return 401 if not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/popups', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Popup',
          content: 'Test content',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 if name is missing', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const request = new NextRequest('http://localhost:3000/api/admin/popups', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Test content',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name and content are required')
    })

    it('should return 400 if content is missing', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const request = new NextRequest('http://localhost:3000/api/admin/popups', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Popup',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name and content are required')
    })

    it('should create popup successfully', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const popupData = {
        name: 'Test Popup',
        title: 'Test Title',
        content: 'Test content',
        type: 'EXIT_INTENT',
        target: 'ALL_PAGES',
        position: 'CENTER',
        width: 500,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        buttonText: 'Get Offer',
        buttonColor: '#000000',
        buttonTextColor: '#ffffff',
        isActive: true,
      }

      const mockCreatedPopup = {
        id: 'popup-123',
        ...popupData,
        createdAt: new Date(),
        updatedAt: new Date(),
        triggerValue: null,
        height: null,
        showCloseButton: true,
        overlayColor: 'rgba(0,0,0,0.5)',
        imageUrl: null,
        frequency: 'once_per_session',
        delaySeconds: 0,
        ctaType: 'link',
        ctaUrl: null,
        discountCode: null,
        startDate: null,
        endDate: null,
        priority: 0,
        customUrls: null,
      }

      mockPrisma.popup.create.mockResolvedValue(mockCreatedPopup)

      const request = new NextRequest('http://localhost:3000/api/admin/popups', {
        method: 'POST',
        body: JSON.stringify(popupData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.id).toBe('popup-123')
      expect(data.name).toBe('Test Popup')
      expect(mockPrisma.popup.create).toHaveBeenCalled()
    })

    it('should use default values for optional fields', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)

      const mockCreatedPopup = {
        id: 'popup-456',
        name: 'Test Popup',
        content: 'Test content',
        type: 'EXIT_INTENT',
        target: 'ALL_PAGES',
        position: 'CENTER',
        width: 500,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        buttonText: 'Get Offer',
        buttonColor: '#000000',
        buttonTextColor: '#ffffff',
        showCloseButton: true,
        overlayColor: 'rgba(0,0,0,0.5)',
        imageUrl: null,
        frequency: 'once_per_session',
        delaySeconds: 0,
        ctaType: 'link',
        ctaUrl: null,
        discountCode: null,
        isActive: false,
        startDate: null,
        endDate: null,
        priority: 0,
        customUrls: null,
        triggerValue: null,
        height: null,
        title: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.popup.create.mockResolvedValue(mockCreatedPopup)

      const request = new NextRequest('http://localhost:3000/api/admin/popups', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Popup',
          content: 'Test content',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.type).toBe('EXIT_INTENT')
      expect(data.target).toBe('ALL_PAGES')
      expect(data.position).toBe('CENTER')
    })

    it('should handle database errors', async () => {
      mockGetServerSession.mockResolvedValue(mockAdminSession)
      mockPrisma.popup.create.mockRejectedValue(new Error('DB Error'))

      const request = new NextRequest('http://localhost:3000/api/admin/popups', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Popup',
          content: 'Test content',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})

