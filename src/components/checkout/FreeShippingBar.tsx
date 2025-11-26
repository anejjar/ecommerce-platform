'use client';

import { Truck } from 'lucide-react';

interface FreeShippingBarProps {
  currentTotal: number;
  threshold: number;
  text?: string;
}

export function FreeShippingBar({ currentTotal, threshold, text }: FreeShippingBarProps) {
  const remaining = Math.max(0, threshold - currentTotal);
  const percentage = Math.min(100, (currentTotal / threshold) * 100);
  const isEligible = currentTotal >= threshold;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Truck className={`h-5 w-5 ${isEligible ? 'text-green-600' : 'text-gray-500'}`} />
        <span className="text-sm font-medium">
          {isEligible ? (
            <span className="text-green-700">🎉 You've qualified for free shipping!</span>
          ) : (
            <span className="text-gray-700">
              {text
                ? text.replace('{amount}', `${remaining.toFixed(2)} MAD`)
                : `Add ${remaining.toFixed(2)} MAD more for free shipping!`}
            </span>
          )}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            isEligible ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
