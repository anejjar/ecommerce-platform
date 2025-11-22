'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Plus, Search, Trash2, Edit, Shield } from 'lucide-react'
import { AddEditAdminUserDialog } from './AddEditAdminUserDialog'
import toast from 'react-hot-toast'
import { canCreateResource, canDeleteResource, canUpdateResource } from '@/lib/permissions'

interface AdminUser {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

interface AdminUsersClientProps {
  currentUserRole: string
}

const roleColors: Record<string, string> = {
  SUPERADMIN: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  ADMIN: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  MANAGER: 'bg-green-500/10 text-green-500 border-green-500/20',
  EDITOR: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  SUPPORT: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  VIEWER: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

const roleDescriptions: Record<string, string> = {
  SUPERADMIN: 'Full access including feature management',
  ADMIN: 'Full access except feature management',
  MANAGER: 'Manage orders, customers, and products',
  EDITOR: 'Edit products and categories',
  SUPPORT: 'View orders and customers',
  VIEWER: 'Read-only access',
}

export function AdminUsersClient({ currentUserRole }: AdminUsersClientProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)

  const limit = 10

  const canCreate = canCreateResource(currentUserRole, 'ADMIN_USER')
  const canUpdate = canUpdateResource(currentUserRole, 'ADMIN_USER')
  const canDelete = canDeleteResource(currentUserRole, 'ADMIN_USER')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (search) {
        params.append('search', search)
      }

      if (roleFilter !== 'all') {
        params.append('role', roleFilter)
      }

      const response = await fetch(`/api/admin/users?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load admin users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, roleFilter])

  const handleSearch = () => {
    setPage(1)
    fetchUsers()
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this admin user?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete user')
      }

      toast.success('Admin user deleted successfully')
      fetchUsers()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error(error.message || 'Failed to delete admin user')
    }
  }

  const handleDialogClose = () => {
    setIsAddDialogOpen(false)
    setEditingUser(null)
  }

  const handleUserSaved = () => {
    fetchUsers()
    handleDialogClose()
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} variant="secondary">
              Search
            </Button>
          </div>

          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>

            {canCreate && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin User
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {(canUpdate || canDelete) && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No admin users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name || 'No name'}</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge className={roleColors[user.role] || ''} variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {roleDescriptions[user.role]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  {(canUpdate || canDelete) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canUpdate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && user.role !== 'SUPERADMIN' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <AddEditAdminUserDialog
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        onUserSaved={handleUserSaved}
        editingUser={editingUser}
        currentUserRole={currentUserRole}
      />
    </div>
  )
}
