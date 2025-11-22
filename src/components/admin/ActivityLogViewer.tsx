'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ActivityLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  user: {
    name: string
    email: string
    role: string
  }
}

interface ActivityLogViewerProps {
  initialLogs?: ActivityLog[]
  initialTotal?: number
}

export default function ActivityLogViewer({
  initialLogs = [],
  initialTotal = 0,
}: ActivityLogViewerProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 20))
  const [loading, setLoading] = useState(false)

  // Filters
  const [userIdFilter, setUserIdFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [resourceFilter, setResourceFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [page, actionFilter, resourceFilter])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (actionFilter) params.append('action', actionFilter)
      if (resourceFilter) params.append('resource', resourceFilter)
      if (userIdFilter) params.append('userId', userIdFilter)

      const response = await fetch(`/api/admin/activity-logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch logs')

      const data = await response.json()
      setLogs(data.logs)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching logs:', error)
      toast.error('Failed to load activity logs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchLogs()
  }

  const clearFilters = () => {
    setActionFilter('')
    setResourceFilter('')
    setUserIdFilter('')
    setSearchTerm('')
    setPage(1)
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'VIEW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
  }

  const filteredLogs = searchTerm
    ? logs.filter(
        (log) =>
          log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : logs

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Actions</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
            <SelectItem value="VIEW">View</SelectItem>
          </SelectContent>
        </Select>

        <Select value={resourceFilter} onValueChange={setResourceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Resources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Resources</SelectItem>
            <SelectItem value="ADMIN_USER">Admin User</SelectItem>
            <SelectItem value="PRODUCT">Product</SelectItem>
            <SelectItem value="ORDER">Order</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="CATEGORY">Category</SelectItem>
            <SelectItem value="SETTINGS">Settings</SelectItem>
            <SelectItem value="FEATURES">Features</SelectItem>
          </SelectContent>
        </Select>

        {(actionFilter || resourceFilter || searchTerm) && (
          <Button variant="outline" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No activity logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{log.user.name}</div>
                      <div className="text-xs text-muted-foreground">{log.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionBadgeColor(log.action)}>{log.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">{log.resource}</span>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="text-sm truncate" title={log.details}>
                      {log.details || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.ipAddress || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
          {Math.min(page * limit, total)} of {total} logs
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center px-3 text-sm">
            Page {page} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
