#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

const componentsDir = path.join(__dirname, '../src/components')
const testDir = path.join(__dirname, '../src/test/components')

function findComponents(dir: string, base = ''): string[] {
  const components: string[] = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relativePath = path.join(base, item.name)

    if (item.isDirectory()) {
      components.push(...findComponents(fullPath, relativePath))
    } else if (item.name.endsWith('.tsx') && !item.name.includes('.test.') && !item.name.includes('.spec.')) {
      components.push(path.join(base, item.name.replace('.tsx', '')))
    }
  }

  return components
}

function generateComponentTest(componentPath: string): string {
  const componentName = path.basename(componentPath)
  const isAdminComponent = componentPath.includes('admin')

  return `import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ${componentName} from '@/components/${componentPath}'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: '${isAdminComponent ? 'ADMIN' : 'CUSTOMER'}' } }, status: 'authenticated' }),
}))

describe('${componentName}', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<${componentName} />)
    expect(screen.getByRole).toBeDefined()
  })
})
`
}

const components = findComponents(componentsDir)
console.log(`Found ${components.length} components`)

for (const component of components) {
  const testPath = path.join(testDir, component + '.test.tsx')
  const testDirPath = path.dirname(testPath)

  if (!fs.existsSync(testPath)) {
    fs.mkdirSync(testDirPath, { recursive: true })
    fs.writeFileSync(testPath, generateComponentTest(component))
    console.log(`✓ Created ${testPath}`)
  }
}

console.log(`\\n✓ Generated tests for ${components.length} components`)
