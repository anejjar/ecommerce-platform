'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Shield, Plus, Trash2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ROLES = ['MANAGER', 'EDITOR', 'SUPPORT', 'VIEWER'];

const RESOURCES = [
  'PRODUCT', 'ORDER', 'CUSTOMER', 'CATEGORY', 'REVIEW', 'DISCOUNT', 'SETTINGS',
  'ANALYTICS', 'FEATURES', 'ADMIN_USER', 'STOCK_ALERT', 'NEWSLETTER', 'REFUND',
  'INVENTORY', 'SUPPLIER', 'PURCHASE_ORDER', 'TEMPLATE', 'MEDIA', 'POPUP',
  'BACKUP', 'EXPORT', 'IMPORT', 'CMS', 'PAGE', 'BLOG', 'EMAIL_CAMPAIGN',
  'FLASH_SALE', 'INVOICE', 'POS', 'LOYALTY', 'THEME', 'SEO'
];

const ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'MANAGE'];

interface Permission {
  id: string;
  role: string;
  resource: string;
  action: string;
  createdAt: string;
}

export default function PermissionsClient() {
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/admin/permissions');
      if (response.ok) {
        const data = await response.json();
        setPermissions(data);
      } else {
        toast.error('Failed to fetch permissions');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async () => {
    if (!selectedRole || !selectedResource || !selectedAction) {
      toast.error('Please select role, resource, and action');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          resource: selectedResource,
          action: selectedAction,
        }),
      });

      if (response.ok) {
        toast.success('Permission added successfully');
        setDialogOpen(false);
        setSelectedRole('');
        setSelectedResource('');
        setSelectedAction('');
        fetchPermissions();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add permission');
      }
    } catch (error) {
      console.error('Error adding permission:', error);
      toast.error('Failed to add permission');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePermission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;

    try {
      const response = await fetch(`/api/admin/permissions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Permission deleted successfully');
        fetchPermissions();
      } else {
        toast.error('Failed to delete permission');
      }
    } catch (error) {
      console.error('Error deleting permission:', error);
      toast.error('Failed to delete permission');
    }
  };

  const groupedPermissions = ROLES.reduce((acc, role) => {
    acc[role] = permissions.filter(p => p.role === role);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Permissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage custom permissions for different roles beyond their default permissions
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Permission
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Custom permissions are <strong>additive</strong> - they grant additional access beyond each role's default permissions.
          SUPERADMIN and ADMIN roles already have full access to most resources and cannot be restricted here.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {ROLES.map(role => (
          <Card key={role}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {role}
                <Badge variant="outline" className="ml-2">
                  {groupedPermissions[role]?.length || 0} custom permissions
                </Badge>
              </CardTitle>
              <CardDescription>
                Additional permissions granted to users with the {role} role
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groupedPermissions[role]?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedPermissions[role].map(permission => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">{permission.resource}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{permission.action}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(permission.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePermission(permission.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No custom permissions for this role
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Permission Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Permission</DialogTitle>
            <DialogDescription>
              Grant additional permission to a role. This will allow users with this role to perform the selected action on the resource.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="resource">Resource</Label>
              <Select value={selectedResource} onValueChange={setSelectedResource}>
                <SelectTrigger id="resource">
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCES.map(resource => (
                    <SelectItem key={resource} value={resource}>
                      {resource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="action">Action</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIONS.map(action => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                MANAGE grants VIEW, CREATE, UPDATE, and DELETE permissions
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPermission} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Permission'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
