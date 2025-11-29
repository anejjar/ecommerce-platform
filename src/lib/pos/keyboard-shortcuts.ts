'use client';

export type ShortcutAction = 
  | 'add-item'
  | 'place-order'
  | 'clear-cart'
  | 'payment-cash'
  | 'payment-card'
  | 'payment-digital'
  | 'increase-quantity'
  | 'decrease-quantity'
  | 'remove-item'
  | 'navigate-up'
  | 'navigate-down'
  | 'navigate-left'
  | 'navigate-right';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: ShortcutAction;
  description: string;
}

export const defaultShortcuts: KeyboardShortcut[] = [
  {
    key: 'Enter',
    action: 'place-order',
    description: 'Place order',
  },
  {
    key: 'Escape',
    action: 'clear-cart',
    description: 'Clear cart',
  },
  {
    key: 'F1',
    action: 'payment-cash',
    description: 'Cash payment',
  },
  {
    key: 'F2',
    action: 'payment-card',
    description: 'Card payment',
  },
  {
    key: 'F3',
    action: 'payment-digital',
    description: 'Digital wallet',
  },
  {
    key: 'ArrowUp',
    action: 'navigate-up',
    description: 'Navigate up',
  },
  {
    key: 'ArrowDown',
    action: 'navigate-down',
    description: 'Navigate down',
  },
  {
    key: 'ArrowLeft',
    action: 'navigate-left',
    description: 'Navigate left',
  },
  {
    key: 'ArrowRight',
    action: 'navigate-right',
    description: 'Navigate right',
  },
  {
    key: '+',
    action: 'increase-quantity',
    description: 'Increase quantity',
  },
  {
    key: '-',
    action: 'decrease-quantity',
    description: 'Decrease quantity',
  },
  {
    key: 'Delete',
    action: 'remove-item',
    description: 'Remove item',
  },
];

export function getNumberKeyQuantity(key: string): number | null {
  const num = parseInt(key);
  if (!isNaN(num) && num >= 1 && num <= 9) {
    return num;
  }
  return null;
}

