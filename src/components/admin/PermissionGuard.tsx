'use client'

import { useSession } from 'next-auth/react'
import { hasPermission, PermissionResource, PermissionAction } from '@/lib/permissions'
import { ReactNode } from 'react'

interface PermissionGuardProps {
  resource: PermissionResource
  action: PermissionAction
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Client-side component to conditionally render content based on permissions
 *
 * Note: This uses default role permissions only (not custom database permissions)
 * For server-side permission checks with custom permissions, use requirePermission()
 *
 * @example
 * ```tsx
 * <PermissionGuard resource="PRODUCT" action="DELETE">
 *   <DeleteButton />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
  resource,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { data: session } = useSession()

  if (!session?.user?.role) {
    return <>{fallback}</>
  }

  const hasAccess = hasPermission(session.user.role, resource, action)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook to check permissions in client components
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const canDelete = usePermission('PRODUCT', 'DELETE');
 *
 *   return canDelete ? <DeleteButton /> : null;
 * }
 * ```
 */
export function usePermission(resource: PermissionResource, action: PermissionAction): boolean {
  const { data: session } = useSession()

  if (!session?.user?.role) {
    return false
  }

  return hasPermission(session.user.role, resource, action)
}

/**
 * Hook to get all permission checks for a resource
 *
 * @example
 * ```tsx
 * function ProductActions() {
 *   const permissions = useResourcePermissions('PRODUCT');
 *
 *   return (
 *     <div>
 *       {permissions.canView && <ViewButton />}
 *       {permissions.canCreate && <CreateButton />}
 *       {permissions.canUpdate && <EditButton />}
 *       {permissions.canDelete && <DeleteButton />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useResourcePermissions(resource: PermissionResource) {
  const { data: session } = useSession()
  const role = session?.user?.role

  return {
    canView: role ? hasPermission(role, resource, 'VIEW') : false,
    canCreate: role ? hasPermission(role, resource, 'CREATE') : false,
    canUpdate: role ? hasPermission(role, resource, 'UPDATE') : false,
    canDelete: role ? hasPermission(role, resource, 'DELETE') : false,
    canManage: role ? hasPermission(role, resource, 'MANAGE') : false,
  }
}
