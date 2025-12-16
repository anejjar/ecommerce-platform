'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Clock } from 'lucide-react';

interface PointsBalanceCardProps {
  pointsBalance: number;
  lifetimePoints: number;
  tier: {
    name: string;
    color: string;
    icon: string;
    pointsMultiplier: number;
  };
  expiringPoints: number;
}

export default function PointsBalanceCard({
  pointsBalance,
  lifetimePoints,
  tier,
  expiringPoints,
}: PointsBalanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Points Balance</CardTitle>
          <Badge
            style={{ backgroundColor: tier.color }}
            className="text-white"
          >
            {tier.icon} {tier.name}
          </Badge>
        </div>
        <CardDescription>Your loyalty rewards summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Balance */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg">
              <Coins className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Points</p>
              <p className="text-2xl font-bold text-gray-900">{pointsBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Lifetime Points */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-600">Lifetime Points</span>
          </div>
          <span className="font-semibold text-gray-900">{lifetimePoints.toLocaleString()}</span>
        </div>

        {/* Points Multiplier */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Points Multiplier</span>
          </div>
          <span className="font-semibold text-gray-900">{tier.pointsMultiplier}x</span>
        </div>

        {/* Expiring Points Warning */}
        {expiringPoints > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">{expiringPoints.toLocaleString()} points</span> expiring in the next 30 days
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
