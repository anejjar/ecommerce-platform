#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

const apiDir = path.join(__dirname, '../src/app/api')
const testDir = path.join(__dirname, '../src/test/api')

function findRoutes(dir: string, base = ''): string[] {
  const routes: string[] = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relativePath = path.join(base, item.name)

    if (item.isDirectory()) {
      routes.push(...findRoutes(fullPath, relativePath))
    } else if (item.name === 'route.ts') {
      routes.push(base)
    }
  }

  return routes
}

function generateTestTemplate(routePath: string): string {
  const methods = ['GET', 'POST', 'PATCH', 'DELETE']
  const isAdmin = routePath.includes('/admin/')
  const isDynamic = routePath.includes('[')

  return `import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { mockPrisma, mockAdminSession, mockCustomerSession, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('next-auth')

describe('${routePath}', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('returns 401 for unauthorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const req = new NextRequest('http://localhost${routePath}')

    // Test first available method
    const { GET } = await import('@/app/api${routePath}/route')
    if (GET) {
      const response = await GET(req${isDynamic ? ', { params: Promise.resolve({ id: "test-id" }) }' : ''})
      expect(response.status).toBe(401)
    }
  })

  it('handles authorized requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(${isAdmin ? 'mockAdminSession' : 'mockCustomerSession'})
    mockPrisma.product = mockPrisma.product || {}
    Object.keys(mockPrisma).forEach(key => {
      if (mockPrisma[key].findMany) mockPrisma[key].findMany.mockResolvedValue([])
      if (mockPrisma[key].findUnique) mockPrisma[key].findUnique.mockResolvedValue(null)
      if (mockPrisma[key].create) mockPrisma[key].create.mockResolvedValue({ id: 'test-id' })
      if (mockPrisma[key].update) mockPrisma[key].update.mockResolvedValue({ id: 'test-id' })
      if (mockPrisma[key].delete) mockPrisma[key].delete.mockResolvedValue({ id: 'test-id' })
    })

    const req = new NextRequest('http://localhost${routePath}')
    const { GET } = await import('@/app/api${routePath}/route')
    if (GET) {
      const response = await GET(req${isDynamic ? ', { params: Promise.resolve({ id: "test-id" }) }' : ''})
      expect([200, 404]).toContain(response.status)
    }
  })
})
`
}

const routes = findRoutes(apiDir)
console.log(`Found ${routes.length} API routes`)

for (const route of routes) {
  const testPath = path.join(testDir, route + '.test.ts')
  const testDirPath = path.dirname(testPath)

  if (!fs.existsSync(testPath)) {
    fs.mkdirSync(testDirPath, { recursive: true })
    fs.writeFileSync(testPath, generateTestTemplate(route))
    console.log(`✓ Created ${testPath}`)
  }
}

console.log(`\\n✓ Generated tests for ${routes.length} routes`)
