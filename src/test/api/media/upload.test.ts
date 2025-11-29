import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/media/upload/route'
import { NextRequest } from 'next/server'

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

// Mock Cloudinary
vi.mock('@/lib/cloudinary', () => ({
    uploadToCloudinary: vi.fn(),
}))

import { mockPrisma, mockAdminSession, resetAllMocks } from '@/test/helpers/mocks'
import { getServerSession } from 'next-auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

const mockGetServerSession = getServerSession as any

describe('Media Upload API', () => {
    beforeEach(() => {
        resetAllMocks()
    })

    it('should return 401 if not authenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)

        const formData = new FormData()
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
        formData.append('file', file)

        const request = new NextRequest('http://localhost:3000/api/media/upload', {
            method: 'POST',
            body: formData,
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 if no file provided', async () => {
        mockGetServerSession.mockResolvedValue(mockAdminSession)

        const formData = new FormData()
        // No file appended

        const request = new NextRequest('http://localhost:3000/api/media/upload', {
            method: 'POST',
            body: formData,
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('No file provided')
    })

    it('should upload file and create database record', async () => {
        mockGetServerSession.mockResolvedValue(mockAdminSession)

        const mockCloudinaryResult = {
            public_id: 'test_id',
            url: 'http://cloudinary.com/test.jpg',
            secure_url: 'https://cloudinary.com/test.jpg',
            bytes: 1024,
            resource_type: 'image',
            version: 1,
            format: 'jpg',
            width: 100,
            height: 100,
        }

        ;(uploadToCloudinary as any).mockResolvedValue(mockCloudinaryResult)

        const mockMedia = {
            id: 'media_1',
            filename: 'test.jpg',
            ...mockCloudinaryResult,
        }

        mockPrisma.mediaLibrary.create.mockResolvedValue(mockMedia)
        mockPrisma.activityLog.create.mockResolvedValue({ id: 'log-1' })

        const formData = new FormData()
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
        formData.append('file', file)

        const request = new NextRequest('http://localhost:3000/api/media/upload', {
            method: 'POST',
            body: formData,
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockMedia)
        expect(uploadToCloudinary).toHaveBeenCalled()

        // Check that prisma.create was called with the correct structure
        // Note: In test environment, File.name may be 'blob' instead of 'test.jpg'
        const createCall = mockPrisma.mediaLibrary.create.mock.calls[0][0]
        expect(createCall.data.uploadedById).toBe('admin-id')
        expect(createCall.data.mimeType).toBe('image/jpeg')
        expect(['test.jpg', 'blob']).toContain(createCall.data.filename)
    })

    it('should handle upload errors', async () => {
        mockGetServerSession.mockResolvedValue(mockAdminSession)

            ; (uploadToCloudinary as any).mockRejectedValue(new Error('Cloudinary error'))

        const formData = new FormData()
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
        formData.append('file', file)

        const request = new NextRequest('http://localhost:3000/api/media/upload', {
            method: 'POST',
            body: formData,
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('Upload failed')
    })
})
