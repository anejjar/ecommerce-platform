import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// Helper function to format currency
const formatCurrency = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${num.toFixed(2)}`;
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
    const tableData = order.items.map(item => [
        item.product.name,
        item.product.sku || item.variant?.sku || '-',
        item.quantity.toString(),
        formatCurrency(item.price),
        formatCurrency(item.total)
    ]);

    autoTable(doc, {
        startY: 120,
        head: [['Product', 'SKU', 'Qty', 'Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [66, 66, 66] }
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.text(`Subtotal: ${formatCurrency(order.subtotal)}`, 150, finalY + 10);
    doc.text(`Tax: ${formatCurrency(order.tax)}`, 150, finalY + 17);
    doc.text(`Shipping: ${formatCurrency(order.shipping)}`, 150, finalY + 24);
    if (order.discountAmount) {
        doc.text(`Discount: -${formatCurrency(order.discountAmount)}`, 150, finalY + 31);
    }
    doc.setFontSize(14);
    doc.text(`Total: ${formatCurrency(order.total)}`, 150, finalY + (order.discountAmount ? 41 : 34));

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
