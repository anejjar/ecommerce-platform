'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, CreditCard, Wallet, Split } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickPaymentButtonsProps {
  total: number;
  onPaymentSelect: (method: 'CASH' | 'CARD' | 'DIGITAL_WALLET' | 'SPLIT', amount?: number) => void;
  defaultMethod?: 'CASH' | 'CARD' | 'DIGITAL_WALLET' | 'SPLIT';
}

export function QuickPaymentButtons({ total, onPaymentSelect, defaultMethod = 'CASH' }: QuickPaymentButtonsProps) {
  const [selectedMethod, setSelectedMethod] = useState<'CASH' | 'CARD' | 'DIGITAL_WALLET' | 'SPLIT'>(defaultMethod);
  const [cashAmount, setCashAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const handleQuickCash = (amount: number) => {
    setSelectedMethod('CASH');
    setCashAmount(amount.toString());
    onPaymentSelect('CASH', amount);
  };

  const handleExactAmount = () => {
    setSelectedMethod('CASH');
    setCashAmount(total.toString());
    onPaymentSelect('CASH', total);
  };

  const handleCustomCash = () => {
    const amount = parseFloat(customAmount);
    if (amount >= total) {
      setSelectedMethod('CASH');
      setCashAmount(customAmount);
      onPaymentSelect('CASH', amount);
    }
  };

  const cashAmountNum = parseFloat(cashAmount) || 0;
  const change = cashAmountNum - total;

  return (
    <div className="space-y-3">
      {/* Quick Cash Buttons */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Quick Cash</Label>
        <div className="grid grid-cols-3 gap-1.5">
          <Button
            type="button"
            variant={selectedMethod === 'CASH' && cashAmount === '50' ? 'default' : 'outline'}
            className={cn(
              'h-11 text-sm font-semibold',
              selectedMethod === 'CASH' && cashAmount === '50' && 'bg-green-600 hover:bg-green-700'
            )}
            onClick={() => handleQuickCash(50)}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            $50
          </Button>
          <Button
            type="button"
            variant={selectedMethod === 'CASH' && cashAmount === '100' ? 'default' : 'outline'}
            className={cn(
              'h-11 text-sm font-semibold',
              selectedMethod === 'CASH' && cashAmount === '100' && 'bg-green-600 hover:bg-green-700'
            )}
            onClick={() => handleQuickCash(100)}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            $100
          </Button>
          <Button
            type="button"
            variant={selectedMethod === 'CASH' && cashAmount === total.toString() ? 'default' : 'outline'}
            className={cn(
              'h-11 text-sm font-semibold',
              selectedMethod === 'CASH' && cashAmount === total.toString() && 'bg-blue-600 hover:bg-blue-700'
            )}
            onClick={handleExactAmount}
          >
            Exact
          </Button>
        </div>
      </div>

      {/* Custom Cash Amount */}
      {selectedMethod === 'CASH' && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Custom Amount</Label>
          <div className="flex gap-1.5">
            <Input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomCash();
                }
              }}
              className="h-10 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 px-3"
              onClick={handleCustomCash}
              disabled={!customAmount || parseFloat(customAmount) < total}
            >
              Apply
            </Button>
          </div>
          {cashAmountNum > 0 && (
            <div className="p-2 bg-muted rounded-lg">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-muted-foreground">Received:</span>
                <span className="font-semibold">${cashAmountNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Change:</span>
                <span className={cn(change >= 0 ? 'text-green-600' : 'text-red-600')}>
                  ${change >= 0 ? change.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

