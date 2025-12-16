'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PointsBalanceCard from '@/components/loyalty/PointsBalanceCard';
import TierProgressCard from '@/components/loyalty/TierProgressCard';
import TransactionHistory from '@/components/loyalty/TransactionHistory';
import RedemptionOptions from '@/components/loyalty/RedemptionOptions';
import ReferralCard from '@/components/loyalty/ReferralCard';
import EarlyAccessBadge from '@/components/loyalty/EarlyAccessBadge';

interface LoyaltyAccount {
  account: {
    id: string;
    pointsBalance: number;
    lifetimePoints: number;
    referralCode: string;
    enrolledAt: string;
    lastActivityAt: string;
  };
  tier: {
    id: string;
    name: string;
    color: string;
    icon: string;
    pointsRequired: number;
    benefitsDescription: string;
    earlyAccessEnabled: boolean;
    earlyAccessHours: number;
    discountPercentage: number;
    pointsMultiplier: number;
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
  recentTransactions: any[];
  recentRedemptions: any[];
  expiration: {
    expiring7Days: number;
    expiring30Days: number;
    nextExpiration: any;
  };
}

export default function LoyaltyDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLoyaltyAccount();
    }
  }, [status]);

  const fetchLoyaltyAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/loyalty/account');

      if (!response.ok) {
        throw new Error('Failed to fetch loyalty account');
      }

      const data = await response.json();
      setAccount(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load loyalty account');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Loyalty account not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Loyalty Rewards</h1>
        <p className="mt-2 text-gray-600">
          Earn points on every purchase and unlock exclusive benefits
        </p>
      </div>

      {/* Early Access Badge */}
      {account.tier.earlyAccessEnabled && (
        <div className="mb-6">
          <EarlyAccessBadge
            tierName={account.tier.name}
            earlyAccessHours={account.tier.earlyAccessHours}
          />
        </div>
      )}

      {/* Points Balance & Tier Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PointsBalanceCard
          pointsBalance={account.account.pointsBalance}
          lifetimePoints={account.account.lifetimePoints}
          tier={account.tier}
          expiringPoints={account.expiration.expiring30Days}
        />
        <TierProgressCard
          currentTier={account.tier}
          nextTier={account.nextTier}
        />
      </div>

      {/* Redemption Options */}
      <div className="mb-8">
        <RedemptionOptions
          pointsBalance={account.account.pointsBalance}
          onRedeemSuccess={fetchLoyaltyAccount}
        />
      </div>

      {/* Referral Card */}
      <div className="mb-8">
        <ReferralCard referralCode={account.account.referralCode} />
      </div>

      {/* Transaction History */}
      <div>
        <TransactionHistory
          accountId={account.account.id}
          recentTransactions={account.recentTransactions}
        />
      </div>
    </div>
  );
}
