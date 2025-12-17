'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BackupList } from '@/components/admin/BackupList';
import { Database, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Backup {
  id: string;
  filename: string;
  fileSize: number;
  fileUrl: string | null;
  type: string;
  status: string;
  recordCount: number | null;
  createdAt: Date | string;
  completedAt: Date | string | null;
  errorMessage: string | null;
  includeProducts: boolean;
  includeOrders: boolean;
  includeCustomers: boolean;
  includeMedia: boolean;
  includeSettings: boolean;
  createdBy: {
    name: string | null;
    email: string;
  };
}

interface RestoreOptions {
  previewMode: boolean;
  conflictResolution: 'SKIP' | 'OVERWRITE';
}

export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Create backup form state
  const [backupOptions, setBackupOptions] = useState({
    includeProducts: true,
    includeOrders: true,
    includeCustomers: true,
    includeMedia: false,
    includeSettings: true,
    type: 'MANUAL' as 'MANUAL' | 'SCHEDULED',
  });

  const fetchBackups = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/backup');
      if (!response.ok) {
        throw new Error('Failed to fetch backups');
      }
      const data = await response.json();
      setBackups(data.backups);
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast.error('Failed to load backups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();

    // Auto-refresh every 5 seconds if there are in-progress backups
    const interval = setInterval(() => {
      const hasInProgress = backups.some(
        (b) => b.status === 'IN_PROGRESS' || b.status === 'PENDING'
      );
      if (hasInProgress) {
        fetchBackups();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchBackups, backups]);

  const handleCreateBackup = async () => {
    setIsCreating(true);

    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupOptions),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create backup');
      }

      const data = await response.json();
      toast.success('Backup started successfully');
      setCreateDialogOpen(false);

      // Reset form
      setBackupOptions({
        includeProducts: true,
        includeOrders: true,
        includeCustomers: true,
        includeMedia: false,
        includeSettings: true,
        type: 'MANUAL',
      });

      // Refresh backups list
      fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create backup');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestore = async (backupId: string, options: RestoreOptions) => {
    try {
      const response = await fetch(`/api/admin/backup/${backupId}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to restore backup');
      }

      const data = await response.json();

      if (options.previewMode) {
        toast.success('Preview completed successfully');
        console.log('Preview results:', data);
      } else {
        toast.success('Backup restored successfully');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  };

  const handleDelete = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backup/${backupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete backup');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="w-8 h-8" />
            Backup Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage database backups for disaster recovery
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBackups} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Backup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Backup</DialogTitle>
                <DialogDescription>
                  Select what to include in the backup
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Include in Backup</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeProducts"
                        checked={backupOptions.includeProducts}
                        onCheckedChange={(checked) =>
                          setBackupOptions({ ...backupOptions, includeProducts: !!checked })
                        }
                      />
                      <Label htmlFor="includeProducts" className="font-normal">
                        Products
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeOrders"
                        checked={backupOptions.includeOrders}
                        onCheckedChange={(checked) =>
                          setBackupOptions({ ...backupOptions, includeOrders: !!checked })
                        }
                      />
                      <Label htmlFor="includeOrders" className="font-normal">
                        Orders
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCustomers"
                        checked={backupOptions.includeCustomers}
                        onCheckedChange={(checked) =>
                          setBackupOptions({ ...backupOptions, includeCustomers: !!checked })
                        }
                      />
                      <Label htmlFor="includeCustomers" className="font-normal">
                        Customers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeMedia"
                        checked={backupOptions.includeMedia}
                        onCheckedChange={(checked) =>
                          setBackupOptions({ ...backupOptions, includeMedia: !!checked })
                        }
                      />
                      <Label htmlFor="includeMedia" className="font-normal">
                        Media (metadata only)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeSettings"
                        checked={backupOptions.includeSettings}
                        onCheckedChange={(checked) =>
                          setBackupOptions({ ...backupOptions, includeSettings: !!checked })
                        }
                      />
                      <Label htmlFor="includeSettings" className="font-normal">
                        Settings
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Backup Type</Label>
                  <RadioGroup
                    value={backupOptions.type}
                    onValueChange={(value) =>
                      setBackupOptions({ ...backupOptions, type: value as 'MANUAL' | 'SCHEDULED' })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MANUAL" id="manual" />
                      <Label htmlFor="manual" className="font-normal">
                        Manual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SCHEDULED" id="scheduled" />
                      <Label htmlFor="scheduled" className="font-normal">
                        Scheduled
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBackup} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Backup'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Backups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {backups.filter((b) => b.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {backups.filter((b) => b.status === 'IN_PROGRESS').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {backups.filter((b) => b.status === 'FAILED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>All Backups</CardTitle>
          <CardDescription>View and manage your database backups</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Loading backups...</p>
            </div>
          ) : (
            <BackupList
              backups={backups}
              onRefresh={fetchBackups}
              onRestore={handleRestore}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
