'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setActiveSession } from '@/lib/redux/features/posSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface CashierSessionProps {
  open: boolean;
  onClose: () => void;
  action: 'open' | 'close';
}

export function CashierSession({ open, onClose, action }: CashierSessionProps) {
  const dispatch = useAppDispatch();
  const cashierId = useAppSelector((state) => state.pos.cashierId);
  const locationId = useAppSelector((state) => state.pos.locationId);
  const activeSessionId = useAppSelector((state) => state.pos.activeSessionId);

  const [openingCash, setOpeningCash] = useState('');
  const [closingCash, setClosingCash] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (action === 'close') {
      // Fetch session summary to show expected cash
      if (activeSessionId) {
        fetch(`/api/pos/sessions/${activeSessionId}/summary`)
          .then((res) => res.json())
          .then((data) => {
            if (data.summary?.expectedCash) {
              setClosingCash(data.summary.expectedCash.toString());
            }
          })
          .catch(console.error);
      }
    }
  }, [action, activeSessionId]);

  const handleSubmit = async () => {
    if (!cashierId) {
      toast.error('Cashier not set');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/pos/cashiers/${cashierId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          openingCash: action === 'open' ? parseFloat(openingCash) : undefined,
          closingCash: action === 'close' ? parseFloat(closingCash) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to manage session');
      }

      const data = await response.json();

      if (action === 'open') {
        dispatch(setActiveSession(data.id));
        toast.success('Session opened successfully');
      } else {
        dispatch(setActiveSession(null));
        toast.success('Session closed successfully');
      }

      onClose();
      setOpeningCash('');
      setClosingCash('');
    } catch (error) {
      console.error('Error managing session:', error);
      toast.error('Failed to manage session');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'open' ? 'Open Cashier Session' : 'Close Cashier Session'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {action === 'open' ? (
            <div>
              <Label htmlFor="opening-cash">Opening Cash Amount</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="opening-cash"
                  type="number"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="pl-10"
                />
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="closing-cash">Closing Cash Amount</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="closing-cash"
                  type="number"
                  value={closingCash}
                  onChange={(e) => setClosingCash(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Enter the actual cash amount in the drawer
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : action === 'open' ? 'Open Session' : 'Close Session'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

