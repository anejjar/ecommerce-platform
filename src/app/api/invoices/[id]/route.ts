import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                customer: {
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
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
                payments: {
                    orderBy: {
                        paymentDate: 'desc',
                    },
                },
                history: {
                    include: {
                        changedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        status: true,
                    },
                },
            },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { items, ...invoiceData } = body;

        // Check if invoice exists
        const existingInvoice = await prisma.invoice.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!existingInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Calculate totals if items are provided
        if (items) {
            const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);
            const tax = invoiceData.tax || existingInvoice.tax;
            const shipping = invoiceData.shipping || existingInvoice.shipping;
            const discount = invoiceData.discount || existingInvoice.discount;
            const total = subtotal + tax + shipping - discount;
            const balanceDue = total - (invoiceData.amountPaid ?? existingInvoice.amountPaid);

            invoiceData.subtotal = subtotal;
            invoiceData.total = total;
            invoiceData.balanceDue = balanceDue;
        }

        // Update invoice
        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                ...invoiceData,
                updatedById: session.user.id,
            },
            include: {
                items: true,
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Update items if provided
        if (items) {
            // Delete existing items
            await prisma.invoiceItem.deleteMany({
                where: { invoiceId: id },
            });

            // Create new items
            await prisma.invoiceItem.createMany({
                data: items.map((item: any, index: number) => ({
                    ...item,
                    invoiceId: id,
                    position: index,
                })),
            });
        }

        // Create history entry
        await prisma.invoiceHistory.create({
            data: {
                invoiceId: id,
                action: 'updated',
                description: 'Invoice updated',
                changedById: session.user.id,
            },
        });

        return NextResponse.json(invoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json(
            { error: 'Failed to update invoice' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check if invoice exists
        const invoice = await prisma.invoice.findUnique({
            where: { id },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Delete invoice (cascade will delete items, payments, history)
        await prisma.invoice.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json(
            { error: 'Failed to delete invoice' },
            { status: 500 }
        );
    }
}

