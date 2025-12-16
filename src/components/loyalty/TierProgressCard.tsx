'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, ArrowRight, CheckCircle } from 'lucide-react';

interface TierProgressCardProps {
  currentTier: {
    name: string;
    color: string;
    icon: string;
    benefitsDescription: string;
  };
  nextTier: {
    tier: {
      name: string;
      pointsRequired: number;
      color: string;
      icon: string;
    };
    pointsNeeded: number;
    progress: number;
  } | null;
}

export default function TierProgressCard({ currentTier, nextTier }: TierProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Tier Progress</span>
        </CardTitle>
        <CardDescription>Your membership tier and benefits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tier */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2" style={{ borderColor: currentTier.color }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{currentTier.icon}</span>
              <span className="font-bold text-lg" style={{ color: currentTier.color }}>
                {currentTier.name} Member
              </span>
            </div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">{currentTier.benefitsDescription}</p>
        </div>

        {/* Progress to Next Tier */}
        {nextTier ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress to {nextTier.tier.name}</span>
              <span className="font-semibold text-gray-900">{Math.round(nextTier.progress)}%</span>
            </div>
            <Progress value={nextTier.progress} className="h-3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Need</span>
                <span className="font-bold text-gray-900">{nextTier.pointsNeeded.toLocaleString()}</span>
                <span className="text-gray-600">more points</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <span style={{ color: nextTier.tier.color }} className="font-semibold">
                  {nextTier.tier.icon} {nextTier.tier.name}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">Highest Tier Achieved!</p>
                <p className="text-sm text-yellow-700">You've reached the top tier. Enjoy all premium benefits!</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
