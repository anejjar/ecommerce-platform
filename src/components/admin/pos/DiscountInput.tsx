'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Tag, Percent, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface DiscountInputProps {
  subtotal: number;
  onDiscountApply: (discount: { code: string; type: string; amount: number } | null) => void;
  appliedDiscount: { code: string; type: string; amount: number } | null;
  className?: string;
}

export function DiscountInput({
  subtotal,
  onDiscountApply,
  appliedDiscount,
  className,
}: DiscountInputProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [manualDiscount, setManualDiscount] = useState('');
  const [manualDiscountType, setManualDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');

  const handleApplyCode = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/pos/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode.trim(),
          subtotal,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onDiscountApply({
          code: data.code,
          type: data.type,
          amount: parseFloat(data.discountAmount),
        });
        toast.success('Discount applied');
        setDiscountCode('');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error validating discount:', error);
      toast.error('Failed to validate discount');
    } finally {
      setIsValidating(false);
    }
  };

  const handleApplyManual = () => {
    const value = parseFloat(manualDiscount);
    if (isNaN(value) || value <= 0) {
      toast.error('Please enter a valid discount amount');
      return;
    }

    let amount = 0;
    if (manualDiscountType === 'PERCENTAGE') {
      if (value > 100) {
        toast.error('Percentage cannot exceed 100%');
        return;
      }
      amount = (subtotal * value) / 100;
    } else {
      if (value > subtotal) {
        toast.error('Discount cannot exceed subtotal');
        return;
      }
      amount = value;
    }

    onDiscountApply({
      code: `MANUAL-${manualDiscountType}`,
      type: manualDiscountType,
      amount,
    });
    toast.success('Manual discount applied');
    setManualDiscount('');
  };

  const handleRemove = () => {
    onDiscountApply(null);
    setDiscountCode('');
    setManualDiscount('');
    toast.success('Discount removed');
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-xs font-semibold">Discount</Label>
      
      {appliedDiscount ? (
        <div className="p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs font-semibold text-green-800 dark:text-green-200">
                  {appliedDiscount.code}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {appliedDiscount.type === 'PERCENTAGE' ? (
                    <>
                      <Percent className="h-3 w-3 inline" />
                      {((appliedDiscount.amount / subtotal) * 100).toFixed(0)}% off
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-3 w-3 inline" />
                      {appliedDiscount.amount.toFixed(2)} off
                    </>
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-600 hover:text-green-700"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Discount Code Input */}
          <div className="flex gap-1.5">
            <Input
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyCode();
                }
              }}
              className="h-10 text-sm flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3"
              onClick={handleApplyCode}
              disabled={!discountCode.trim() || isValidating}
            >
              {isValidating ? '...' : 'Apply'}
            </Button>
          </div>

          {/* Manual Discount */}
          <div className="flex gap-1.5">
            <Input
              type="number"
              placeholder="Amount"
              value={manualDiscount}
              onChange={(e) => setManualDiscount(e.target.value)}
              className="h-10 text-sm flex-1"
            />
            <select
              value={manualDiscountType}
              onChange={(e) => setManualDiscountType(e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT')}
              className="h-10 px-2 text-sm border rounded-md bg-background"
            >
              <option value="PERCENTAGE">%</option>
              <option value="FIXED_AMOUNT">$</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3"
              onClick={handleApplyManual}
              disabled={!manualDiscount || parseFloat(manualDiscount) <= 0}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

