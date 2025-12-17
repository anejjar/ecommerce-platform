import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { notFound, redirect } from 'next/navigation'
import { hasPermissionWithCustom, PermissionResource, PermissionAction } from './permissions'

/**
 * Server-side permission guard for page components
 * Checks if the user has the required permission and redirects/shows 404 if not
 *
 * @example
 * ```tsx
 * export default async function ProductsPage() {
 *   await requirePermission('PRODUCT', 'VIEW');
 *   // ... rest of page code
 * }
 * ```
 */
export async function requirePermission(
  resource: PermissionResource,
  action: PermissionAction,
  options: {
    redirect404?: boolean // If true, shows 404 instead of redirecting to login
  } = {}
): Promise<void> {
  const session = await getServerSession(authOptions)

  // Not authenticated - redirect to login
  if (!session?.user) {
    redirect('/admin/login')
  }

  // Check permission
  const hasAccess = await hasPermissionWithCustom(session.user.role, resource, action)

  if (!hasAccess) {
    if (options.redirect404) {
      notFound()
    } else {
      // Redirect to admin dashboard with error
      redirect('/admin?error=unauthorized')
    }
  }
}

/**
 * Check if current user has permission (for conditional rendering)
 * Returns the permission status and user role
 *
 * @example
 * ```tsx
 * export default async function ProductsPage() {
 *   const { hasAccess, role } = await checkPermission('PRODUCT', 'DELETE');
 *
 *   return (
 *     <div>
 *       {hasAccess && <DeleteButton />}
 *     </div>
 *   );
 * }
 * ```
 */
export async function checkPermission(
  resource: PermissionResource,
  action: PermissionAction
): Promise<{ hasAccess: boolean; role: string | undefined }> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { hasAccess: false, role: undefined }
  }

  const hasAccess = await hasPermissionWithCustom(session.user.role, resource, action)

  return {
    hasAccess,
    role: session.user.role,
  }
}

/**
 * Get current session with permission info
 * Useful for pages that need both session data and permission checks
 */
export async function getSessionWithPermissions() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  return {
    ...session,
    checkPermission: async (resource: PermissionResource, action: PermissionAction) => {
      return hasPermissionWithCustom(session.user.role, resource, action)
    },
  }
}
