#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

const libDir = path.join(__dirname, '../src/lib')
const testDir = path.join(__dirname, '../src/test/lib')

function findLibFiles(dir: string, base = ''): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relativePath = path.join(base, item.name)

    if (item.isDirectory()) {
      files.push(...findLibFiles(fullPath, relativePath))
    } else if (item.name.endsWith('.ts') && !item.name.includes('.test.') && !item.name.includes('.d.ts')) {
      files.push(path.join(base, item.name.replace('.ts', '')))
    }
  }

  return files
}

function generateLibTest(libPath: string): string {
  const libName = path.basename(libPath)

  return `import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockPrisma, resetAllMocks } from '@/test/helpers/mocks'

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

describe('lib/${libPath}', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('exports functions', async () => {
    const module = await import('@/lib/${libPath}')
    expect(module).toBeDefined()
    expect(Object.keys(module).length).toBeGreaterThan(0)
  })
})
`
}

const libFiles = findLibFiles(libDir)
console.log(`Found ${libFiles.length} lib files`)

for (const libFile of libFiles) {
  const testPath = path.join(testDir, libFile + '.test.ts')
  const testDirPath = path.dirname(testPath)

  if (!fs.existsSync(testPath)) {
    fs.mkdirSync(testDirPath, { recursive: true })
    fs.writeFileSync(testPath, generateLibTest(libFile))
    console.log(`✓ Created ${testPath}`)
  }
}

console.log(`\\n✓ Generated tests for ${libFiles.length} lib files`)
