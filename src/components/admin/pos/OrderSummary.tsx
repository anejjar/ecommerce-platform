'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { clearPosCart } from '@/lib/redux/features/posSlice';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Trash2, Maximize2, ShoppingBag } from 'lucide-react';
import { removeFromPosCart, updatePosCartQuantity } from '@/lib/redux/features/posSlice';
import { QuickPaymentButtons } from './QuickPaymentButtons';
import { CustomerSearch } from './CustomerSearch';
import { DiscountInput } from './DiscountInput';
import { Save } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const TAX_RATE = 0.1; // 10% tax

export function OrderSummary() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.pos.cart);
  const orderType = useAppSelector((state) => state.pos.orderType);
  const locationId = useAppSelector((state) => state.pos.locationId);
  const cashierId = useAppSelector((state) => state.pos.cashierId);

  const [selectedPaymentMethod] = useState<'CASH' | 'CARD' | 'DIGITAL_WALLET' | 'SPLIT'>('CASH');
  const [cashAmount, setCashAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>(`#${Date.now().toString().slice(-6)}`);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string | null; email: string } | null>(null);
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; type: string; amount: number } | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const discount = appliedDiscount ? appliedDiscount.amount : 0;
  const total = subtotal + tax - discount;
  const change = cashAmount && cashAmount >= total ? cashAmount - total : 0;

  const handleRemove = (itemId: string) => {
    dispatch(removeFromPosCart(itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromPosCart(itemId));
    } else {
      dispatch(updatePosCartQuantity({ id: itemId, quantity }));
    }
  };

  // Always use CASH payment method - auto-set cash amount to total
  useEffect(() => {
    // Ensure cash amount is set to total if not set and cart has items
    if (cart.length > 0 && total > 0 && !cashAmount) {
      setCashAmount(total);
    }
  }, [cart.length, total]);

  // Keyboard shortcut: Enter to place order
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && cart.length > 0 && !isProcessing) {
        e.preventDefault();
        handlePlaceOrder();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cart.length, isProcessing, selectedPaymentMethod, cashAmount, total]);

  const handlePaymentSelect = (method: 'CASH' | 'CARD' | 'DIGITAL_WALLET' | 'SPLIT', amount?: number) => {
    // Only handle CASH payments
    if (method === 'CASH' && amount) {
      setCashAmount(amount);
    }
  };

  const handleHoldOrder = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
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
          customerId: selectedCustomer?.id || null,
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          tax,
          discount,
          discountCode: appliedDiscount?.code || null,
          discountType: appliedDiscount?.type || null,
          total,
          paymentMethod: 'CASH',
          notes: orderNotes || null,
        }),
      });

      if (!posOrderResponse.ok) {
        const errorData = await posOrderResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create POS order');
      }

      const posOrder = await posOrderResponse.json();

      // Hold the order
      const holdResponse = await fetch(`/api/pos/orders/${posOrder.id}/hold`, {
        method: 'POST',
      });

      if (!holdResponse.ok) {
        throw new Error('Failed to hold order');
      }

      toast.success('Order held successfully');

      // Clear cart and reset
      dispatch(clearPosCart());
      setCashAmount(null);
      setSelectedCustomer(null);
      setOrderNotes('');
      setAppliedDiscount(null);
      setOrderNumber(`#${Date.now().toString().slice(-6)}`);
    } catch (error) {
      console.error('Error holding order:', error);
      toast.error('Failed to hold order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!locationId || !cashierId) {
      toast.error('Location and cashier must be set');
      return;
    }

    // Force cash payment method
    const finalPaymentMethod = 'CASH';
    
    // Validate cash payment
    if (!cashAmount || cashAmount < total) {
      toast.error('Cash amount must be at least the total amount');
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
          customerId: selectedCustomer?.id || null,
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          tax,
          discount,
          discountCode: appliedDiscount?.code || null,
          discountType: appliedDiscount?.type || null,
          total,
          paymentMethod: finalPaymentMethod,
          paymentDetails: cashAmount
            ? { cashAmount, change }
            : null,
          notes: orderNotes || null,
        }),
      });

      if (!posOrderResponse.ok) {
        const errorData = await posOrderResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create POS order');
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
          discountCode: appliedDiscount?.code || null,
          total,
        }),
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to complete order');
      }

      const { order } = await completeResponse.json();

      // Process payment
      const paymentResponse = await fetch('/api/pos/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posOrderId: posOrder.id,
          paymentMethod: finalPaymentMethod,
          amount: total,
          paymentDetails: cashAmount
            ? { cashAmount, change }
            : null,
        }),
      });

      if (!paymentResponse.ok) {
        console.warn('Payment processing failed, but order was created');
      }

      toast.success(`Order ${order.orderNumber} placed successfully!`);

      // Clear cart and reset
      dispatch(clearPosCart());
      setCashAmount(null);
      setSelectedCustomer(null);
      setOrderNotes('');
      setAppliedDiscount(null);
      setOrderNumber(`#${Date.now().toString().slice(-6)}`);

      // Auto-print receipt if configured (future enhancement)
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <aside className="w-96 border-l bg-background flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b flex items-center justify-between bg-primary/5 flex-shrink-0">
        <div>
          <h3 className="font-semibold text-base">Order's Summary</h3>
          <p className="text-xs text-muted-foreground font-mono">{orderNumber}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-3 py-2 border-b bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Items ({cart.length})</p>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-3">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="relative w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0 border">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      title="Decrease quantity"
                    >
                      <span className="text-base font-bold">−</span>
                    </Button>
                    <div className="w-8 text-center">
                      <span className="text-sm font-bold">{item.quantity}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      title="Increase quantity"
                    >
                      <span className="text-base font-bold">+</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(item.id)}
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t space-y-3 bg-muted/20 flex-shrink-0 overflow-y-auto max-h-[60vh]">
        {/* Payment Summary */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Taxes:</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold pt-1.5 border-t">
            <span>Total:</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Discount Input */}
        {cart.length > 0 && (
          <DiscountInput
            subtotal={subtotal}
            onDiscountApply={setAppliedDiscount}
            appliedDiscount={appliedDiscount}
          />
        )}

        {/* Order Notes */}
        {cart.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Order Notes (Optional)</Label>
            <textarea
              className="w-full min-h-[60px] p-2 text-sm border rounded-md resize-none"
              placeholder="Add special instructions or notes..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>
        )}

        {/* Quick Payment Buttons */}
        {cart.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Payment Method</Label>
            <QuickPaymentButtons
              total={total}
              onPaymentSelect={handlePaymentSelect}
              defaultMethod={selectedPaymentMethod}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={cn(
              'flex-1 h-12 text-sm font-semibold',
              cart.length === 0 && 'opacity-50 cursor-not-allowed'
            )}
            onClick={handleHoldOrder}
            disabled={cart.length === 0 || isProcessing}
          >
            <Save className="h-4 w-4 mr-2" />
            Hold
          </Button>
          <Button
            className={cn(
              'flex-1 h-14 text-base font-bold',
              cart.length === 0 && 'opacity-50 cursor-not-allowed'
            )}
            size="lg"
            onClick={handlePlaceOrder}
            disabled={cart.length === 0 || isProcessing || !cashAmount || cashAmount < total}
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                Place Order {cart.length > 0 && `(${cart.length})`}
                <span className="ml-2 text-xs font-normal opacity-75">(Enter)</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}

