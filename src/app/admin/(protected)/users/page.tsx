import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'
import { isFeatureEnabled } from '@/lib/features'
import { AdminUsersClient } from '@/components/admin/AdminUsersClient'

export const metadata = {
  title: 'Admin Users | Admin Panel',
  description: 'Manage admin users and their permissions',
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  // Check authentication
  if (!session?.user) {
    redirect('/admin/login')
  }

  // Check if feature is enabled
  const featureEnabled = await isFeatureEnabled('multi_admin')
  if (!featureEnabled) {
    notFound()
  }

  // Check permissions - only SUPERADMIN and ADMIN can view this page
  if (!hasPermission(session.user.role, 'ADMIN_USER', 'VIEW')) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
        <p className="text-muted-foreground">
          Manage admin users and their roles
        </p>
      </div>

      <AdminUsersClient currentUserRole={session.user.role} />
    </div>
  )
}
