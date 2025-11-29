'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import toast from 'react-hot-toast'
import { Plus, Clock, TrendingUp, DollarSign, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

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
  createdAt: Date
  updatedAt: Date
  products: {
    id: string
    productId: string
    originalPrice: number
    salePrice: number
    maxQuantity: number | null
    soldQuantity: number
    product: {
      id: string
      name: string
      price: number
    }
  }[]
  categories: {
    id: string
    categoryId: string
    category: {
      id: string
      name: string
    }
  }[]
}

interface Stats {
  total: number
  active: number
  scheduled: number
  ended: number
  totalProducts: number
  totalRevenue: number
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  ACTIVE: 'bg-green-100 text-green-800',
  ENDED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-orange-100 text-orange-800',
}

export default function FlashSalesPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [flashSales, setFlashSales] = useState<FlashSale[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (sessionStatus === 'loading') return

    if (
      !session ||
      !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)
    ) {
      router.push('/admin')
      return
    }

    fetchFlashSales()
  }, [session, sessionStatus, router, filter])

  const fetchFlashSales = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('status', filter.toUpperCase())
      }

      const response = await fetch(`/api/admin/flash-sales?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch flash sales')
      }

      const data = await response.json()
      setFlashSales(data)

      // Calculate stats
      const total = data.length
      const active = data.filter((s: FlashSale) => s.status === 'ACTIVE').length
      const scheduled = data.filter((s: FlashSale) => s.status === 'SCHEDULED').length
      const ended = data.filter((s: FlashSale) => s.status === 'ENDED').length
      const totalProducts = data.reduce((sum: number, s: FlashSale) => sum + s.products.length, 0)
      const totalRevenue = data.reduce((sum: number, s: FlashSale) => {
        return sum + s.products.reduce((pSum: number, p: any) => {
          return pSum + (Number(p.salePrice) * p.soldQuantity)
        }, 0)
      }, 0)

      setStats({
        total,
        active,
        scheduled,
        ended,
        totalProducts,
        totalRevenue,
      })
    } catch (error) {
      console.error('Error fetching flash sales:', error)
      toast.error('Failed to load flash sales')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flash sale?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/flash-sales/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete flash sale')
      }

      toast.success('Flash sale deleted successfully')
      fetchFlashSales()
    } catch (error) {
      console.error('Error deleting flash sale:', error)
      toast.error('Failed to delete flash sale')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading flash sales...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flash Sales</h1>
          <p className="text-muted-foreground mt-1">
            Manage time-limited promotional sales
          </p>
        </div>
        <Link href="/admin/marketing/flash-sales/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Flash Sale
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active, {stats.scheduled} scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sales</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Across all sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From flash sales</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flash Sales</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sales</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchFlashSales}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {flashSales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No flash sales found</p>
              <Link href="/admin/marketing/flash-sales/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Flash Sale
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {flashSales.map((sale) => (
                <Card key={sale.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>{sale.name}</CardTitle>
                          <Badge className={statusColors[sale.status]}>
                            {sale.status}
                          </Badge>
                        </div>
                        {sale.description && (
                          <CardDescription>{sale.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/marketing/flash-sales/${sale.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(sale.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Discount</p>
                        <p className="font-semibold">
                          {sale.discountType === 'PERCENTAGE'
                            ? `${sale.discountValue}%`
                            : `$${sale.discountValue.toFixed(2)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Products</p>
                        <p className="font-semibold">{sale.products.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">
                          {new Date(sale.startDate).toLocaleDateString()} -{' '}
                          {new Date(sale.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

