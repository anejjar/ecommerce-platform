'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { getUserPermissions } from '@/lib/permissions'

interface AdminUser {
  id: string
  name: string | null
  email: string
  role: string
}

interface AddEditAdminUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserSaved: () => void
  editingUser: AdminUser | null
  currentUserRole: string
}

const roleOptions = [
  { value: 'ADMIN', label: 'Admin', description: 'Full access except feature management' },
  { value: 'MANAGER', label: 'Manager', description: 'Manage orders, customers, and products' },
  { value: 'EDITOR', label: 'Editor', description: 'Edit products and categories' },
  { value: 'SUPPORT', label: 'Support', description: 'View orders and customers' },
  { value: 'VIEWER', label: 'Viewer', description: 'Read-only access' },
]

// Only SUPERADMIN can create SUPERADMIN users
const superAdminOption = {
  value: 'SUPERADMIN',
  label: 'Super Admin',
  description: 'Full access including feature management',
}

export function AddEditAdminUserDialog({
  open,
  onOpenChange,
  onUserSaved,
  editingUser,
  currentUserRole,
}: AddEditAdminUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'MANAGER',
    password: '',
    confirmPassword: '',
  })
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<
    { resource: string; actions: string[] }[]
  >([])

  const isEditing = !!editingUser
  const isSuperAdmin = currentUserRole === 'SUPERADMIN'

  // Available roles based on current user's role
  const availableRoles = isSuperAdmin
    ? [superAdminOption, ...roleOptions]
    : roleOptions

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email,
        role: editingUser.role,
        password: '',
        confirmPassword: '',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'MANAGER',
        password: '',
        confirmPassword: '',
      })
    }
  }, [editingUser, open])

  useEffect(() => {
    // Update permissions preview when role changes
    const permissions = getUserPermissions(formData.role)
    setSelectedRolePermissions(permissions)
  }, [formData.role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!isEditing && !formData.password) {
        toast.error('Password is required')
        setLoading(false)
        return
      }

      if (!isEditing && formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        setLoading(false)
        return
      }

      if (!isEditing && formData.password.length < 8) {
        toast.error('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }

      if (!isEditing) {
        payload.password = formData.password
      }

      const url = isEditing
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'

      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save user')
      }

      toast.success(
        isEditing ? 'Admin user updated successfully' : 'Admin user created successfully'
      )
      onUserSaved()
    } catch (error: any) {
      console.error('Error saving user:', error)
      toast.error(error.message || 'Failed to save admin user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Admin User' : 'Add New Admin User'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update admin user information and role'
              : 'Create a new admin user with specific role and permissions'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@example.com"
              required
              disabled={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Permissions Preview */}
          {selectedRolePermissions.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Role Permissions:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedRolePermissions.slice(0, 5).map((perm) => (
                    <Badge key={perm.resource} variant="secondary" className="text-xs">
                      {perm.resource}: {perm.actions.join(', ')}
                    </Badge>
                  ))}
                  {selectedRolePermissions.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedRolePermissions.length - 5} more
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!isEditing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
