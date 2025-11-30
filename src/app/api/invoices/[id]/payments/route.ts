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

        const payments = await prisma.invoicePayment.findMany({
            where: { invoiceId: id },
            include: {
                recordedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                paymentDate: 'desc',
            },
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payments' },
            { status: 500 }
        );
    }
}

export async function POST(
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

        // Get invoice
        const invoice = await prisma.invoice.findUnique({
            where: { id },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Create payment
        const payment = await prisma.invoicePayment.create({
            data: {
                invoiceId: id,
                amount: body.amount,
                paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(),
                paymentMethod: body.paymentMethod,
                transactionId: body.transactionId,
                referenceNumber: body.referenceNumber,
                status: body.status || 'completed',
                notes: body.notes,
                recordedById: session.user.id,
            },
        });

        // Update invoice payment totals
        const allPayments = await prisma.invoicePayment.findMany({
            where: { invoiceId: id, status: 'completed' },
        });

        const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const balanceDue = Number(invoice.total) - totalPaid;

        // Determine new status
        let newStatus = invoice.status;
        if (balanceDue <= 0) {
            newStatus = 'PAID';
        } else if (totalPaid > 0) {
            newStatus = 'PARTIALLY_PAID';
        }

        // Update invoice
        await prisma.invoice.update({
            where: { id },
            data: {
                amountPaid: totalPaid,
                balanceDue: balanceDue,
                status: newStatus,
                paidAt: balanceDue <= 0 ? new Date() : invoice.paidAt,
            },
        });

        // Create history entry
        await prisma.invoiceHistory.create({
            data: {
                invoiceId: id,
                action: 'payment_recorded',
                description: `Payment of ${body.amount} recorded via ${body.paymentMethod}`,
                changedById: session.user.id,
            },
        });

        return NextResponse.json(payment, { status: 201 });
    } catch (error) {
        console.error('Error recording payment:', error);
        return NextResponse.json(
            { error: 'Failed to record payment' },
            { status: 500 }
        );
    }
}

