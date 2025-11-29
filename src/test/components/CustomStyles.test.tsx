import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { CustomStyles } from '@/components/CustomStyles'
import { SettingsContext } from '@/contexts/SettingsContext'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { role: 'CUSTOMER' } }, status: 'authenticated' }),
}))

const mockSettings = {
  appearance_custom_css: 'body { color: red; }',
}

describe('CustomStyles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clean up any existing styles
    const existingStyle = document.getElementById('custom-store-styles')
    if (existingStyle) {
      document.head.removeChild(existingStyle)
    }
  })

  it('renders without crashing', () => {
    render(
      <SettingsContext.Provider value={{ settings: mockSettings, loading: false, refreshSettings: vi.fn() }}>
        <CustomStyles />
      </SettingsContext.Provider>
    )
    // Component returns null, so we just check it doesn't throw
    expect(true).toBe(true)
  })

  it('injects custom CSS when provided', () => {
    render(
      <SettingsContext.Provider value={{ settings: mockSettings, loading: false, refreshSettings: vi.fn() }}>
        <CustomStyles />
      </SettingsContext.Provider>
    )
    
    const style = document.getElementById('custom-store-styles')
    expect(style).toBeInTheDocument()
    expect(style?.textContent).toBe('body { color: red; }')
  })
})
