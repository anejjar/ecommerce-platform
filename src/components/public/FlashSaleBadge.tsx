'use client'

import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'

interface FlashSaleBadgeProps {
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
}

export function FlashSaleBadge({ discountType, discountValue }: FlashSaleBadgeProps) {
  const displayValue =
    discountType === 'PERCENTAGE'
      ? `${Math.round(discountValue)}% OFF`
      : `$${discountValue.toFixed(2)} OFF`

  return (
    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
      <Zap className="h-3 w-3 mr-1" />
      {displayValue}
    </Badge>
  )
}

