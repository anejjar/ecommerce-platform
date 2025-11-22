'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-hot-toast';
import { RotateCcw } from 'lucide-react';

interface OrderItem {
  id: string;
  product: { name: string };
  quantity: number;
  price: number;
  total: number;
}

interface RefundRequestButtonProps {
  orderId: string;
  orderNumber: string;
  orderItems: OrderItem[];
  paymentStatus: string;
  existingRefund?: any;
}

export function RefundRequestButton({
  orderId,
  orderNumber,
  orderItems,
  paymentStatus,
  existingRefund,
}: RefundRequestButtonProps) {
  const router = useRouter();
  const t = useTranslations('refund');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { selected: boolean; quantity: number }>
  >({});

  // Can't request refund if not paid or if refund already exists
  if (paymentStatus !== 'PAID' || existingRefund) {
    return null;
  }

  const handleItemToggle = (itemId: string, maxQuantity: number) => {
    setSelectedItems((prev) => {
      const current = prev[itemId];
      if (current?.selected) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemId]: { selected: true, quantity: maxQuantity },
      };
    });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }));
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast.error(t('selectReason'));
      return;
    }

    const items = Object.entries(selectedItems)
      .filter(([, data]) => data.selected)
      .map(([orderItemId, data]) => ({
        orderItemId,
        quantity: data.quantity,
      }));

    if (items.length === 0) {
      toast.error(t('selectItems'));
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          reason,
          reasonDetails,
          items,
          restockItems: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t('error'));
      }

      toast.success(t('success'));
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error('Error submitting refund:', error);
      toast.error(error.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          {t('requestButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('dialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('dialogDesc', { orderNumber })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">{t('reasonLabel')}</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder={t('reasonPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFECTIVE">{t('reasons.DEFECTIVE')}</SelectItem>
                <SelectItem value="WRONG_ITEM">{t('reasons.WRONG_ITEM')}</SelectItem>
                <SelectItem value="NOT_AS_DESCRIBED">{t('reasons.NOT_AS_DESCRIBED')}</SelectItem>
                <SelectItem value="CHANGED_MIND">{t('reasons.CHANGED_MIND')}</SelectItem>
                <SelectItem value="ARRIVED_LATE">{t('reasons.ARRIVED_LATE')}</SelectItem>
                <SelectItem value="OTHER">{t('reasons.OTHER')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="details">{t('detailsLabel')}</Label>
            <Textarea
              id="details"
              placeholder={t('detailsPlaceholder')}
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              rows={3}
            />
          </div>

          {/* Items to Refund */}
          <div className="space-y-2">
            <Label>{t('itemsLabel')}</Label>
            <div className="border rounded-lg p-4 space-y-3">
              {orderItems.map((item) => {
                const isSelected = selectedItems[item.id]?.selected || false;
                const selectedQty = selectedItems[item.id]?.quantity || item.quantity;

                return (
                  <div key={item.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleItemToggle(item.id, item.quantity)}
                      id={`item-${item.id}`}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`item-${item.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {item.product.name}
                      </label>
                      <p className="text-sm text-gray-600">
                        ${Number(item.price).toFixed(2)} × {item.quantity} = $
                        {Number(item.total).toFixed(2)}
                      </p>
                      {isSelected && item.quantity > 1 && (
                        <div className="mt-2">
                          <Label htmlFor={`qty-${item.id}`} className="text-xs">
                            {t('quantityToRefund')}
                          </Label>
                          <Select
                            value={selectedQty.toString()}
                            onValueChange={(val) =>
                              handleQuantityChange(item.id, parseInt(val))
                            }
                          >
                            <SelectTrigger id={`qty-${item.id}`} className="w-24 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: item.quantity }, (_, i) => i + 1).map(
                                (qty) => (
                                  <SelectItem key={qty} value={qty.toString()}>
                                    {qty}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <h4 className="font-semibold text-blue-900 mb-2">{t('policyTitle')}</h4>
            <ul className="space-y-1 text-blue-800">
              <li>• {t('policy.1')}</li>
              <li>• {t('policy.2')}</li>
              <li>• {t('policy.3')}</li>
              <li>• {t('policy.4')}</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t('submitting') : t('submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
