import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DownloadInvoiceButton } from '@/components/customer/DownloadInvoiceButton';
import * as invoiceGenerator from '@/lib/invoice-generator';

// Mock the invoice generator
vi.mock('@/lib/invoice-generator', () => ({
    generateInvoice: vi.fn(),
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock fetch
global.fetch = vi.fn();

describe('DownloadInvoiceButton', () => {
    const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORD-2024-001',
        createdAt: new Date('2024-01-15'),
        status: 'DELIVERED',
        subtotal: 100.00,
        tax: 10.00,
        shipping: 5.00,
        total: 115.00,
        items: [],
        shippingAddress: null,
        billingAddress: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should not render when feature is disabled', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ features: [] }),
        });

        const { container } = render(<DownloadInvoiceButton order={mockOrder} />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it('should render when feature is enabled', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ features: ['invoice_generator'] }),
        });

        render(<DownloadInvoiceButton order={mockOrder} />);

        await waitFor(() => {
            expect(screen.getByText('Download Invoice')).toBeInTheDocument();
        });
    });

    it('should call generateInvoice when clicked', async () => {
        const user = userEvent.setup();

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ features: ['invoice_generator'] }),
        });

        render(<DownloadInvoiceButton order={mockOrder} />);

        await waitFor(() => {
            expect(screen.getByText('Download Invoice')).toBeInTheDocument();
        });

        const button = screen.getByText('Download Invoice');
        await user.click(button);

        expect(invoiceGenerator.generateInvoice).toHaveBeenCalledWith(mockOrder);
    });

    it('should handle API errors gracefully', async () => {
        (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

        const { container } = render(<DownloadInvoiceButton order={mockOrder} />);

        await waitFor(() => {
            expect(container.firstChild).toBeNull();
        });
    });

    it('should show loading state initially', () => {
        (global.fetch as any).mockImplementationOnce(
            () => new Promise(() => { }) // Never resolves
        );

        const { container } = render(<DownloadInvoiceButton order={mockOrder} />);

        // Should not render anything while loading
        expect(container.firstChild).toBeNull();
    });
});
