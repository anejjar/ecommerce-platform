import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { CustomScripts } from '@/components/CustomScripts'
import { SettingsContext } from '@/contexts/SettingsContext'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

vi.mock('next/script', () => ({
  default: ({ children, ...props }: any) => <script {...props}>{children}</script>,
}))

const mockSettings = {
  seo_google_analytics_id: 'GA-123456',
  social_facebook_pixel_id: 'FB-123456',
  appearance_custom_js: 'console.log("test");',
}

describe('CustomScripts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(
      <SettingsContext.Provider value={{ settings: mockSettings, loading: false, refreshSettings: vi.fn() }}>
        <CustomScripts />
      </SettingsContext.Provider>
    )
    // Component renders scripts, so we just check it doesn't throw
    expect(true).toBe(true)
  })
})
