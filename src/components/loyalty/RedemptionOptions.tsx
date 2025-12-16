'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Truck, Copy, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency } from '@/hooks/useCurrency';

interface RedemptionOptionsProps {
  pointsBalance: number;
  onRedeemSuccess: () => void;
}

export default function RedemptionOptions({ pointsBalance, onRedeemSuccess }: RedemptionOptionsProps) {
  const [redeeming, setRedeeming] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(100);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { symbol: currencySymbol } = useCurrency();

  const discountValue = Math.floor(pointsToRedeem / 100);
  const canRedeemDiscount = pointsBalance >= 100 && pointsToRedeem >= 100 && pointsToRedeem <= pointsBalance;
  const canRedeemShipping = pointsBalance >= 500;

  const handleRedeemDiscount = async () => {
    if (!canRedeemDiscount) return;

    try {
      setRedeeming(true);
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'discount',
          points: pointsToRedeem,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to redeem points');
      }

      const data = await response.json();
      setDiscountCode(data.discountCode);

      toast({
        title: 'Points Redeemed!',
        description: `You've received a ${currencySymbol}${data.discountValue} discount code`,
      });

      onRedeemSuccess();
    } catch (error: any) {
      toast({
        title: 'Redemption Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setRedeeming(false);
    }
  };

  const handleRedeemShipping = async () => {
    if (!canRedeemShipping) return;

    try {
      setRedeeming(true);
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'free_shipping',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to redeem points');
      }

      const data = await response.json();
      setDiscountCode(data.discountCode);

      toast({
        title: 'Free Shipping Redeemed!',
        description: `You've received a free shipping code`,
      });

      onRedeemSuccess();
    } catch (error: any) {
      toast({
        title: 'Redemption Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setRedeeming(false);
    }
  };

  const copyDiscountCode = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Discount code copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Gift className="h-5 w-5 text-purple-500" />
          <span>Redeem Points</span>
        </CardTitle>
        <CardDescription>Convert your points into rewards</CardDescription>
      </CardHeader>
      <CardContent>
        {discountCode ? (
          /* Show discount code after redemption */
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2 font-semibold">Your Discount Code:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-3 bg-white border border-green-300 rounded font-mono text-lg">
                  {discountCode}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyDiscountCode}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Use this code at checkout. Valid for 90 days.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setDiscountCode(null)}
            >
              Redeem More Points
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Code Redemption */}
            <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div className="flex items-center space-x-2 mb-3">
                <Gift className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Discount Code</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Redeem points for a discount on your next order</p>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="points">Points to Redeem</Label>
                  <Input
                    id="points"
                    type="number"
                    min="100"
                    step="100"
                    max={pointsBalance}
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
                    disabled={!canRedeemDiscount}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    = {currencySymbol}{discountValue} discount (100 points = {currencySymbol}1)
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleRedeemDiscount}
                  disabled={!canRedeemDiscount || redeeming}
                >
                  {redeeming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redeeming...
                    </>
                  ) : (
                    `Redeem ${pointsToRedeem} Points`
                  )}
                </Button>

                {pointsBalance < 100 && (
                  <p className="text-xs text-red-600">Need at least 100 points</p>
                )}
              </div>
            </div>

            {/* Free Shipping Redemption */}
            <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Free Shipping</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Redeem 500 points for free shipping on your next order</p>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <p className="text-2xl font-bold text-blue-900">500 Points</p>
                  <p className="text-sm text-blue-700">= Free Shipping</p>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleRedeemShipping}
                  disabled={!canRedeemShipping || redeeming}
                >
                  {redeeming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redeeming...
                    </>
                  ) : (
                    'Redeem for Free Shipping'
                  )}
                </Button>

                {pointsBalance < 500 && (
                  <p className="text-xs text-red-600">
                    Need {500 - pointsBalance} more points
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
