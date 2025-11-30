import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const customerId = searchParams.get('customerId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const where: any = {};

        if (status) {
            where.status = status;
        }
        if (type) {
            where.invoiceType = type;
        }
        if (customerId) {
            where.customerId = customerId;
        }
        if (startDate || endDate) {
            where.invoiceDate = {};
            if (startDate) {
                where.invoiceDate.gte = new Date(startDate);
            }
            if (endDate) {
                where.invoiceDate.lte = new Date(endDate);
            }
        }

        const [invoices, total] = await Promise.all([
            prisma.invoice.findMany({
                where,
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    items: true,
                    payments: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.invoice.count({ where }),
        ]);

        return NextResponse.json({
            invoices,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoices' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items, ...invoiceData } = body;

        // Get invoice settings for numbering
        const settings = await prisma.invoiceSettings.findFirst();
        if (!settings) {
            return NextResponse.json(
                { error: 'Invoice settings not found. Please configure invoice settings first.' },
                { status: 400 }
            );
        }

        // Generate invoice number
        const invoiceNumber = settings.invoiceNumberFormat
            .replace('{{prefix}}', settings.invoiceNumberPrefix)
            .replace('{{number}}', settings.nextInvoiceNumber.toString().padStart(6, '0'));

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);
        const tax = invoiceData.tax || 0;
        const shipping = invoiceData.shipping || 0;
        const discount = invoiceData.discount || 0;
        const total = subtotal + tax + shipping - discount;
        const balanceDue = total - (invoiceData.amountPaid || 0);

        // Set due date if not provided
        const dueDate = invoiceData.dueDate || (() => {
            const date = new Date(invoiceData.invoiceDate || new Date());
            date.setDate(date.getDate() + settings.defaultDueDays);
            return date;
        })();

        // Create invoice
        const invoice = await prisma.invoice.create({
            data: {
                ...invoiceData,
                invoiceNumber,
                subtotal,
                tax,
                shipping,
                discount,
                total,
                balanceDue,
                dueDate,
                createdById: session.user.id,
                items: {
                    create: items.map((item: any, index: number) => ({
                        ...item,
                        position: index,
                    })),
                },
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

        // Update next invoice number
        await prisma.invoiceSettings.update({
            where: { id: settings.id },
            data: {
                nextInvoiceNumber: settings.nextInvoiceNumber + 1,
            },
        });

        // Create history entry
        await prisma.invoiceHistory.create({
            data: {
                invoiceId: invoice.id,
                action: 'created',
                description: 'Invoice created',
                changedById: session.user.id,
            },
        });

        return NextResponse.json(invoice, { status: 201 });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json(
            { error: 'Failed to create invoice' },
            { status: 500 }
        );
    }
}

