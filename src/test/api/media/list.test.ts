import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/media/route'
import { NextRequest } from 'next/server'

// Mock NextAuth
vi.mock('next-auth/next', () => ({
    getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        mediaLibrary: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
    },
}))

import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

const mockGetServerSession = getServerSession as any

describe('Media List API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return 401 if not authenticated', async () => {
        mockGetServerSession.mockResolvedValue(null)

        const request = new NextRequest('http://localhost:3000/api/media')
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('Unauthorized')
    })

    it('should return list of media with pagination', async () => {
        mockGetServerSession.mockResolvedValue({
            user: { id: '1', role: 'ADMIN' },
        })

        const mockMedia = [
            { id: '1', filename: 'test1.jpg' },
            { id: '2', filename: 'test2.jpg' },
        ]

            ; (prisma.mediaLibrary.findMany as any).mockResolvedValue(mockMedia)
            ; (prisma.mediaLibrary.count as any).mockResolvedValue(2)

        const request = new NextRequest('http://localhost:3000/api/media?page=1&limit=10')
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.media).toHaveLength(2)
        expect(data.pagination.total).toBe(2)
        expect(prisma.mediaLibrary.findMany).toHaveBeenCalledWith(expect.objectContaining({
            skip: 0,
            take: 10,
        }))
    })

    it('should filter by search query', async () => {
        mockGetServerSession.mockResolvedValue({
            user: { id: '1', role: 'ADMIN' },
        })

            ; (prisma.mediaLibrary.findMany as any).mockResolvedValue([])
            ; (prisma.mediaLibrary.count as any).mockResolvedValue(0)

        const request = new NextRequest('http://localhost:3000/api/media?search=test')
        const response = await GET(request)

        expect(response.status).toBe(200)
        expect(prisma.mediaLibrary.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                OR: expect.arrayContaining([
                    { filename: { contains: 'test' } },
                ]),
            }),
        }))
    })

    it('should filter by type', async () => {
        mockGetServerSession.mockResolvedValue({
            user: { id: '1', role: 'ADMIN' },
        })

            ; (prisma.mediaLibrary.findMany as any).mockResolvedValue([])
            ; (prisma.mediaLibrary.count as any).mockResolvedValue(0)

        const request = new NextRequest('http://localhost:3000/api/media?type=IMAGE')
        const response = await GET(request)

        expect(response.status).toBe(200)
        expect(prisma.mediaLibrary.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                type: 'IMAGE',
            }),
        }))
    })

    it('should filter by folder', async () => {
        mockGetServerSession.mockResolvedValue({
            user: { id: '1', role: 'ADMIN' },
        })

            ; (prisma.mediaLibrary.findMany as any).mockResolvedValue([])
            ; (prisma.mediaLibrary.count as any).mockResolvedValue(0)

        const request = new NextRequest('http://localhost:3000/api/media?folderId=folder_1')
        const response = await GET(request)

        expect(response.status).toBe(200)
        expect(prisma.mediaLibrary.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                folderId: 'folder_1',
            }),
        }))
    })
})
