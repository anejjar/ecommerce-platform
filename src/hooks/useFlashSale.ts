'use client'

import { useState, useEffect } from 'react'

interface FlashSaleData {
  flashSale: {
    id: string
    name: string
    description: string | null
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
    discountValue: number
    startDate: string
    endDate: string
    bannerImage: string | null
    bannerText: string | null
  } | null
  product: {
    originalPrice: number
    salePrice: number
    maxQuantity: number | null
    soldQuantity: number
    available: number | null
  } | null
}

export function useFlashSale(productId: string) {
  const [flashSaleData, setFlashSaleData] = useState<FlashSaleData>({
    flashSale: null,
    product: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFlashSale() {
      try {
        const response = await fetch(`/api/products/${productId}/flash-sale`)
        if (response.ok) {
          const data = await response.json()
          setFlashSaleData(data)
        }
      } catch (error) {
        console.error('Error fetching flash sale:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchFlashSale()
    } else {
      setLoading(false)
    }
  }, [productId])

  return { ...flashSaleData, loading }
}

