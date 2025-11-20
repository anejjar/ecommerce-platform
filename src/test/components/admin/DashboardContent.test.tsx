import { render, screen, waitFor } from '@testing-library/react';
import { DashboardContent } from '@/components/admin/DashboardContent';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Recharts
vi.mock('recharts', () => {
    const OriginalModule = vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div style={{ width: 800, height: 800 }}>{children}</div>
        ),
        LineChart: ({ children }: { children: React.ReactNode }) => <div>LineChart {children}</div>,
        BarChart: ({ children }: { children: React.ReactNode }) => <div>BarChart {children}</div>,
        PieChart: ({ children }: { children: React.ReactNode }) => <div>PieChart {children}</div>,
        Line: () => <div>Line</div>,
        Bar: () => <div>Bar</div>,
        Pie: () => <div>Pie</div>,
        Cell: () => <div>Cell</div>,
        XAxis: () => <div>XAxis</div>,
        YAxis: () => <div>YAxis</div>,
        CartesianGrid: () => <div>CartesianGrid</div>,
        Tooltip: () => <div>Tooltip</div>,
        Legend: () => <div>Legend</div>,
    };
});

// Mock global fetch
global.fetch = vi.fn(() => new Promise(() => { })) as any;

const mockDashboardData = {
    summary: {
        totalRevenue: 15000,
        monthRevenue: 5000,
        weekRevenue: 1200,
        totalOrders: 150,
        monthOrders: 45,
        totalCustomers: 80,
        newCustomers: 12,
        totalProducts: 50,
        lowStockProducts: 2,
    },
    recentOrders: [
        {
            id: 'order-1',
            orderNumber: 'ORD-001',
            total: '120.00',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            user: { name: 'John Doe', email: 'john@example.com' },
        },
    ],
    topProducts: [
        {
            name: 'Test Product',
            slug: 'test-product',
            price: '99.99',
            totalSold: 10,
            revenue: 999.90,
        },
    ],
    salesByDay: [],
    ordersByStatus: [
        { status: 'PENDING', _count: { id: 5 } },
    ],
};

describe('DashboardContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        // Mock fetch to return a pending promise for this test to ensure loading state persists
        global.fetch = vi.fn(() => new Promise(() => { })) as any;
        render(<DashboardContent />);
        expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('renders dashboard data after fetch', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockDashboardData,
        }) as any;

        render(<DashboardContent />);

        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
        });

        expect(screen.getByText('$15,000')).toBeInTheDocument(); // Total Revenue
        expect(screen.getByText('150')).toBeInTheDocument(); // Total Orders
        expect(screen.getByText('80')).toBeInTheDocument(); // Total Customers
        expect(screen.getByText('50')).toBeInTheDocument(); // Total Products
        expect(screen.getByText('2 low stock')).toBeInTheDocument();
    });

    it('handles fetch error', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('API Error')) as any;

        render(<DashboardContent />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
        });
    });
});
