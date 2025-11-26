'use client'

import { useState } from 'react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { signOut } from 'next-auth/react'

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Client-side validation
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        toast.error('All fields are required')
        setLoading(false)
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match')
        setLoading(false)
        return
      }

      if (formData.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters')
        setLoading(false)
        return
      }

      if (formData.currentPassword === formData.newPassword) {
        toast.error('New password must be different from current password')
        setLoading(false)
        return
      }

      // Call API
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      // Success - show message and sign out
      toast.success('Password changed successfully! Redirecting to login...')
      onOpenChange(false)

      // Wait a bit for the toast to be visible, then sign out
      setTimeout(() => {
        signOut({ callbackUrl: '/admin/login' })
      }, 1500)
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast.error(error.message || 'Failed to change password')
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update your password. You will be logged out after changing your password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              For security reasons, you will need to log in again after changing your password.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              Current Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              placeholder="Enter current password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">
              New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="Min. 8 characters"
              required
              minLength={8}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Re-enter new password"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
