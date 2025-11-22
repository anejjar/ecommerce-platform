import { render, screen, waitFor } from '@testing-library/react'
import { DashboardContent } from '@/components/admin/DashboardContent'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

// Mock next/image
vi.mock('next/image', () => ({
    default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
    DollarSign: () => <div data-testid="icon-dollar" />,
    ShoppingCart: () => <div data-testid="icon-cart" />,
    Users: () => <div data-testid="icon-users" />,
    Package: () => <div data-testid="icon-package" />,
    TrendingUp: () => <div data-testid="icon-trending" />,
    AlertCircle: () => <div data-testid="icon-alert" />,
    Clock: () => <div data-testid="icon-clock" />,
    Star: () => <div data-testid="icon-star" />,
    User: () => <div data-testid="icon-user" />,
}))

// Mock recharts
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AreaChart: () => <div data-testid="area-chart" />,
    Area: () => null,
    PieChart: () => <div data-testid="pie-chart" />,
    Pie: () => null,
    Cell: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
    ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ChartTooltip: () => null,
    ChartTooltipContent: () => null,
    ChartLegend: () => null,
    ChartLegendContent: () => null,
}))

// Mock UI components
vi.mock('@/components/ui/card', () => ({
    Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
    CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/ui/badge', () => ({
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

vi.mock('@/components/ui/chart', () => ({
    ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ChartTooltip: () => null,
    ChartTooltipContent: () => null,
    ChartLegend: () => null,
    ChartLegendContent: () => null,
}))

const mockDashboardData = {
    summary: {
        totalRevenue: 15000,
        monthRevenue: 5000,
        weekRevenue: 1200,
        totalOrders: 150,
        monthOrders: 50,
        totalCustomers: 100,
        newCustomers: 10,
        totalProducts: 50,
        lowStockProducts: 2,
        pendingOrders: 8,
        outOfStockProducts: 7,
        averageOrderValue: 100,
    },
    recentOrders: [
        {
            id: '1',
            orderNumber: 'ORD-001',
            total: '150.00',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            user: { name: 'John Doe', email: 'john@example.com' },
        },
    ],
    topProducts: [
        {
            name: 'Product A',
            slug: 'product-a',
            price: '50.00',
            totalSold: 20,
            revenue: 1000,
        },
    ],
    salesByDay: [
        { date: new Date().toISOString(), revenue: 500, orders: 5 },
    ],
    ordersByStatus: [
        { status: 'PENDING', _count: { id: 5 } },
    ],
    recentReviews: [
        {
            id: '1',
            rating: 5,
            comment: 'Great product!',
            createdAt: new Date().toISOString(),
            user: { name: 'Jane Doe', image: null },
            product: { name: 'Product A', slug: 'product-a', images: [] },
        },
    ],
    topCustomers: [
        {
            id: '1',
            name: 'Top Customer',
            email: 'top@example.com',
            image: null,
            totalSpend: 5000,
            totalOrders: 10,
        },
    ],
}

describe('DashboardContent', () => {
    beforeEach(() => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockDashboardData),
            })
        ) as any
    })

    it('renders dashboard stats correctly', async () => {
        render(<DashboardContent />)

        // Wait for data to load
        await waitFor(() => expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument())

        expect(screen.getByText('Total Revenue')).toBeInTheDocument()
        expect(screen.getByText('$15,000')).toBeInTheDocument()

        expect(screen.getByText('Total Orders')).toBeInTheDocument()
        expect(screen.getByText('150')).toBeInTheDocument()

        expect(screen.getByText('Avg. Order Value')).toBeInTheDocument()
        expect(screen.getByText('$100.00')).toBeInTheDocument()

        expect(screen.getByText('Pending Orders')).toBeInTheDocument()
        expect(screen.getByText('8')).toBeInTheDocument()

        expect(screen.getByText('Out of Stock')).toBeInTheDocument()
        expect(screen.getByText('7')).toBeInTheDocument()
    })

    it('renders recent orders', async () => {
        render(<DashboardContent />)
        await waitFor(() => expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument())

        expect(screen.getByText('Recent Orders')).toBeInTheDocument()
        expect(screen.getByText('ORD-001')).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('renders top products', async () => {
        render(<DashboardContent />)
        await waitFor(() => expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument())

        expect(screen.getByText('Top Selling Products')).toBeInTheDocument()
        expect(screen.getByText('Product A')).toBeInTheDocument()
    })

    it('renders recent reviews', async () => {
        render(<DashboardContent />)
        await waitFor(() => expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument())

        expect(screen.getByText('Recent Reviews')).toBeInTheDocument()
        expect(screen.getByText('"Great product!"')).toBeInTheDocument()
        expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    })

    it('renders top customers', async () => {
        render(<DashboardContent />)
        await waitFor(() => expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument())

        expect(screen.getByText('Top Customers')).toBeInTheDocument()
        expect(screen.getByText('Top Customer')).toBeInTheDocument()
        expect(screen.getByText('$5,000.00')).toBeInTheDocument()
    })
})
