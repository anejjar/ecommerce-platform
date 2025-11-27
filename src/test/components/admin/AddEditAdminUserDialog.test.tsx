import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import AddEditAdminUserDialog from '@/components/admin\AddEditAdminUserDialog'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'ADMIN' } }, status: 'authenticated' }),
}))

describe('AddEditAdminUserDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<AddEditAdminUserDialog />)
    expect(screen.getByRole).toBeDefined()
  })
})
