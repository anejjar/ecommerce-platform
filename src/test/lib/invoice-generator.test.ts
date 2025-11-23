import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateInvoice, generatePackingSlip } from '@/lib/invoice-generator';

// Mock jsPDF
const mockSave = vi.fn();
const mockText = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetFont = vi.fn();

vi.mock('jspdf', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            text: mockText,
            setFontSize: mockSetFontSize,
            setFont: mockSetFont,
            save: mockSave,
            lastAutoTable: { finalY: 100 },
        })),
    };
});

vi.mock('jspdf-autotable', () => ({
    default: vi.fn(),
}));

describe('Invoice Generator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORD-2024-001',
        createdAt: new Date('2024-01-15'),
        status: 'DELIVERED',
        subtotal: 100.00,
        tax: 10.00,
        shipping: 5.00,
        total: 115.00,
        discountAmount: 0,
        items: [
            {
                id: 'item-1',
                quantity: 2,
                price: 25.00,
                total: 50.00,
                product: {
                    name: 'Premium Coffee Beans',
                    sku: 'COFFEE-001',
                },
                variant: null,
            },
            {
                id: 'item-2',
                quantity: 1,
                price: 50.00,
                total: 50.00,
                product: {
                    name: 'French Press',
                    sku: 'PRESS-001',
                },
                variant: {
                    sku: 'PRESS-001-BLK',
                    optionValues: JSON.stringify(['Black', 'Large']),
                },
            },
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            company: 'Acme Corp',
            address1: '123 Main St',
            address2: 'Suite 100',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            phone: '+1 (555) 123-4567',
        },
        billingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            company: null,
            address1: '456 Billing Ave',
            address2: null,
            city: 'Brooklyn',
            state: 'NY',
            postalCode: '11201',
            country: 'USA',
            phone: '+1 (555) 987-6543',
        },
        user: {
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateInvoice, generatePackingSlip } from '@/lib/invoice-generator';

// Mock jsPDF
const mockSave = vi.fn();
const mockText = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetFont = vi.fn();

vi.mock('jspdf', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            text: mockText,
            setFontSize: mockSetFontSize,
            setFont: mockSetFont,
            save: mockSave,
            lastAutoTable: { finalY: 100 },
        })),
    };
});

vi.mock('jspdf-autotable', () => ({
    default: vi.fn(),
}));

describe('Invoice Generator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockOrder = {
        id: 'order-123',
        orderNumber: 'ORD-2024-001',
        createdAt: new Date('2024-01-15'),
        status: 'DELIVERED',
        subtotal: 100.00,
        tax: 10.00,
        shipping: 5.00,
        total: 115.00,
        discountAmount: 0,
        items: [
            {
                id: 'item-1',
                quantity: 2,
                price: 25.00,
                total: 50.00,
                product: {
                    name: 'Premium Coffee Beans',
                    sku: 'COFFEE-001',
                },
                variant: null,
            },
            {
                id: 'item-2',
                quantity: 1,
                price: 50.00,
                total: 50.00,
                product: {
                    name: 'French Press',
                    sku: 'PRESS-001',
                },
                variant: {
                    sku: 'PRESS-001-BLK',
                    optionValues: JSON.stringify(['Black', 'Large']),
                },
            },
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            company: 'Acme Corp',
            address1: '123 Main St',
            address2: 'Suite 100',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            phone: '+1 (555) 123-4567',
        },
        billingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            company: null,
            address1: '456 Billing Ave',
            address2: null,
            city: 'Brooklyn',
            state: 'NY',
            postalCode: '11201',
            country: 'USA',
            phone: '+1 (555) 987-6543',
        },
        user: {
            name: 'John Doe',
            email: 'john@example.com',
        },
    };

    describe('generateInvoice', () => {
        it('should generate an invoice PDF', async () => {
            await generateInvoice(mockOrder);

            expect(mockSave).toHaveBeenCalledWith('Invoice-ORD-2024-001.pdf');
            expect(mockSetFontSize).toHaveBeenCalled();
            expect(mockText).toHaveBeenCalled();
        });

        it('should include company information', async () => {
            await generateInvoice(mockOrder);

            expect(mockText).toHaveBeenCalledWith('Organicaf', expect.any(Number), expect.any(Number));
        });

        it('should include order details', async () => {
            await generateInvoice(mockOrder);

            expect(mockText).toHaveBeenCalledWith(
                expect.stringContaining('ORD-2024-001'),
                expect.any(Number),
                expect.any(Number)
            );
        });

        it('should handle orders with discount', async () => {
            const orderWithDiscount = {
                ...mockOrder,
                discountAmount: 15.00,
                total: 100.00,
            };

            await generateInvoice(orderWithDiscount);

            expect(mockSave).toHaveBeenCalledWith('Invoice-ORD-2024-001.pdf');
        });

        it('should handle orders without shipping address', async () => {
            const orderNoShipping = {
                ...mockOrder,
                shippingAddress: null,
            };

            await expect(generateInvoice(orderNoShipping)).resolves.not.toThrow();
        });

        it('should handle orders without billing address', async () => {
            const orderNoBilling = {
                ...mockOrder,
                billingAddress: null,
            };

            await expect(generateInvoice(orderNoBilling)).resolves.not.toThrow();
        });

        it('should handle variant items correctly', async () => {
            await generateInvoice(mockOrder);

            // Should process items with variants
            expect(mockOrder.items[1].variant).toBeTruthy();
            expect(mockSave).toHaveBeenCalled();
        });
    });

    describe('generatePackingSlip', () => {
        it('should generate a packing slip PDF', async () => {
            await generatePackingSlip(mockOrder);

            expect(mockSave).toHaveBeenCalledWith('PackingSlip-ORD-2024-001.pdf');
            expect(mockSetFontSize).toHaveBeenCalled();
            expect(mockText).toHaveBeenCalled();
        });

        it('should include shipping address', async () => {
            await generatePackingSlip(mockOrder);

            expect(mockText).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.stringContaining('John Doe'),
                ]),
                expect.any(Number),
                expect.any(Number)
            );
        });

        it('should handle orders without shipping address', async () => {
            const orderNoShipping = {
                ...mockOrder,
                shippingAddress: null,
            };

            await expect(generatePackingSlip(orderNoShipping)).resolves.not.toThrow();
        });

        it('should include SKU information', async () => {
            await generatePackingSlip(mockOrder);

            // Packing slip should process items with SKUs
            expect(mockOrder.items[0].product.sku).toBe('COFFEE-001');
            expect(mockSave).toHaveBeenCalled();
        });

        it('should use variant SKU when available', async () => {
            await generatePackingSlip(mockOrder);

            // Should prefer variant SKU over product SKU
            expect(mockOrder.items[1].variant?.sku).toBe('PRESS-001-BLK');
            expect(mockSave).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should handle missing order data gracefully', async () => {
            const minimalOrder = {
                id: 'order-min',
                orderNumber: 'ORD-MIN',
                createdAt: new Date(),
                status: 'PENDING',
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                items: [],
            };

            await expect(generateInvoice(minimalOrder)).resolves.not.toThrow();
            await expect(generatePackingSlip(minimalOrder)).resolves.not.toThrow();
        });

        it('should handle items without product data', async () => {
            const orderWithBadItem = {
                ...mockOrder,
                items: [
                    {
                        id: 'bad-item',
                        quantity: 1,
                        price: 10,
                        total: 10,
                        product: {
                            name: 'Unknown Product',
                            sku: null,
                        },
                        variant: null,
                    },
                ],
            };

            await expect(generateInvoice(orderWithBadItem)).resolves.not.toThrow();
            await expect(generatePackingSlip(orderWithBadItem)).resolves.not.toThrow();
        });
    });
});
```
