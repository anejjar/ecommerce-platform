'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitCost: string;
  receivedQuantity: number;
}

interface ProductInfo {
  id: string;
  name: string;
  sku: string | null;
  slug: string;
}

interface ReceivePurchaseOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    items: PurchaseOrderItem[];
  };
  products: Record<string, ProductInfo>;
  onSuccess: () => void;
}

export function ReceivePurchaseOrderDialog({
  isOpen,
  onClose,
  order,
  products,
  onSuccess,
}: ReceivePurchaseOrderDialogProps) {
  const [receivedQuantities, setReceivedQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    order.items.forEach((item) => {
      initial[item.id] = item.quantity - item.receivedQuantity;
    });
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReceiveAll = () => {
    const allQuantities: Record<string, number> = {};
    order.items.forEach((item) => {
      allQuantities[item.id] = item.quantity - item.receivedQuantity;
    });
    setReceivedQuantities(allQuantities);
  };

  const handleQuantityChange = (itemId: string, value: number) => {
    setReceivedQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate quantities
    const hasInvalidQuantities = order.items.some((item) => {
      const received = receivedQuantities[item.id] || 0;
      const remaining = item.quantity - item.receivedQuantity;
      return received < 0 || received > remaining;
    });

    if (hasInvalidQuantities) {
      toast.error('Invalid quantities. Please check the received quantities.');
      return;
    }

    const totalReceiving = Object.values(receivedQuantities).reduce((sum, qty) => sum + qty, 0);
    if (totalReceiving === 0) {
      toast.error('Please enter at least one quantity to receive');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/purchase-orders/${order.id}/receive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            receivedQuantity: receivedQuantities[item.id] || 0,
          })),
        }),
      });

      if (response.ok) {
        toast.success('Items received successfully');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to receive items');
      }
    } catch (error) {
      console.error('Receive error:', error);
      toast.error('An error occurred while receiving items');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Receive Purchase Order: {order.orderNumber}
          </DialogTitle>
          <DialogDescription>
            Enter the quantity received for each item. This will update your inventory stock levels.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Enter quantities below or receive all at once
            </p>
            <Button variant="outline" size="sm" onClick={handleReceiveAll}>
              Receive All
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Ordered</TableHead>
                  <TableHead className="text-right">Already Received</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead className="text-right">Receive Now</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => {
                  const product = products[item.productId];
                  const remaining = item.quantity - item.receivedQuantity;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <span className="font-medium">
                          {product?.name || 'Loading...'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product?.sku || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.receivedQuantity}</TableCell>
                      <TableCell className="text-right font-medium">{remaining}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          max={remaining}
                          value={receivedQuantities[item.id] || 0}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 text-right"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium mb-2">Summary</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-medium">{order.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Receiving:</span>
                <span className="font-medium">
                  {Object.values(receivedQuantities).reduce((sum, qty) => sum + qty, 0)} units
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Receiving...' : 'Confirm Receipt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
