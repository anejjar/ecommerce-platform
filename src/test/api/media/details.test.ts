import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, PATCH, DELETE } from '@/app/api/media/[id]/route'
import { NextRequest } from 'next/server'

// Mock NextAuth
vi.mock('next-auth/next', () => ({
    getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        mediaLibrary: {
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}))

// Mock Cloudinary
vi.mock('@/lib/cloudinary', () => ({
    deleteFromCloudinary: vi.fn(),
}))

import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { deleteFromCloudinary } from '@/lib/cloudinary'

const mockGetServerSession = getServerSession as any

describe('Media Details API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('GET /api/media/[id]', () => {
        it('should return 401 if not authenticated', async () => {
            mockGetServerSession.mockResolvedValue(null)
            const request = new NextRequest('http://localhost:3000/api/media/1')
            const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
            const data = await response.json()
            expect(response.status).toBe(401)
            expect(data.error).toBe('Unauthorized')
        })

        it('should return 404 if media not found', async () => {
            mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
                ; (prisma.mediaLibrary.findUnique as any).mockResolvedValue(null)
            const request = new NextRequest('http://localhost:3000/api/media/1')
            const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
            expect(response.status).toBe(404)
        })

        it('should return media details', async () => {
            mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
            const mockMedia = { id: '1', filename: 'test.jpg' }
                ; (prisma.mediaLibrary.findUnique as any).mockResolvedValue(mockMedia)
            const request = new NextRequest('http://localhost:3000/api/media/1')
            const response = await GET(request, { params: Promise.resolve({ id: '1' }) })
            const data = await response.json()
            expect(response.status).toBe(200)
            expect(data).toEqual(mockMedia)
        })
    })

    describe('PATCH /api/media/[id]', () => {
        it('should update media metadata', async () => {
            mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
            const mockUpdatedMedia = { id: '1', filename: 'test.jpg', altText: 'Updated' }
                ; (prisma.mediaLibrary.update as any).mockResolvedValue(mockUpdatedMedia)

            const request = new NextRequest('http://localhost:3000/api/media/1', {
                method: 'PATCH',
                body: JSON.stringify({ altText: 'Updated' }),
            })
            const response = await PATCH(request, { params: Promise.resolve({ id: '1' }) })
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.altText).toBe('Updated')
            expect(prisma.mediaLibrary.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: '1' },
                data: expect.objectContaining({ altText: 'Updated' }),
            }))
        })
    })

    describe('DELETE /api/media/[id]', () => {
        it('should delete media from db and cloudinary', async () => {
            mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
            const mockMedia = { id: '1', publicId: 'test_public_id' }
                ; (prisma.mediaLibrary.findUnique as any).mockResolvedValue(mockMedia)
                ; (prisma.mediaLibrary.delete as any).mockResolvedValue(mockMedia)

            const request = new NextRequest('http://localhost:3000/api/media/1', {
                method: 'DELETE',
            })
            const response = await DELETE(request, { params: Promise.resolve({ id: '1' }) })
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(deleteFromCloudinary).toHaveBeenCalledWith('test_public_id')
            expect(prisma.mediaLibrary.delete).toHaveBeenCalledWith({ where: { id: '1' } })
        })
    })
})
