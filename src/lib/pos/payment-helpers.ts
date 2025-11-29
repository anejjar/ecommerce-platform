'use client';

export function calculateChange(received: number, total: number): number {
  return Math.max(0, received - total);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getQuickCashAmounts(total: number): number[] {
  // Suggest common cash amounts based on total
  const amounts: number[] = [];
  
  if (total <= 50) {
    amounts.push(50, 100);
  } else if (total <= 100) {
    amounts.push(100, 150, 200);
  } else if (total <= 200) {
    amounts.push(200, 250, 300);
  } else {
    // Round up to nearest 50
    const rounded = Math.ceil(total / 50) * 50;
    amounts.push(rounded, rounded + 50, rounded + 100);
  }
  
  return amounts;
}

