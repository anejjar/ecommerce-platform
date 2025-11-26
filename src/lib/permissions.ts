import { UserRole } from '@prisma/client'

export type PermissionResource =
  | 'PRODUCT'
  | 'ORDER'
  | 'CUSTOMER'
  | 'CATEGORY'
  | 'REVIEW'
  | 'DISCOUNT'
  | 'SETTINGS'
  | 'ANALYTICS'
  | 'FEATURES'
  | 'ADMIN_USER'
  | 'STOCK_ALERT'
  | 'NEWSLETTER'
  | 'REFUND'
  | 'INVENTORY'
  | 'SUPPLIER'
  | 'PURCHASE_ORDER'

export type PermissionAction =
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'MANAGE'

/**
 * Default permissions for each role
 * Format: "RESOURCE:ACTION"
 */
const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPERADMIN: [
    // Has ALL permissions including feature management
    'PRODUCT:MANAGE',
    'ORDER:MANAGE',
    'CUSTOMER:MANAGE',
    'CATEGORY:MANAGE',
    'REVIEW:MANAGE',
    'DISCOUNT:MANAGE',
    'SETTINGS:MANAGE',
    'ANALYTICS:MANAGE',
    'FEATURES:MANAGE',
    'ADMIN_USER:MANAGE',
    'STOCK_ALERT:MANAGE',
    'NEWSLETTER:MANAGE',
    'REFUND:MANAGE',
    'INVENTORY:MANAGE',
    'SUPPLIER:MANAGE',
    'PURCHASE_ORDER:MANAGE',
  ],

  ADMIN: [
    // Has all permissions EXCEPT feature management
    'PRODUCT:MANAGE',
    'ORDER:MANAGE',
    'CUSTOMER:MANAGE',
    'CATEGORY:MANAGE',
    'REVIEW:MANAGE',
    'DISCOUNT:MANAGE',
    'SETTINGS:MANAGE',
    'ANALYTICS:MANAGE',
    'ADMIN_USER:MANAGE',
    'STOCK_ALERT:MANAGE',
    'NEWSLETTER:MANAGE',
    'REFUND:MANAGE',
    'INVENTORY:MANAGE',
    'SUPPLIER:MANAGE',
    'PURCHASE_ORDER:MANAGE',
  ],

  MANAGER: [
    // Can manage orders, view/update customers and products
    'ORDER:MANAGE',
    'CUSTOMER:VIEW',
    'CUSTOMER:UPDATE',
    'PRODUCT:VIEW',
    'PRODUCT:UPDATE',
    'PRODUCT:CREATE',
    'CATEGORY:VIEW',
    'REVIEW:VIEW',
    'REVIEW:UPDATE',
    'STOCK_ALERT:VIEW',
    'REFUND:VIEW',
    'REFUND:UPDATE',
    'INVENTORY:MANAGE',
    'SUPPLIER:VIEW',
    'PURCHASE_ORDER:MANAGE',
  ],

  EDITOR: [
    // Can edit products and categories
    'PRODUCT:VIEW',
    'PRODUCT:CREATE',
    'PRODUCT:UPDATE',
    'CATEGORY:MANAGE',
    'REVIEW:VIEW',
    'STOCK_ALERT:VIEW',
  ],

  SUPPORT: [
    // View-only access to orders and customers
    'ORDER:VIEW',
    'CUSTOMER:VIEW',
    'PRODUCT:VIEW',
    'CATEGORY:VIEW',
    'REVIEW:VIEW',
    'REFUND:VIEW',
  ],

  VIEWER: [
    // Read-only access to all resources
    'PRODUCT:VIEW',
    'ORDER:VIEW',
    'CUSTOMER:VIEW',
    'CATEGORY:VIEW',
    'REVIEW:VIEW',
    'DISCOUNT:VIEW',
    'ANALYTICS:VIEW',
    'STOCK_ALERT:VIEW',
    'NEWSLETTER:VIEW',
    'REFUND:VIEW',
  ],

  CUSTOMER: [],
}

/**
 * Get default permissions for a given role
 */
export function getDefaultPermissionsForRole(role: UserRole | string): string[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Check if a role has a specific permission
 * MANAGE permission grants all sub-permissions (VIEW, CREATE, UPDATE, DELETE)
 */
export function hasPermission(
  role: UserRole | string | undefined,
  resource: PermissionResource | string,
  action: PermissionAction | string
): boolean {
  if (!role) return false
  
  // SUPERADMIN has all permissions
  if (role === 'SUPERADMIN') return true

  const permissions = getDefaultPermissionsForRole(role)
  
  // Check exact permission
  const exactPermission = `${resource}:${action}`
  if (permissions.includes(exactPermission)) return true

  // If resource has MANAGE permission, it includes all actions
  const managePermission = `${resource}:MANAGE`
  if (permissions.includes(managePermission)) {
    // MANAGE grants VIEW, CREATE, UPDATE, DELETE
    if (['VIEW', 'CREATE', 'UPDATE', 'DELETE'].includes(action)) {
      return true
    }
  }

  return false
}

/**
 * Helper functions for common permission checks
 */
export function canViewResource(role: UserRole | string, resource: PermissionResource): boolean {
  return hasPermission(role, resource, 'VIEW')
}

export function canCreateResource(role: UserRole | string, resource: PermissionResource): boolean {
  return hasPermission(role, resource, 'CREATE')
}

export function canUpdateResource(role: UserRole | string, resource: PermissionResource): boolean {
  return hasPermission(role, resource, 'UPDATE')
}

export function canDeleteResource(role: UserRole | string, resource: PermissionResource): boolean {
  return hasPermission(role, resource, 'DELETE')
}

export function canManageResource(role: UserRole | string, resource: PermissionResource): boolean {
  return hasPermission(role, resource, 'MANAGE')
}

/**
 * Check if user is an admin (any admin role)
 */
export function isAdmin(role: UserRole | string | undefined): boolean {
  if (!role) return false
  return ['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'SUPPORT', 'VIEWER'].includes(role)
}

/**
 * Check if user is a super admin
 */
export function isSuperAdmin(role: UserRole | string | undefined): boolean {
  return role === 'SUPERADMIN'
}

/**
 * Get user's effective permissions (for display purposes)
 */
export function getUserPermissions(role: UserRole | string): {
  resource: string
  actions: string[]
}[] {
  const permissions = getDefaultPermissionsForRole(role)
  const grouped: Record<string, Set<string>> = {}

  permissions.forEach(permission => {
    const [resource, action] = permission.split(':')
    if (!grouped[resource]) {
      grouped[resource] = new Set()
    }
    
    if (action === 'MANAGE') {
      // MANAGE implies all actions
      grouped[resource].add('VIEW')
      grouped[resource].add('CREATE')
      grouped[resource].add('UPDATE')
      grouped[resource].add('DELETE')
      grouped[resource].add('MANAGE')
    } else {
      grouped[resource].add(action)
    }
  })

  return Object.entries(grouped).map(([resource, actions]) => ({
    resource,
    actions: Array.from(actions).sort(),
  }))
}
