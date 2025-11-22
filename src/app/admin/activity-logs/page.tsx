import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import ActivityLogViewer from '@/components/admin/ActivityLogViewer'

export const metadata = {
  title: 'Activity Logs - Admin',
  description: 'View admin activity logs and audit trail',
}

export default async function ActivityLogsPage() {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/admin/login')
  }

  // Check permissions - only users with ADMIN_USER:VIEW can see activity logs
  if (!hasPermission(session.user.role, 'ADMIN_USER', 'VIEW')) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground mt-2">
          View and monitor all administrative actions and changes
        </p>
      </div>

      <ActivityLogViewer />
    </div>
  )
}
