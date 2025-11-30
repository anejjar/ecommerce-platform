import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice-generator';
import { Invoice } from '@/types/invoice';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Get order
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                            },
                        },
                        variant: {
                            select: {
                                sku: true,
                            },
                        },
                    },
                },
                billingAddress: true,
                shippingAddress: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check permissions
        if (!['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            if (order.userId !== session.user.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        // Get invoice settings
        let settings = await prisma.invoiceSettings.findFirst();
        if (!settings) {
            // Create default settings if they don't exist
            settings = await prisma.invoiceSettings.create({
                data: {
                    invoiceNumberPrefix: 'INV',
                    invoiceNumberFormat: '{{prefix}}-{{number}}',
                    nextInvoiceNumber: 1,
                    defaultDueDays: 30,
                    primaryColor: '#000000',
                    secondaryColor: '#666666',
                    accentColor: '#3182ce',
                    fontFamily: 'Helvetica',
                    fontSize: 10,
                    autoSendOnCreate: false,
                    sendCopyToAdmin: false,
                    taxLabel: 'Tax',
                    showTaxBreakdown: true,
                    showPaymentLink: true,
                    showQRCode: false,
                    enableSignatures: false,
                    multiLanguage: false,
                    defaultLanguage: 'en',
                    showFooter: true,
                },
            });
        }

        // Convert order to invoice format
        const invoice: Invoice = {
            id: order.id,
            invoiceNumber: order.orderNumber,
            invoiceType: 'STANDARD',
            status: 'DRAFT',
            invoiceDate: order.createdAt,
            dueDate: null,
            sentAt: null,
            viewedAt: null,
            paidAt: null,
            customerId: order.userId || undefined,
            customerEmail: order.user?.email || order.guestEmail || undefined,
            customerName: order.user?.name || 
                (order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : undefined),
            customerCompany: order.billingAddress?.company || undefined,
            billingAddress: order.billingAddress ? {
                firstName: order.billingAddress.firstName,
                lastName: order.billingAddress.lastName,
                company: order.billingAddress.company || undefined,
                address1: order.billingAddress.address1,
                address2: order.billingAddress.address2 || undefined,
                city: order.billingAddress.city,
                state: order.billingAddress.state || undefined,
                postalCode: order.billingAddress.postalCode,
                country: order.billingAddress.country,
                phone: order.billingAddress.phone || undefined,
            } : undefined,
            shippingAddress: order.shippingAddress ? {
                firstName: order.shippingAddress.firstName,
                lastName: order.shippingAddress.lastName,
                company: order.shippingAddress.company || undefined,
                address1: order.shippingAddress.address1,
                address2: order.shippingAddress.address2 || undefined,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state || undefined,
                postalCode: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
                phone: order.shippingAddress.phone || undefined,
            } : undefined,
            orderId: order.id,
            subtotal: Number(order.subtotal),
            tax: Number(order.tax),
            taxRate: null,
            shipping: Number(order.shipping),
            discount: Number(order.discountAmount || 0),
            discountType: undefined,
            total: Number(order.total),
            amountPaid: 0,
            balanceDue: Number(order.total),
            currency: settings.currency || 'USD',
            currencySymbol: settings.currencySymbol || '$',
            templateId: null,
            customFields: null,
            termsAndConditions: settings.defaultTerms || undefined,
            notes: settings.defaultNotes || order.notes || undefined,
            footerText: settings.footerText || undefined,
            paymentMethod: undefined,
            paymentInstructions: undefined,
            paymentLink: undefined,
            isRecurring: false,
            recurringId: undefined,
            qrCodeUrl: undefined,
            signatureUrl: undefined,
            signedAt: undefined,
            signedBy: undefined,
            createdById: undefined,
            updatedById: undefined,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items.map((item, index) => ({
                id: item.id,
                productId: item.productId,
                variantId: item.variantId || undefined,
                description: item.product.name,
                sku: item.product.sku || item.variant?.sku || undefined,
                quantity: item.quantity,
                unitPrice: Number(item.price),
                taxRate: undefined,
                discount: 0,
                total: Number(item.total),
                customFields: undefined,
                position: index,
            })),
            payments: [],
            history: [],
        };

        // Generate PDF using the enhanced generator with settings
        const pdfBuffer = await generateInvoicePDF(invoice, null, settings);

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Invoice-${order.orderNumber}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error generating invoice from order:', error);
        return NextResponse.json(
            { error: 'Failed to generate invoice' },
            { status: 500 }
        );
    }
}

