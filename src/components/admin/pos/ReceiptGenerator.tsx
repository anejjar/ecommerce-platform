'use client';

import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

interface ReceiptData {
  orderNumber: string;
  date: Date;
  location: string;
  cashier: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
  tableNumber?: string;
}

interface ReceiptGeneratorProps {
  data: ReceiptData;
  onPrint?: () => void;
}

export function ReceiptGenerator({ data, onPrint }: ReceiptGeneratorProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    if (!receiptRef.current) return;

    const pdf = new jsPDF({
      unit: 'mm',
      format: [80, 200], // Receipt size
    });

    let y = 10;
    const lineHeight = 7;
    const margin = 5;

    // Header
    pdf.setFontSize(16);
    pdf.text('RECEIPT', margin, y);
    y += lineHeight;

    pdf.setFontSize(10);
    pdf.text(`Order: ${data.orderNumber}`, margin, y);
    y += lineHeight;
    pdf.text(`Date: ${new Date(data.date).toLocaleString()}`, margin, y);
    y += lineHeight;
    pdf.text(`Location: ${data.location}`, margin, y);
    y += lineHeight;
    pdf.text(`Cashier: ${data.cashier}`, margin, y);
    y += lineHeight + 2;

    if (data.tableNumber) {
      pdf.text(`Table: ${data.tableNumber}`, margin, y);
      y += lineHeight;
    }

    if (data.customerName) {
      pdf.text(`Customer: ${data.customerName}`, margin, y);
      y += lineHeight;
    }

    pdf.line(margin, y, 75, y);
    y += lineHeight;

    // Items
    data.items.forEach((item) => {
      pdf.text(`${item.name}`, margin, y);
      y += lineHeight * 0.7;
      pdf.text(
        `  ${item.quantity}x $${item.price.toFixed(2)} = $${item.total.toFixed(2)}`,
        margin,
        y
      );
      y += lineHeight;
    });

    y += lineHeight * 0.5;
    pdf.line(margin, y, 75, y);
    y += lineHeight;

    // Totals
    pdf.text(`Subtotal: $${data.subtotal.toFixed(2)}`, margin, y);
    y += lineHeight;
    pdf.text(`Tax: $${data.tax.toFixed(2)}`, margin, y);
    y += lineHeight;
    pdf.text(`Discount: -$${data.discount.toFixed(2)}`, margin, y);
    y += lineHeight;
    pdf.setFontSize(12);
    pdf.text(`TOTAL: $${data.total.toFixed(2)}`, margin, y);
    y += lineHeight;

    pdf.setFontSize(10);
    y += lineHeight;
    pdf.text(`Payment: ${data.paymentMethod}`, margin, y);
    y += lineHeight * 2;

    pdf.text('Thank you for your purchase!', margin, y);

    // Save or print
    pdf.save(`receipt-${data.orderNumber}.pdf`);
    if (onPrint) onPrint();
  };

  return (
    <div className="hidden">
      <div ref={receiptRef} className="receipt-content">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">RECEIPT</h2>
          <p>Order: {data.orderNumber}</p>
          <p>Date: {new Date(data.date).toLocaleString()}</p>
          <p>Location: {data.location}</p>
          <p>Cashier: {data.cashier}</p>
        </div>
        <div className="border-t border-b py-2 my-2">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-1">
              <span>{item.name} ({item.quantity}x)</span>
              <span>${item.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-${data.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL:</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p>Payment: {data.paymentMethod}</p>
          <p className="mt-4">Thank you for your purchase!</p>
        </div>
      </div>
      <button onClick={generatePDF} className="hidden">
        Generate PDF
      </button>
    </div>
  );
}

