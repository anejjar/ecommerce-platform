'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearPosCart, removeFromPosCart, updatePosCartQuantity } from '@/lib/redux/features/posSlice';
import { defaultShortcuts, getNumberKeyQuantity, type ShortcutAction } from '@/lib/pos/keyboard-shortcuts';

interface KeyboardShortcutsProps {
  onPlaceOrder?: () => void;
  onPaymentSelect?: (method: 'CASH' | 'CARD' | 'DIGITAL_WALLET') => void;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  enabled?: boolean;
}

export function KeyboardShortcuts({
  onPlaceOrder,
  onPaymentSelect,
  onNavigate,
  enabled = true,
}: KeyboardShortcutsProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.pos.cart);

  const handleShortcut = useCallback(
    (action: ShortcutAction, e: KeyboardEvent) => {
      if (!enabled) return;

      switch (action) {
        case 'place-order':
          e.preventDefault();
          onPlaceOrder?.();
          break;
        case 'clear-cart':
          e.preventDefault();
          if (confirm('Clear cart?')) {
            dispatch(clearPosCart());
          }
          break;
        case 'payment-cash':
          e.preventDefault();
          onPaymentSelect?.('CASH');
          break;
        case 'payment-card':
          e.preventDefault();
          onPaymentSelect?.('CARD');
          break;
        case 'payment-digital':
          e.preventDefault();
          onPaymentSelect?.('DIGITAL_WALLET');
          break;
        case 'increase-quantity':
          if (cart.length > 0) {
            const lastItem = cart[cart.length - 1];
            dispatch(updatePosCartQuantity({ id: lastItem.id, quantity: lastItem.quantity + 1 }));
          }
          break;
        case 'decrease-quantity':
          if (cart.length > 0) {
            const lastItem = cart[cart.length - 1];
            if (lastItem.quantity > 1) {
              dispatch(updatePosCartQuantity({ id: lastItem.id, quantity: lastItem.quantity - 1 }));
            } else {
              dispatch(removeFromPosCart(lastItem.id));
            }
          }
          break;
        case 'remove-item':
          if (cart.length > 0) {
            const lastItem = cart[cart.length - 1];
            dispatch(removeFromPosCart(lastItem.id));
          }
          break;
        case 'navigate-up':
          onNavigate?.('up');
          break;
        case 'navigate-down':
          onNavigate?.('down');
          break;
        case 'navigate-left':
          onNavigate?.('left');
          break;
        case 'navigate-right':
          onNavigate?.('right');
          break;
      }
    },
    [enabled, dispatch, cart, onPlaceOrder, onPaymentSelect, onNavigate]
  );

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for number keys (1-9) for quantity
      const quantity = getNumberKeyQuantity(e.key);
      if (quantity && cart.length > 0 && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const lastItem = cart[cart.length - 1];
        dispatch(updatePosCartQuantity({ id: lastItem.id, quantity }));
        return;
      }

      // Check for shortcuts
      for (const shortcut of defaultShortcuts) {
        const keyMatch = shortcut.key === e.key || shortcut.key.toLowerCase() === e.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          handleShortcut(shortcut.action, e);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, cart, dispatch, handleShortcut]);

  return null; // This component doesn't render anything
}

