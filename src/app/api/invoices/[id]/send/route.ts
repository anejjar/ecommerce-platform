import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { generateInvoicePDF } from '@/lib/invoice-generator';

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
        const { email } = body;

        // Get invoice
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                customer: {
                    select: {
                        email: true,
                        name: true,
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

        // Determine recipient email
        const recipientEmail = email || invoice.customerEmail || invoice.customer?.email;
        if (!recipientEmail) {
            return NextResponse.json(
                { error: 'No email address found for invoice recipient' },
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

        // Update invoice status
        await prisma.invoice.update({
            where: { id },
            data: {
                status: 'SENT',
                sentAt: new Date(),
            },
        });

        // Generate PDF
        const pdfBuffer = await generateInvoicePDF(invoice, invoice.template, settings);

        // Prepare email subject and body
        const emailSubject = (settings.emailSubjectTemplate || 'Invoice {{invoiceNumber}} from {{companyName}}')
            .replace('{{invoiceNumber}}', invoice.invoiceNumber)
            .replace('{{companyName}}', settings.companyName || 'Your Store');

        const emailBody = settings.emailBodyTemplate || `
            <p>Dear ${invoice.customerName || 'Customer'},</p>
            <p>Please find attached invoice <strong>${invoice.invoiceNumber}</strong> for your records.</p>
            <p><strong>Invoice Details:</strong></p>
            <ul>
                <li>Invoice Number: ${invoice.invoiceNumber}</li>
                <li>Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}</li>
                ${invoice.dueDate ? `<li>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</li>` : ''}
                <li>Total Amount: ${invoice.currencySymbol}${Number(invoice.total).toFixed(2)}</li>
                ${invoice.balanceDue > 0 ? `<li>Balance Due: ${invoice.currencySymbol}${Number(invoice.balanceDue).toFixed(2)}</li>` : ''}
            </ul>
            ${invoice.paymentLink ? `<p><a href="${invoice.paymentLink}" class="button">Pay Now</a></p>` : ''}
            <p>You can view and download this invoice anytime from your account.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Thank you for your business!</p>
        `;

        // Replace template variables in email body
        const processedEmailBody = emailBody
            .replace(/\{\{invoiceNumber\}\}/g, invoice.invoiceNumber)
            .replace(/\{\{companyName\}\}/g, settings.companyName || 'Your Store')
            .replace(/\{\{customerName\}\}/g, invoice.customerName || 'Customer')
            .replace(/\{\{total\}\}/g, `${invoice.currencySymbol}${Number(invoice.total).toFixed(2)}`)
            .replace(/\{\{balanceDue\}\}/g, `${invoice.currencySymbol}${Number(invoice.balanceDue).toFixed(2)}`);

        // Send email with PDF attachment
        const emailResult = await sendEmail({
            to: recipientEmail,
            subject: emailSubject,
            html: processedEmailBody,
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
            replyTo: settings.companyEmail,
        });

        if (!emailResult.success) {
            console.error('Failed to send invoice email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send email. Please check your email configuration.' },
                { status: 500 }
            );
        }

        // Send copy to admin if enabled
        if (settings.sendCopyToAdmin && settings.adminEmail && settings.adminEmail !== recipientEmail) {
            await sendEmail({
                to: settings.adminEmail,
                subject: `[Copy] ${emailSubject}`,
                html: `<p>This is a copy of the invoice sent to ${recipientEmail}.</p>${processedEmailBody}`,
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
        }

        // Create history entry
        await prisma.invoiceHistory.create({
            data: {
                invoiceId: id,
                action: 'sent',
                description: `Invoice sent to ${recipientEmail}`,
                changedById: session.user.id,
            },
        });

        return NextResponse.json({
            message: 'Invoice sent successfully',
            recipientEmail,
        });
    } catch (error) {
        console.error('Error sending invoice:', error);
        return NextResponse.json(
            { error: 'Failed to send invoice' },
            { status: 500 }
        );
    }
}

