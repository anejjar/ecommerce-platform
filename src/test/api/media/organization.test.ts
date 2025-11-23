import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET as GET_FOLDERS, POST as POST_FOLDERS } from '@/app/api/media/folders/route'
import { GET as GET_TAGS, POST as POST_TAGS } from '@/app/api/media/tags/route'
import { NextRequest } from 'next/server'

// Mock NextAuth
vi.mock('next-auth/next', () => ({
    getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        mediaFolder: {
            findMany: vi.fn(),
            create: vi.fn(),
        },
        mediaTag: {
            findMany: vi.fn(),
            upsert: vi.fn(),
        },
    },
}))

import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

const mockGetServerSession = getServerSession as any

describe('Media Organization API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Folders API', () => {
        it('should list folders', async () => {
            mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
            const mockFolders = [
                { id: '1', name: 'Folder 1', parentId: null },
                { id: '2', name: 'Folder 2', parentId: '1' },
            ]
                ; (prisma.mediaFolder.findMany as any).mockResolvedValue(mockFolders)

            const request = new NextRequest('http://localhost:3000/api/media/folders')
            const response = await GET_FOLDERS(request)
            const data = await response.json()

            expect(response.status).toBe(200)
            // The API returns a tree structure, so we expect root folders
            expect(data).toHaveLength(1) // Folder 1
            expect(data[0].children).toHaveLength(1) // Folder 2
        })

        it('should create a folder', async () => {
            mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
            const mockFolder = { id: '1', name: 'New Folder', slug: 'new-folder' }
                ; (prisma.mediaFolder.create as any).mockResolvedValue(mockFolder)

            const request = new NextRequest('http://localhost:3000/api/media/folders', {
                method: 'POST',
                body: JSON.stringify({ name: 'New Folder' }),
            })
            const response = await POST_FOLDERS(request)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toEqual(mockFolder)
            expect(prisma.mediaFolder.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ name: 'New Folder', slug: 'new-folder' }),
            }))
        })
    })

    describe('Tags API', () => {
        it('should list tags', async () => {
            mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
            const mockTags = [{ id: '1', name: 'Tag 1' }]
                ; (prisma.mediaTag.findMany as any).mockResolvedValue(mockTags)

            const request = new NextRequest('http://localhost:3000/api/media/tags')
            const response = await GET_TAGS(request)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toHaveLength(1)
        })

        it('should create a tag', async () => {
            mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } })
            const mockTag = { id: '1', name: 'New Tag', slug: 'new-tag' }
                ; (prisma.mediaTag.upsert as any).mockResolvedValue(mockTag)

            const request = new NextRequest('http://localhost:3000/api/media/tags', {
                method: 'POST',
                body: JSON.stringify({ name: 'New Tag' }),
            })
            const response = await POST_TAGS(request)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toEqual(mockTag)
            expect(prisma.mediaTag.upsert).toHaveBeenCalledWith(expect.objectContaining({
                where: { name: 'New Tag' },
                create: expect.objectContaining({ name: 'New Tag', slug: 'new-tag' }),
            }))
        })
    })
})
