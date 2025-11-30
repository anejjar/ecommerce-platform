// QR Code Generator for Invoices
// Generates QR codes for payment links or invoice information

import QRCode from 'qrcode';

/**
 * Generate QR code as data URL (base64 image)
 */
export async function generateQRCodeDataURL(data: string): Promise<string> {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            width: 200,
            margin: 1,
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

/**
 * Generate QR code as buffer (for PDF embedding)
 */
export async function generateQRCodeBuffer(data: string): Promise<Buffer> {
    try {
        const qrCodeBuffer = await QRCode.toBuffer(data, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            width: 200,
            margin: 1,
        });
        return qrCodeBuffer;
    } catch (error) {
        console.error('Error generating QR code buffer:', error);
        throw error;
    }
}

/**
 * Generate QR code for invoice payment
 * Includes invoice number, amount, and payment link if available
 */
export async function generateInvoiceQRCode(invoice: {
    invoiceNumber: string;
    total: number;
    currencySymbol: string;
    paymentLink?: string;
}): Promise<string> {
    // Create QR code data with invoice information
    const qrData = invoice.paymentLink 
        ? invoice.paymentLink
        : JSON.stringify({
            type: 'invoice',
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.total,
            currency: invoice.currencySymbol,
        });

    return generateQRCodeDataURL(qrData);
}

