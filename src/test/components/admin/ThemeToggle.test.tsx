import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/admin/ThemeToggle'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockSetTheme = vi.fn()

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    theme: 'light',
  }),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Sun: () => <div data-testid="icon-sun" />,
  Moon: () => <div data-testid="icon-moon" />,
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('renders theme toggle button', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument()
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument()
  })

  it('shows theme options on click', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('sets theme to light when light option is clicked', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const lightOption = screen.getByText('Light')
    fireEvent.click(lightOption)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('sets theme to dark when dark option is clicked', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const darkOption = screen.getByText('Dark')
    fireEvent.click(darkOption)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('sets theme to system when system option is clicked', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const systemOption = screen.getByText('System')
    fireEvent.click(systemOption)

    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })
})
