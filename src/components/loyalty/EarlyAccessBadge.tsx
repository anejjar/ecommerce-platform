'use client';

import { Sparkles, Clock } from 'lucide-react';

interface EarlyAccessBadgeProps {
  tierName: string;
  earlyAccessHours: number;
}

export default function EarlyAccessBadge({ tierName, earlyAccessHours }: EarlyAccessBadgeProps) {
  return (
    <div className="p-4 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 border-2 border-purple-300 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white rounded-lg">
          <Sparkles className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-purple-900 flex items-center space-x-2">
            <span>VIP Early Access Unlocked!</span>
          </h3>
          <p className="text-sm text-purple-700 flex items-center space-x-1 mt-1">
            <Clock className="h-4 w-4" />
            <span>
              As a {tierName} member, you get {earlyAccessHours}-hour early access to flash sales and new products
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
