'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StockAlertConfigProps {
  productId: string;
  currentStock: number;
}

export function StockAlertConfig({ productId, currentStock }: StockAlertConfigProps) {
  const [threshold, setThreshold] = useState('10');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchAlert();
  }, [productId]);

  const fetchAlert = async () => {
    try {
      const response = await fetch(`/api/stock-alerts/${productId}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setThreshold(data.threshold.toString());
          setIsEnabled(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stock alert');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (isEnabled) {
        const response = await fetch(`/api/stock-alerts/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ threshold: parseInt(threshold) }),
        });

        if (response.ok) {
          alert('Stock alert configured successfully');
        } else {
          alert('Failed to configure stock alert');
        }
      } else {
        const response = await fetch(`/api/stock-alerts/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Stock alert removed successfully');
        } else {
          alert('Failed to remove stock alert');
        }
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  const isLowStock = currentStock <= parseInt(threshold);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Alert</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enableAlert"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="enableAlert">Enable low stock alerts for this product</Label>
        </div>

        {isEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="threshold">Alert when stock falls below:</Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                min="0"
              />
              <p className="text-sm text-gray-500">
                You'll be notified when stock reaches this level
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded border">
              <p className="text-sm font-medium mb-1">Current Status:</p>
              {isLowStock ? (
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ Stock is currently below threshold ({currentStock} / {threshold})
                </p>
              ) : (
                <p className="text-sm text-green-600">
                  ✓ Stock is above threshold ({currentStock} / {threshold})
                </p>
              )}
            </div>
          </>
        )}

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Alert Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}
