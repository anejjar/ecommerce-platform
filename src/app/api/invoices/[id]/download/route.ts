import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice-generator';

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
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'pdf';

        // Get invoice
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
                template: true,
            },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Check permissions - admin can access any, customer can only access their own
        if (!['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            if (invoice.customerId !== session.user.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        }

        // Get settings
        const settings = await prisma.invoiceSettings.findFirst();

        if (format === 'pdf') {
            // Generate PDF
            const pdfBuffer = await generateInvoicePDF(invoice, invoice.template, settings);

            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`,
                },
            });
        } else {
            // HTML format - return JSON for now, HTML generation will be implemented later
            return NextResponse.json({
                message: 'HTML format not yet implemented',
                invoice,
            });
        }
    } catch (error) {
        console.error('Error downloading invoice:', error);
        return NextResponse.json(
            { error: 'Failed to download invoice' },
            { status: 500 }
        );
    }
}

