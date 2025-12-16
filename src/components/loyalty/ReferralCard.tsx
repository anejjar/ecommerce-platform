'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Check, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReferralCardProps {
  referralCode: string;
}

export default function ReferralCard({ referralCode }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?ref=${referralCode}`
    : '';

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join and Get Rewards!',
          text: `Use my referral code ${referralCode} to get bonus points when you sign up!`,
          url: referralUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyReferralCode();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Users className="h-5 w-5 text-green-500" />
          <span>Refer Friends</span>
        </CardTitle>
        <CardDescription>
          Earn 500 points for each friend who signs up with your code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Referral Code Display */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-2 font-semibold">Your Referral Code:</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-3 bg-white border border-green-300 rounded font-mono text-lg text-center">
                {referralCode}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyReferralCode}
                className="flex-shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Share Button */}
          <Button
            className="w-full"
            variant="default"
            onClick={shareReferral}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Referral Link
          </Button>

          {/* How it Works */}
          <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
            <p className="font-semibold text-gray-900">How it works:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Share your referral code with friends</li>
              <li>They sign up and make their first purchase</li>
              <li>You both earn bonus points!</li>
              <li>You get 500 points, they get 250 points</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
