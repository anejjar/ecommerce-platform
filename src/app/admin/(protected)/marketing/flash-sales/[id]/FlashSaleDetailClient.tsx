'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Play, Square, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { CountdownTimer } from '@/components/checkout/CountdownTimer'

interface FlashSale {
  id: string
  name: string
  description: string | null
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  startDate: Date
  endDate: Date
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED'
  isActive: boolean
  priority: number
  bannerImage: string | null
  bannerText: string | null
  products: any[]
  categories: any[]
}

export default function FlashSaleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    fetchFlashSale()
    fetchAnalytics()
  }, [id])

  const fetchFlashSale = async () => {
    try {
      const response = await fetch(`/api/admin/flash-sales/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch flash sale')
      }
      const data = await response.json()
      setFlashSale(data)
    } catch (error) {
      console.error('Error fetching flash sale:', error)
      toast.error('Failed to load flash sale')
      router.push('/admin/marketing/flash-sales')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/flash-sales/${id}/analytics`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const handleActivate = async () => {
    try {
      const response = await fetch(`/api/admin/flash-sales/${id}/activate`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to activate flash sale')
      }
      toast.success('Flash sale activated')
      fetchFlashSale()
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate flash sale')
    }
  }

  const handleDeactivate = async () => {
    try {
      const response = await fetch(`/api/admin/flash-sales/${id}/deactivate`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to deactivate flash sale')
      }
      toast.success('Flash sale deactivated')
      fetchFlashSale()
    } catch (error: any) {
      toast.error(error.message || 'Failed to deactivate flash sale')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading flash sale...</p>
        </div>
      </div>
    )
  }

  if (!flashSale) {
    return null
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SCHEDULED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    ENDED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/marketing/flash-sales">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{flashSale.name}</h1>
              <Badge className={statusColors[flashSale.status]}>
                {flashSale.status}
              </Badge>
            </div>
            {flashSale.description && (
              <p className="text-muted-foreground mt-1">{flashSale.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {flashSale.status === 'ACTIVE' ? (
            <Button variant="outline" onClick={handleDeactivate}>
              <Square className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          ) : (
            <Button onClick={handleActivate}>
              <Play className="h-4 w-4 mr-2" />
              Activate
            </Button>
          )}
        </div>
      </div>

      {flashSale.status === 'ACTIVE' && new Date(flashSale.endDate) > new Date() && (
        <Card>
          <CardContent className="pt-6">
            <CountdownTimer endDate={new Date(flashSale.endDate)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="products">
            Products ({flashSale.products.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Discount Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Discount Type</p>
                  <p className="font-semibold">{flashSale.discountType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discount Value</p>
                  <p className="font-semibold">
                    {flashSale.discountType === 'PERCENTAGE'
                      ? `${flashSale.discountValue}%`
                      : `$${flashSale.discountValue.toFixed(2)}`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-semibold">
                    {new Date(flashSale.startDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-semibold">
                    {new Date(flashSale.endDate).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products in Sale</CardTitle>
            </CardHeader>
            <CardContent>
              {flashSale.products.length === 0 ? (
                <p className="text-muted-foreground">No products added to this sale</p>
              ) : (
                <div className="space-y-2">
                  {flashSale.products.map((fsProduct: any) => (
                    <div
                      key={fsProduct.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{fsProduct.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${Number(fsProduct.originalPrice).toFixed(2)} → ${Number(fsProduct.salePrice).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Sold: {fsProduct.soldQuantity}
                          {fsProduct.maxQuantity !== null && ` / ${fsProduct.maxQuantity}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Sold</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{analytics.metrics.totalSold}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${analytics.metrics.totalRevenue.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Discount</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${analytics.metrics.totalDiscount.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading analytics...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

