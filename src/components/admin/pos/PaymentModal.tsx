'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { clearPosCart } from '@/lib/redux/features/posSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Wallet, DollarSign, Split } from 'lucide-react';
import { ReceiptGenerator } from './ReceiptGenerator';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
}

export function PaymentModal({
  open,
  onClose,
  total,
  subtotal,
  tax,
  discount,
}: PaymentModalProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.pos.cart);
  const orderType = useAppSelector((state) => state.pos.orderType);
  const locationId = useAppSelector((state) => state.pos.locationId);
  const cashierId = useAppSelector((state) => state.pos.cashierId);

  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'DIGITAL_WALLET' | 'SPLIT'>('CASH');
  const [cashAmount, setCashAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [printReceipt, setPrintReceipt] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const cashAmountNum = parseFloat(cashAmount) || 0;
  const change = cashAmountNum - total;

  const handleProcessPayment = async () => {
    if (paymentMethod === 'CASH' && cashAmountNum < total) {
      toast.error('Cash amount is less than total');
      return;
    }

    if (!locationId || !cashierId) {
      toast.error('Location and cashier must be set');
      return;
    }

    setIsProcessing(true);

    try {
      // Create POS order
      const posOrderResponse = await fetch('/api/pos/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType,
          locationId,
          cashierId,
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          tax,
          discount,
          total,
          paymentMethod,
        }),
      });

      if (!posOrderResponse.ok) {
        throw new Error('Failed to create POS order');
      }

      const posOrder = await posOrderResponse.json();

      // Complete the order (sync to main Order system)
      const completeResponse = await fetch(`/api/pos/orders/${posOrder.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          tax,
          discount,
          total,
        }),
      });

      if (!completeResponse.ok) {
        throw new Error('Failed to complete order');
      }

      const { order } = await completeResponse.json();

      // Process payment
      await fetch('/api/pos/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posOrderId: posOrder.id,
          paymentMethod,
          amount: total,
          paymentDetails: paymentMethod === 'CASH' ? { cashAmount, change } : null,
        }),
      });

      toast.success('Order placed successfully!');

      // Clear cart
      dispatch(clearPosCart());

      // Print receipt if requested
      if (printReceipt) {
        // Receipt printing will be handled by ReceiptGenerator
      }

      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="CASH">
              <DollarSign className="h-4 w-4 mr-2" />
              Cash
            </TabsTrigger>
            <TabsTrigger value="CARD">
              <CreditCard className="h-4 w-4 mr-2" />
              Card
            </TabsTrigger>
            <TabsTrigger value="DIGITAL_WALLET">
              <Wallet className="h-4 w-4 mr-2" />
              Digital
            </TabsTrigger>
            <TabsTrigger value="SPLIT">
              <Split className="h-4 w-4 mr-2" />
              Split
            </TabsTrigger>
          </TabsList>

          <TabsContent value="CASH" className="space-y-4">
            <div>
              <Label>Total Amount</Label>
              <Input value={`$${total.toFixed(2)}`} disabled />
            </div>
            <div>
              <Label>Cash Received</Label>
              <Input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            {cashAmountNum > 0 && (
              <div>
                <Label>Change</Label>
                <Input
                  value={`$${change >= 0 ? change.toFixed(2) : '0.00'}`}
                  disabled
                  className={change < 0 ? 'border-destructive' : ''}
                />
                {change < 0 && (
                  <p className="text-sm text-destructive mt-1">
                    Insufficient cash amount
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="CARD" className="space-y-4">
            <div>
              <Label>Card Number</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expiry Date</Label>
                <Input placeholder="MM/YY" />
              </div>
              <div>
                <Label>CVV</Label>
                <Input placeholder="123" type="password" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="DIGITAL_WALLET" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              Digital wallet payment integration coming soon
            </div>
          </TabsContent>

          <TabsContent value="SPLIT" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              Split payment feature coming soon
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2 pt-4">
          <input
            type="checkbox"
            id="print-receipt"
            checked={printReceipt}
            onChange={(e) => setPrintReceipt(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="print-receipt" className="cursor-pointer">
            Print Receipt
          </Label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleProcessPayment} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Process Payment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

