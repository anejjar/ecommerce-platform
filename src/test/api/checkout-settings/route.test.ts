import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/checkout-settings/route'
import { NextRequest } from 'next/server'
import { mockPrisma, resetAllMocks } from '@/test/helpers/mocks'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

describe('Checkout Settings API', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  describe('GET /api/checkout-settings', () => {
    it('should return existing checkout settings', async () => {
      const mockSettings = {
        id: 'settings-1',
        showPhoneField: true,
        requirePhone: false,
        showCompanyField: true,
        showAddressLine2: true,
        enableOrderNotes: true,
        orderNotesLabel: 'Order Notes',
        checkoutBanner: 'Welcome!',
        bannerType: 'info',
        thankYouMessage: 'Thank you for your order!',
        defaultShippingCost: 10.0,
        freeShippingThreshold: 50.0,
        allowGuestCheckout: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.checkoutSettings.findFirst.mockResolvedValue(mockSettings)

      const request = new NextRequest('http://localhost:3000/api/checkout-settings')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('settings-1')
      expect(data.showPhoneField).toBe(true)
      expect(mockPrisma.checkoutSettings.findFirst).toHaveBeenCalled()
    })

    it('should create default settings if none exist', async () => {
      mockPrisma.checkoutSettings.findFirst.mockResolvedValue(null)

      const mockCreatedSettings = {
        id: 'settings-new',
        showPhoneField: true,
        requirePhone: false,
        showCompanyField: false,
        showAddressLine2: true,
        enableOrderNotes: false,
        orderNotesLabel: null,
        checkoutBanner: null,
        bannerType: null,
        thankYouMessage: null,
        defaultShippingCost: 0,
        freeShippingThreshold: null,
        allowGuestCheckout: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.checkoutSettings.create.mockResolvedValue(mockCreatedSettings)

      const request = new NextRequest('http://localhost:3000/api/checkout-settings')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('settings-new')
      expect(mockPrisma.checkoutSettings.create).toHaveBeenCalledWith({
        data: {},
      })
    })

    it('should handle database errors', async () => {
      mockPrisma.checkoutSettings.findFirst.mockRejectedValue(new Error('DB Error'))

      const request = new NextRequest('http://localhost:3000/api/checkout-settings')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch checkout settings')
    })

    it('should handle error when creating default settings fails', async () => {
      mockPrisma.checkoutSettings.findFirst.mockResolvedValue(null)
      mockPrisma.checkoutSettings.create.mockRejectedValue(new Error('Create failed'))

      const request = new NextRequest('http://localhost:3000/api/checkout-settings')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch checkout settings')
    })
  })
})

