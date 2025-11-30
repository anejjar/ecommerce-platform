import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RecurringFrequency } from '@/types/invoice';

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

        // Get recurring invoice
        const recurring = await prisma.recurringInvoice.findUnique({
            where: { id },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!recurring) {
            return NextResponse.json({ error: 'Recurring invoice not found' }, { status: 404 });
        }

        if (!recurring.isActive) {
            return NextResponse.json(
                { error: 'Recurring invoice is not active' },
                { status: 400 }
            );
        }

        // Get invoice settings
        const settings = await prisma.invoiceSettings.findFirst();
        if (!settings) {
            return NextResponse.json(
                { error: 'Invoice settings not found' },
                { status: 500 }
            );
        }

        // Parse invoice settings from recurring invoice
        const invoiceData = recurring.invoiceSettings 
            ? JSON.parse(recurring.invoiceSettings as string)
            : {};

        // Generate invoice number
        const invoiceNumber = settings.invoiceNumberFormat
            .replace('{{prefix}}', settings.invoiceNumberPrefix)
            .replace('{{number}}', settings.nextInvoiceNumber.toString().padStart(6, '0'));

        // Calculate due date
        const invoiceDate = new Date();
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + settings.defaultDueDays);

        // Calculate totals
        const items = invoiceData.items || [];
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
        const tax = invoiceData.tax || 0;
        const shipping = invoiceData.shipping || 0;
        const discount = invoiceData.discount || 0;
        const total = subtotal + tax + shipping - discount;

        // Create invoice
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                invoiceType: 'RECURRING',
                status: 'DRAFT',
                invoiceDate,
                dueDate,
                customerId: recurring.customerId || null,
                customerEmail: recurring.customerEmail || recurring.customer?.email || null,
                customerName: invoiceData.customerName || recurring.customer?.name || null,
                customerCompany: invoiceData.customerCompany || null,
                billingAddress: invoiceData.billingAddress || null,
                shippingAddress: invoiceData.shippingAddress || null,
                subtotal,
                tax,
                shipping,
                discount,
                total,
                amountPaid: 0,
                balanceDue: total,
                currency: settings.currency || 'USD',
                currencySymbol: settings.currencySymbol || '$',
                templateId: recurring.templateId || null,
                termsAndConditions: invoiceData.termsAndConditions || settings.defaultTerms || null,
                notes: invoiceData.notes || settings.defaultNotes || null,
                footerText: settings.footerText || null,
                isRecurring: true,
                recurringId: recurring.id,
                createdById: session.user.id,
                items: {
                    create: (items || []).map((item: any, index: number) => ({
                        productId: item.productId || null,
                        variantId: item.variantId || null,
                        description: item.description || 'Item',
                        sku: item.sku || null,
                        quantity: item.quantity || 1,
                        unitPrice: item.unitPrice || 0,
                        taxRate: item.taxRate || null,
                        discount: item.discount || 0,
                        total: item.total || 0,
                        position: index,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        // Update next invoice number
        await prisma.invoiceSettings.update({
            where: { id: settings.id },
            data: {
                nextInvoiceNumber: settings.nextInvoiceNumber + 1,
            },
        });

        // Calculate next run date
        const calculateNextRunDate = (lastRun: Date, freq: RecurringFrequency, interval: number): Date => {
            const next = new Date(lastRun);
            
            switch (freq) {
                case 'DAILY':
                    next.setDate(next.getDate() + interval);
                    break;
                case 'WEEKLY':
                    next.setDate(next.getDate() + (interval * 7));
                    if (recurring.dayOfWeek !== null) {
                        const currentDay = next.getDay();
                        const daysUntilTarget = (recurring.dayOfWeek! - currentDay + 7) % 7;
                        next.setDate(next.getDate() + daysUntilTarget);
                    }
                    break;
                case 'MONTHLY':
                    next.setMonth(next.getMonth() + interval);
                    if (recurring.dayOfMonth !== null) {
                        next.setDate(recurring.dayOfMonth);
                    }
                    break;
                case 'QUARTERLY':
                    next.setMonth(next.getMonth() + (interval * 3));
                    if (recurring.dayOfMonth !== null) {
                        next.setDate(recurring.dayOfMonth);
                    }
                    break;
                case 'YEARLY':
                    next.setFullYear(next.getFullYear() + interval);
                    if (recurring.dayOfMonth !== null) {
                        next.setMonth(0);
                        next.setDate(recurring.dayOfMonth);
                    }
                    break;
                case 'CUSTOM':
                    if (recurring.customInterval) {
                        next.setDate(next.getDate() + recurring.customInterval);
                    }
                    break;
            }
            
            return next;
        };

        const nextRunDate = calculateNextRunDate(invoiceDate, recurring.frequency, recurring.interval);

        // Update recurring invoice
        await prisma.recurringInvoice.update({
            where: { id },
            data: {
                lastRunDate: invoiceDate,
                nextRunDate,
            },
        });

        // Auto-send if enabled
        if (recurring.autoSend && invoice.customerEmail) {
            try {
                const { sendEmail } = await import('@/lib/email');
                const { generateInvoicePDF } = await import('@/lib/invoice-generator');
                
                const pdfBuffer = await generateInvoicePDF(invoice, recurring.template, settings);
                
                const emailSubject = (settings.emailSubjectTemplate || 'Invoice {{invoiceNumber}} from {{companyName}}')
                    .replace('{{invoiceNumber}}', invoice.invoiceNumber)
                    .replace('{{companyName}}', settings.companyName || 'Your Store');

                const emailBody = settings.emailBodyTemplate || `
                    <p>Dear ${invoice.customerName || 'Customer'},</p>
                    <p>Please find attached your recurring invoice <strong>${invoice.invoiceNumber}</strong>.</p>
                    <p><strong>Invoice Details:</strong></p>
                    <ul>
                        <li>Invoice Number: ${invoice.invoiceNumber}</li>
                        <li>Date: ${invoiceDate.toLocaleDateString()}</li>
                        <li>Due Date: ${dueDate.toLocaleDateString()}</li>
                        <li>Total Amount: ${invoice.currencySymbol}${total.toFixed(2)}</li>
                    </ul>
                    <p>Thank you for your business!</p>
                `;

                await sendEmail({
                    to: invoice.customerEmail,
                    subject: emailSubject,
                    html: emailBody,
                    attachments: [
                        {
                            filename: `Invoice-${invoice.invoiceNumber}.pdf`,
                            content: pdfBuffer,
                            contentType: 'application/pdf',
                        },
                    ],
                    from: settings.companyEmail 
                        ? `"${settings.companyName || 'Your Store'}" <${settings.companyEmail}>`
                        : undefined,
                });

                // Update invoice status
                await prisma.invoice.update({
                    where: { id: invoice.id },
                    data: {
                        status: 'SENT',
                        sentAt: new Date(),
                    },
                });
            } catch (emailError) {
                console.error('Error auto-sending invoice:', emailError);
                // Don't fail the generation if email fails
            }
        }

        return NextResponse.json({
            message: 'Invoice generated successfully',
            invoice,
        });
    } catch (error) {
        console.error('Error generating invoice:', error);
        return NextResponse.json(
            { error: 'Failed to generate invoice' },
            { status: 500 }
        );
    }
}

