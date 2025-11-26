'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';

interface RecentPurchasePopupProps {
  show: boolean;
  delay?: number;
}

const samplePurchases = [
  { name: 'Sarah M.', location: 'Casablanca', product: 'Premium Laptop', time: '5 minutes ago' },
  { name: 'Ahmed K.', location: 'Rabat', product: 'Wireless Mouse', time: '12 minutes ago' },
  { name: 'Fatima B.', location: 'Marrakech', product: 'Blue T-Shirt', time: '18 minutes ago' },
  { name: 'Hassan L.', location: 'Fes', product: 'Programming Book', time: '25 minutes ago' },
  { name: 'Amina R.', location: 'Tangier', product: 'Classic Jeans', time: '32 minutes ago' },
];

export function RecentPurchasePopup({ show, delay = 5000 }: RecentPurchasePopupProps) {
  const [visible, setVisible] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(samplePurchases[0]);
  const [purchaseIndex, setPurchaseIndex] = useState(0);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, [show]);

  useEffect(() => {
    if (!show || !visible) return;

    const cycleTimer = setInterval(() => {
      const nextIndex = (purchaseIndex + 1) % samplePurchases.length;
      setPurchaseIndex(nextIndex);
      setCurrentPurchase(samplePurchases[nextIndex]);

      // Show popup again
      setVisible(false);
      setTimeout(() => setVisible(true), 500);
    }, delay);

    return () => clearInterval(cycleTimer);
  }, [show, visible, purchaseIndex, delay]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-up">
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <ShoppingBag className="h-5 w-5 text-green-600" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">Recent Purchase</p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{currentPurchase.name}</span> from{' '}
              <span className="font-medium">{currentPurchase.location}</span>
            </p>
            <p className="text-sm text-gray-600 mb-1">purchased {currentPurchase.product}</p>
            <p className="text-xs text-gray-500">{currentPurchase.time}</p>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Verified purchase
          </p>
        </div>
      </div>
    </div>
  );
}

// Add this to your global CSS for the slide-up animation
// @keyframes slide-up {
//   from {
//     transform: translateY(100px);
//     opacity: 0;
//   }
//   to {
//     transform: translateY(0);
//     opacity: 1;
//   }
// }
// .animate-slide-up {
//   animation: slide-up 0.5s ease-out;
// }
