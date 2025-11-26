'use client';

import { Shield, Phone, Mail, CheckCircle2, TrendingUp } from 'lucide-react';
import { TrustBadge } from '@/types/checkout-settings';

interface TrustBadgesProps {
  badges: TrustBadge[];
  position?: 'header' | 'footer' | 'sidebar' | 'payment';
}

export function TrustBadges({ badges, position }: TrustBadgesProps) {
  const filteredBadges = position
    ? badges.filter((badge) => badge.position === position)
    : badges;

  if (!filteredBadges || filteredBadges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3">
      {filteredBadges.map((badge) => (
        <div key={badge.id} className="opacity-70 hover:opacity-100 transition-opacity">
          {badge.link ? (
            <a href={badge.link} target="_blank" rel="noopener noreferrer">
              <img src={badge.url} alt={badge.alt} className="h-8 object-contain grayscale hover:grayscale-0 transition-all" />
            </a>
          ) : (
            <img src={badge.url} alt={badge.alt} className="h-8 object-contain" />
          )}
        </div>
      ))}
    </div>
  );
}

interface SecuritySealsProps {
  show: boolean;
}

export function SecuritySeals({ show }: SecuritySealsProps) {
  if (!show) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Shield className="h-5 w-5 text-green-600" />
        <span className="font-medium">Secure Checkout</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CheckCircle2 className="h-5 w-5 text-blue-600" />
        <span>SSL Encrypted</span>
      </div>
    </div>
  );
}

interface MoneyBackGuaranteeProps {
  message: string;
}

export function MoneyBackGuarantee({ message }: MoneyBackGuaranteeProps) {
  if (!message) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-green-900 mb-1">Money-Back Guarantee</h4>
        <p className="text-sm text-green-800">{message}</p>
      </div>
    </div>
  );
}

interface CustomerServiceDisplayProps {
  show: boolean;
  text?: string;
  phone?: string;
  email?: string;
}

export function CustomerServiceDisplay({ show, text, phone, email }: CustomerServiceDisplayProps) {
  if (!show) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
        <Phone className="h-5 w-5" />
        Need Help? We're Here!
      </h4>
      {text && <p className="text-sm text-blue-800 mb-2">{text}</p>}
      <div className="space-y-1 text-sm">
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <a href={`tel:${phone}`} className="text-blue-600 hover:underline font-medium">
              {phone}
            </a>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <a href={`mailto:${email}`} className="text-blue-600 hover:underline font-medium">
              {email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

interface TrustRatingProps {
  show: boolean;
  score?: number;
  count?: number;
}

export function TrustRating({ show, score, count }: TrustRatingProps) {
  if (!show || !score) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-1">
        <TrendingUp className="h-5 w-5 text-yellow-600" />
        <span className="text-2xl font-bold text-yellow-900">{score.toFixed(1)}</span>
        <span className="text-sm text-yellow-700">/5</span>
      </div>
      {count && (
        <span className="text-sm text-yellow-800">
          Based on <span className="font-semibold">{count.toLocaleString()}</span> reviews
        </span>
      )}
    </div>
  );
}

interface OrderCountTickerProps {
  show: boolean;
  text?: string;
}

export function OrderCountTicker({ show, text }: OrderCountTickerProps) {
  if (!show) return null;

  // Simulate dynamic count (in real app, fetch from API)
  const orderCount = Math.floor(Math.random() * 50) + 10;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center justify-center gap-2 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-orange-500 rounded-full h-2 w-2"></div>
        </div>
        <span className="text-sm font-medium text-orange-900">
          {text ? text.replace('X', orderCount.toString()) : `${orderCount} orders placed in the last hour!`}
        </span>
      </div>
    </div>
  );
}
