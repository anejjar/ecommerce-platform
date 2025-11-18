'use client';

import { useState, useEffect, use } from 'react';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    // Auto-print when order is loaded
    if (order && !isLoading) {
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [order, isLoading]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-sm text-gray-600 mt-2">
                Order #{order.orderNumber}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">Your Store Name</h2>
              <p className="text-sm text-gray-600 mt-1">123 Business Street</p>
              <p className="text-sm text-gray-600">City, State 12345</p>
              <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
              <p className="text-sm text-gray-600">Email: support@yourstore.com</p>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Bill To:</h3>
            <p className="text-sm text-gray-700">{order.user.name || 'N/A'}</p>
            <p className="text-sm text-gray-700">{order.user.email}</p>
          </div>
          {order.shippingAddress && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Ship To:</h3>
              <p className="text-sm text-gray-700">{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && (
                <p className="text-sm text-gray-700">{order.shippingAddress.address2}</p>
              )}
              <p className="text-sm text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 font-bold text-gray-900">Item</th>
                <th className="text-right py-3 px-2 font-bold text-gray-900">Price</th>
                <th className="text-center py-3 px-2 font-bold text-gray-900">Qty</th>
                <th className="text-right py-3 px-2 font-bold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {item.product.name}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700 text-right">
                    ${item.price.toString()}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700 text-center">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700 text-right">
                    ${item.total.toString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="text-gray-900 font-medium">
                ${order.subtotal.toString()}
              </span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-700">Tax:</span>
              <span className="text-gray-900 font-medium">
                ${order.tax.toString()}
              </span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-700">Shipping:</span>
              <span className="text-gray-900 font-medium">
                ${order.shipping.toString()}
              </span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-300 text-lg font-bold">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">${order.total.toString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            Thank you for your business!
          </p>
          <p className="text-xs text-gray-500 mt-2">
            If you have any questions about this invoice, please contact us at
            support@yourstore.com
          </p>
        </div>

        {/* Print button (hidden when printing) */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Print Invoice
          </button>
          <button
            onClick={() => window.close()}
            className="ml-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
