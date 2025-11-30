import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrencyWithSymbol } from './formatting';
import { Invoice, InvoiceSettings, InvoiceTemplate } from '@/types/invoice';

// QR Code generation (optional - requires qrcode package)
let QRCode: any = null;
try {
    QRCode = require('qrcode');
} catch (error) {
    // QR code library not installed - feature will be disabled
    console.warn('QR code library not found. Install with: npm install qrcode @types/qrcode');
}

// Define types based on the Prisma schema and what we expect to be passed
interface Address {
    firstName: string;
    lastName: string;
    company?: string | null;
    address1: string;
    address2?: string | null;
    city: string;
    state?: string | null;
    postalCode: string;
    country: string;
    phone?: string | null;
}

interface OrderItem {
    quantity: number;
    price: number | string; // Can be Decimal or number
    total: number | string;
    product: {
        name: string;
        sku?: string | null;
    };
    variant?: {
        sku?: string | null;
        optionValues?: string; // JSON string
    } | null;
}

interface Order {
    id: string;
    orderNumber: string;
    createdAt: Date | string;
    status: string;
    subtotal: number | string;
    tax: number | string;
    shipping: number | string;
    total: number | string;
    discountAmount?: number | string;
    items: OrderItem[];
    shippingAddress?: Address | null;
    billingAddress?: Address | null;
    user?: {
        email: string;
        firstName?: string | null;
        lastName?: string | null;
    } | null;
}

// Helper function to get currency symbol from settings
const getCurrencySymbol = async (): Promise<string> => {
    try {
        const response = await fetch('/api/settings?category=general');
        if (response.ok) {
            const data = await response.json();
            return data.general_currency_symbol || '$';
        }
    } catch (error) {
        console.error('Error fetching currency symbol:', error);
    }
    return '$';
};

// Helper function to format currency with symbol from settings
const formatCurrency = async (amount: number | string, symbol: string): Promise<string> => {
    return formatCurrencyWithSymbol(amount, symbol);
};

// Helper function to format date
const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Helper function to format address
const formatAddress = (address: Address | null | undefined): string => {
    if (!address) return 'N/A';

    const lines = [
        `${address.firstName} ${address.lastName}`,
        address.company || '',
        address.address1,
        address.address2 || '',
        `${address.city}, ${address.state || ''} ${address.postalCode}`,
        address.country,
        address.phone || ''
    ].filter(line => line.trim() !== '');

    return lines.join('\n');
};

export const generateInvoice = async (order: Order) => {
    const doc = new jsPDF();
    const currencySymbol = await getCurrencySymbol();

    // Header
    doc.setFontSize(24);
    doc.text('INVOICE', 105, 20, { align: 'center' });

    // Order info
    doc.setFontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 20, 40);
    doc.text(`Date: ${formatDate(order.createdAt)}`, 20, 47);
    doc.text(`Status: ${order.status}`, 20, 54);

    // Customer info
    doc.setFontSize(10);
    doc.text('Bill To:', 20, 70);
    const billingText = formatAddress(order.billingAddress);
    doc.text(billingText, 20, 77);

    doc.text('Ship To:', 110, 70);
    const shippingText = formatAddress(order.shippingAddress);
    doc.text(shippingText, 110, 77);

    // Items table
    const tableData = await Promise.all(order.items.map(async item => [
        item.product.name,
        item.product.sku || item.variant?.sku || '-',
        item.quantity.toString(),
        await formatCurrency(item.price, currencySymbol),
        await formatCurrency(item.total, currencySymbol)
    ]));

    autoTable(doc, {
        startY: 120,
        head: [['Product', 'SKU', 'Qty', 'Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [66, 66, 66] }
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.text(`Subtotal: ${await formatCurrency(order.subtotal, currencySymbol)}`, 150, finalY + 10);
    doc.text(`Tax: ${await formatCurrency(order.tax, currencySymbol)}`, 150, finalY + 17);
    doc.text(`Shipping: ${await formatCurrency(order.shipping, currencySymbol)}`, 150, finalY + 24);
    if (order.discountAmount) {
        doc.text(`Discount: -${await formatCurrency(order.discountAmount, currencySymbol)}`, 150, finalY + 31);
    }
    doc.setFontSize(14);
    doc.text(`Total: ${await formatCurrency(order.total, currencySymbol)}`, 150, finalY + (order.discountAmount ? 41 : 34));

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });

    doc.save(`Invoice-${order.orderNumber}.pdf`);
};

export const generatePackingSlip = async (order: Order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(24);
    doc.text('PACKING SLIP', 105, 20, { align: 'center' });

    // Order info
    doc.setFontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 20, 40);
    doc.text(`Date: ${formatDate(order.createdAt)}`, 20, 47);

    // Shipping address
    doc.setFontSize(10);
    doc.text('Ship To:', 20, 65);
    const shippingText = formatAddress(order.shippingAddress);
    doc.text(shippingText, 20, 72);

    // Items table
    const tableData = order.items.map(item => [
        item.product.name,
        item.product.sku || item.variant?.sku || '-',
        item.quantity.toString(),
        '[ ]' // Checkbox for picked items
    ]);

    autoTable(doc, {
        startY: 110,
        head: [['Product', 'SKU', 'Quantity', 'Picked']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] }
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Please check contents against this slip.', 105, 280, { align: 'center' });

    doc.save(`PackingSlip-${order.orderNumber}.pdf`);
};

// Enhanced invoice generation for premium invoice system
export const generateInvoicePDF = async (
    invoice: Invoice,
    template?: InvoiceTemplate | null,
    settings?: InvoiceSettings | null
): Promise<Buffer> => {
    const doc = new jsPDF();
    
    // Get settings defaults
    const primaryColor = settings?.primaryColor || '#000000';
    const secondaryColor = settings?.secondaryColor || '#666666';
    const accentColor = settings?.accentColor || '#3182ce';
    const fontFamily = settings?.fontFamily || 'Helvetica';
    const fontSize = settings?.fontSize || 10;
    const currencySymbol = invoice.currencySymbol || settings?.currencySymbol || '$';
    
    // Parse colors
    const parseColor = (color: string): [number, number, number] => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b];
    };
    
    const primaryRGB = parseColor(primaryColor);
    const accentRGB = parseColor(accentColor);
    
    // Set font
    doc.setFont(fontFamily);
    doc.setFontSize(fontSize);
    
    let yPos = 20;
    
    // Header with logo
    if (settings?.logoUrl) {
        try {
            // Note: jsPDF doesn't directly support images from URLs in server-side
            // In production, you'd need to fetch and convert the image
            // For now, we'll just add space for the logo
            yPos += 20;
        } catch (error) {
            console.error('Error loading logo:', error);
        }
    }
    
    // Company information
    if (settings?.companyName) {
        doc.setFontSize(18);
        doc.setTextColor(...primaryRGB);
        doc.text(settings.companyName, 20, yPos);
        yPos += 8;
    }
    
    if (settings?.companyAddress) {
        doc.setFontSize(fontSize);
        doc.setTextColor(0, 0, 0);
        const addressLines = settings.companyAddress.split('\n');
        addressLines.forEach((line: string) => {
            if (line.trim()) {
                doc.text(line, 20, yPos);
                yPos += 5;
            }
        });
    }
    
    if (settings?.companyPhone || settings?.companyEmail || settings?.companyWebsite) {
        yPos += 2;
        if (settings.companyPhone) {
            doc.text(`Phone: ${settings.companyPhone}`, 20, yPos);
            yPos += 5;
        }
        if (settings.companyEmail) {
            doc.text(`Email: ${settings.companyEmail}`, 20, yPos);
            yPos += 5;
        }
        if (settings.companyWebsite) {
            doc.text(`Website: ${settings.companyWebsite}`, 20, yPos);
            yPos += 5;
        }
    }
    
    // Invoice title and number
    yPos = 20;
    doc.setFontSize(24);
    doc.setTextColor(...primaryRGB);
    doc.text('INVOICE', 150, yPos, { align: 'right' });
    
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, yPos, { align: 'right' });
    
    yPos += 6;
    doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, 150, yPos, { align: 'right' });
    
    if (invoice.dueDate) {
        yPos += 6;
        doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 150, yPos, { align: 'right' });
    }
    
    yPos += 6;
    doc.text(`Status: ${invoice.status}`, 150, yPos, { align: 'right' });
    
    // Customer information
    yPos = Math.max(yPos + 10, 80);
    doc.setFontSize(12);
    doc.setTextColor(...primaryRGB);
    doc.text('Bill To:', 20, yPos);
    
    yPos += 7;
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    
    if (invoice.customerName) {
        doc.text(invoice.customerName, 20, yPos);
        yPos += 5;
    }
    
    if (invoice.customerCompany) {
        doc.text(invoice.customerCompany, 20, yPos);
        yPos += 5;
    }
    
    if (invoice.customerEmail) {
        doc.text(invoice.customerEmail, 20, yPos);
        yPos += 5;
    }
    
    if (invoice.billingAddress) {
        const address = typeof invoice.billingAddress === 'string' 
            ? JSON.parse(invoice.billingAddress) 
            : invoice.billingAddress;
        
        if (address.address1) {
            doc.text(address.address1, 20, yPos);
            yPos += 5;
        }
        if (address.address2) {
            doc.text(address.address2, 20, yPos);
            yPos += 5;
        }
        if (address.city || address.state || address.postalCode) {
            const cityState = [
                address.city,
                address.state,
                address.postalCode
            ].filter(Boolean).join(', ');
            doc.text(cityState, 20, yPos);
            yPos += 5;
        }
        if (address.country) {
            doc.text(address.country, 20, yPos);
            yPos += 5;
        }
        if (address.phone) {
            doc.text(`Phone: ${address.phone}`, 20, yPos);
            yPos += 5;
        }
    }
    
    // Items table
    const startY = yPos + 10;
    const tableData = invoice.items?.map(item => [
        item.description || 'Item',
        item.sku || '-',
        item.quantity.toString(),
        formatCurrencyWithSymbol(item.unitPrice, currencySymbol),
        formatCurrencyWithSymbol(item.total, currencySymbol)
    ]) || [];
    
    autoTable(doc, {
        startY,
        head: [['Description', 'SKU', 'Qty', 'Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
            fillColor: primaryRGB,
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: fontSize,
            font: fontFamily,
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });
    
    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || startY;
    let totalsY = finalY + 10;
    
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    
    // Subtotal
    doc.text('Subtotal:', 150, totalsY, { align: 'right' });
    doc.text(formatCurrencyWithSymbol(invoice.subtotal, currencySymbol), 190, totalsY, { align: 'right' });
    totalsY += 6;
    
    // Tax
    if (invoice.tax > 0) {
        const taxLabel = settings?.taxLabel || 'Tax';
        doc.text(`${taxLabel}:`, 150, totalsY, { align: 'right' });
        doc.text(formatCurrencyWithSymbol(invoice.tax, currencySymbol), 190, totalsY, { align: 'right' });
        totalsY += 6;
    }
    
    // Shipping
    if (invoice.shipping > 0) {
        doc.text('Shipping:', 150, totalsY, { align: 'right' });
        doc.text(formatCurrencyWithSymbol(invoice.shipping, currencySymbol), 190, totalsY, { align: 'right' });
        totalsY += 6;
    }
    
    // Discount
    if (invoice.discount > 0) {
        doc.text('Discount:', 150, totalsY, { align: 'right' });
        doc.text(`-${formatCurrencyWithSymbol(invoice.discount, currencySymbol)}`, 190, totalsY, { align: 'right' });
        totalsY += 6;
    }
    
    // Total
    totalsY += 3;
    doc.setFontSize(14);
    doc.setTextColor(...primaryRGB);
    doc.setFont(fontFamily, 'bold');
    doc.text('Total:', 150, totalsY, { align: 'right' });
    doc.text(formatCurrencyWithSymbol(invoice.total, currencySymbol), 190, totalsY, { align: 'right' });
    
    // Payment information
    if (invoice.amountPaid > 0 || invoice.balanceDue > 0) {
        totalsY += 8;
        doc.setFontSize(fontSize);
        doc.setFont(fontFamily, 'normal');
        doc.setTextColor(0, 0, 0);
        
        if (invoice.amountPaid > 0) {
            doc.text('Amount Paid:', 150, totalsY, { align: 'right' });
            doc.text(formatCurrencyWithSymbol(invoice.amountPaid, currencySymbol), 190, totalsY, { align: 'right' });
            totalsY += 6;
        }
        
        if (invoice.balanceDue > 0) {
            doc.setFont(fontFamily, 'bold');
            doc.setTextColor(...accentRGB);
            doc.text('Balance Due:', 150, totalsY, { align: 'right' });
            doc.text(formatCurrencyWithSymbol(invoice.balanceDue, currencySymbol), 190, totalsY, { align: 'right' });
        }
    }
    
    // QR Code (if enabled)
    if (settings?.showQRCode && QRCode) {
        try {
            totalsY += 10;
            const qrData = invoice.paymentLink || JSON.stringify({
                type: 'invoice',
                invoiceNumber: invoice.invoiceNumber,
                amount: invoice.total,
                currency: currencySymbol,
            });
            
            const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                width: 60,
                margin: 1,
            });
            
            // Convert data URL to base64 and add to PDF
            const base64Data = qrCodeDataUrl.split(',')[1];
            doc.addImage(base64Data, 'PNG', 20, totalsY, 30, 30);
            
            // Add label
            doc.setFontSize(fontSize - 2);
            doc.setTextColor(100, 100, 100);
            doc.text('Scan to pay', 55, totalsY + 20, { align: 'left' });
            
            totalsY += 35;
        } catch (error) {
            console.error('Error generating QR code:', error);
            // Continue without QR code if generation fails
        }
    }
    
    // Terms and conditions
    if (invoice.termsAndConditions || settings?.defaultTerms) {
        totalsY += 15;
        doc.setFontSize(fontSize - 1);
        doc.setTextColor(0, 0, 0);
        doc.setFont(fontFamily, 'normal');
        
        const terms = invoice.termsAndConditions || settings?.defaultTerms || '';
        const termsLines = doc.splitTextToSize(terms, 170);
        doc.text('Terms & Conditions:', 20, totalsY);
        totalsY += 6;
        doc.text(termsLines, 20, totalsY);
        totalsY += termsLines.length * 5;
    }
    
    // Notes
    if (invoice.notes) {
        totalsY += 5;
        doc.setFontSize(fontSize - 1);
        const notesLines = doc.splitTextToSize(invoice.notes, 170);
        doc.text('Notes:', 20, totalsY);
        totalsY += 6;
        doc.text(notesLines, 20, totalsY);
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 20;
    
    if (settings?.footerText && settings?.showFooter) {
        doc.setFontSize(fontSize - 2);
        doc.setTextColor(100, 100, 100);
        const footerLines = doc.splitTextToSize(settings.footerText, 170);
        doc.text(footerLines, 105, footerY, { align: 'center' });
    } else {
        doc.setFontSize(fontSize - 2);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for your business!', 105, footerY, { align: 'center' });
    }
    
    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
};
