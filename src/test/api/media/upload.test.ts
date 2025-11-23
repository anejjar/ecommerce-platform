import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/media/upload/route'
import { NextRequest } from 'next/server'

// Mock NextAuth
vi.mock('next-auth/next', () => ({
    getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        mediaLibrary: {
            create: vi.fn(),
        },
    },
}))

// Mock Cloudinary
vi.mock('@/lib/cloudinary', () => ({
    uploadToCloudinary: vi.fn(),
}))

import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'

const mockGetServerSession = getServerSession as any

describe('Media Upload API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
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
        mockGetServerSession.mockResolvedValue({
            user: { id: '1', role: 'ADMIN' },
        })

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
        mockGetServerSession.mockResolvedValue({
            user: { id: '1', role: 'ADMIN' },
        })

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

            ; (uploadToCloudinary as any).mockResolvedValue(mockCloudinaryResult)

        const mockMedia = {
            id: 'media_1',
            filename: 'test.jpg',
            ...mockCloudinaryResult,
        }

            ; (prisma.mediaLibrary.create as any).mockResolvedValue(mockMedia)

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
        const createCall = (prisma.mediaLibrary.create as any).mock.calls[0][0]
        expect(createCall.data.uploadedById).toBe('1')
        expect(createCall.data.mimeType).toBe('image/jpeg')
        expect(['test.jpg', 'blob']).toContain(createCall.data.filename)
    })

    it('should handle upload errors', async () => {
        mockGetServerSession.mockResolvedValue({
            user: { id: '1', role: 'ADMIN' },
        })

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
