import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  hasPermission,
  canViewResource,
  canCreateResource,
  canUpdateResource,
  canDeleteResource,
  canManageResource,
  getDefaultPermissionsForRole,
} from '@/lib/permissions'

describe('Permission System', () => {
  describe('getDefaultPermissionsForRole', () => {
    it('SUPERADMIN should have all permissions', () => {
      const permissions = getDefaultPermissionsForRole('SUPERADMIN')
      
      // SUPERADMIN has MANAGE permissions which includes all sub-permissions
      expect(permissions).toContain('PRODUCT:MANAGE')
      expect(permissions).toContain('ORDER:MANAGE')
      expect(permissions).toContain('CUSTOMER:MANAGE')
      expect(permissions).toContain('FEATURES:MANAGE')
      expect(permissions.length).toBeGreaterThan(10)
    })

    it('ADMIN should have all permissions except FEATURES', () => {
      const permissions = getDefaultPermissionsForRole('ADMIN')
      
      expect(permissions).toContain('PRODUCT:MANAGE')
      expect(permissions).toContain('ORDER:MANAGE')
      expect(permissions).toContain('CUSTOMER:MANAGE')
      expect(permissions).not.toContain('FEATURES:MANAGE')
    })

    it('MANAGER should have order, customer, and product management', () => {
      const permissions = getDefaultPermissionsForRole('MANAGER')
      
      expect(permissions).toContain('ORDER:MANAGE')
      expect(permissions).toContain('CUSTOMER:VIEW')
      expect(permissions).toContain('CUSTOMER:UPDATE')
      expect(permissions).toContain('PRODUCT:VIEW')
      expect(permissions).toContain('PRODUCT:UPDATE')
      expect(permissions).not.toContain('PRODUCT:DELETE')
      expect(permissions).not.toContain('SETTINGS:MANAGE')
    })

    it('EDITOR should have product and category edit permissions', () => {
      const permissions = getDefaultPermissionsForRole('EDITOR')
      
      expect(permissions).toContain('PRODUCT:VIEW')
      expect(permissions).toContain('PRODUCT:CREATE')
      expect(permissions).toContain('PRODUCT:UPDATE')
      expect(permissions).toContain('CATEGORY:MANAGE')
      expect(permissions).not.toContain('PRODUCT:DELETE')
      expect(permissions).not.toContain('ORDER:MANAGE')
    })

    it('SUPPORT should have view-only access to orders and customers', () => {
      const permissions = getDefaultPermissionsForRole('SUPPORT')
      
      expect(permissions).toContain('ORDER:VIEW')
      expect(permissions).toContain('CUSTOMER:VIEW')
      expect(permissions).not.toContain('ORDER:UPDATE')
      expect(permissions).not.toContain('ORDER:DELETE')
      expect(permissions).not.toContain('PRODUCT:MANAGE')
    })

    it('VIEWER should have view-only access to all resources', () => {
      const permissions = getDefaultPermissionsForRole('VIEWER')
      
      expect(permissions).toContain('PRODUCT:VIEW')
      expect(permissions).toContain('ORDER:VIEW')
      expect(permissions).toContain('CUSTOMER:VIEW')
      expect(permissions).not.toContain('PRODUCT:CREATE')
      expect(permissions).not.toContain('ORDER:UPDATE')
      expect(permissions).not.toContain('CUSTOMER:DELETE')
    })

    it('CUSTOMER should have no admin permissions', () => {
      const permissions = getDefaultPermissionsForRole('CUSTOMER')
      
      expect(permissions).toEqual([])
    })
  })

  describe('hasPermission', () => {
    it('should return true for SUPERADMIN with any permission', () => {
      expect(hasPermission('SUPERADMIN', 'PRODUCT', 'DELETE')).toBe(true)
      expect(hasPermission('SUPERADMIN', 'FEATURES', 'MANAGE')).toBe(true)
      expect(hasPermission('SUPERADMIN', 'ORDER', 'VIEW')).toBe(true)
    })

    it('should check MANAGE permission as having all sub-permissions', () => {
      expect(hasPermission('ADMIN', 'PRODUCT', 'VIEW')).toBe(true)
      expect(hasPermission('ADMIN', 'PRODUCT', 'CREATE')).toBe(true)
      expect(hasPermission('ADMIN', 'PRODUCT', 'UPDATE')).toBe(true)
      expect(hasPermission('ADMIN', 'PRODUCT', 'DELETE')).toBe(true)
    })

    it('should return false for insufficient permissions', () => {
      expect(hasPermission('VIEWER', 'PRODUCT', 'DELETE')).toBe(false)
      expect(hasPermission('SUPPORT', 'ORDER', 'DELETE')).toBe(false)
      expect(hasPermission('EDITOR', 'CUSTOMER', 'MANAGE')).toBe(false)
    })

    it('should return false for CUSTOMER role', () => {
      expect(hasPermission('CUSTOMER', 'PRODUCT', 'VIEW')).toBe(false)
      expect(hasPermission('CUSTOMER', 'ORDER', 'VIEW')).toBe(false)
    })
  })

  describe('Resource-specific permission helpers', () => {
    it('canViewResource should check VIEW permission', () => {
      expect(canViewResource('VIEWER', 'PRODUCT')).toBe(true)
      expect(canViewResource('SUPPORT', 'ORDER')).toBe(true)
      expect(canViewResource('CUSTOMER', 'PRODUCT')).toBe(false)
    })

    it('canCreateResource should check CREATE permission', () => {
      expect(canCreateResource('EDITOR', 'PRODUCT')).toBe(true)
      expect(canCreateResource('ADMIN', 'PRODUCT')).toBe(true)
      expect(canCreateResource('VIEWER', 'PRODUCT')).toBe(false)
      expect(canCreateResource('SUPPORT', 'PRODUCT')).toBe(false)
    })

    it('canUpdateResource should check UPDATE permission', () => {
      expect(canUpdateResource('MANAGER', 'PRODUCT')).toBe(true)
      expect(canUpdateResource('EDITOR', 'PRODUCT')).toBe(true)
      expect(canUpdateResource('VIEWER', 'PRODUCT')).toBe(false)
    })

    it('canDeleteResource should check DELETE permission', () => {
      expect(canDeleteResource('ADMIN', 'PRODUCT')).toBe(true)
      expect(canDeleteResource('SUPERADMIN', 'PRODUCT')).toBe(true)
      expect(canDeleteResource('MANAGER', 'PRODUCT')).toBe(false)
      expect(canDeleteResource('EDITOR', 'PRODUCT')).toBe(false)
    })

    it('canManageResource should check MANAGE permission', () => {
      expect(canManageResource('ADMIN', 'PRODUCT')).toBe(true)
      expect(canManageResource('MANAGER', 'ORDER')).toBe(true)
      expect(canManageResource('EDITOR', 'CATEGORY')).toBe(true)
      expect(canManageResource('VIEWER', 'PRODUCT')).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined role gracefully', () => {
      expect(hasPermission(undefined as any, 'PRODUCT', 'VIEW')).toBe(false)
    })

    it('should handle invalid resource gracefully', () => {
      expect(hasPermission('ADMIN', 'INVALID_RESOURCE' as any, 'VIEW')).toBe(false)
    })

    it('should handle invalid action gracefully', () => {
      expect(hasPermission('ADMIN', 'PRODUCT', 'INVALID_ACTION' as any)).toBe(false)
    })
  })
})
