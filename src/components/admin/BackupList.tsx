'use client';

import { useState } from 'react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Download, Trash2, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
  createdBy: {
    name: string | null;
    email: string;
  };
}

interface BackupListProps {
  backups: Backup[];
  onRefresh: () => void;
  onRestore: (backupId: string, options: RestoreOptions) => Promise<void>;
  onDelete: (backupId: string) => Promise<void>;
}

interface RestoreOptions {
  previewMode: boolean;
  conflictResolution: 'SKIP' | 'OVERWRITE';
}

export function BackupList({ backups, onRefresh, onRestore, onDelete }: BackupListProps) {
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<string | null>(null);
  const [restoreOptions, setRestoreOptions] = useState<RestoreOptions>({
    previewMode: false,
    conflictResolution: 'SKIP',
  });
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'secondary',
      IN_PROGRESS: 'default',
      COMPLETED: 'outline',
      FAILED: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (backup: Backup) => {
    if (!backup.fileUrl) {
      toast.error('Backup file not available');
      return;
    }

    try {
      const response = await fetch(backup.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backup.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Backup downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download backup');
    }
  };

  const handleRestoreClick = (backup: Backup) => {
    setSelectedBackup(backup);
    setRestoreDialogOpen(true);
    setConfirmationChecked(false);
  };

  const handleRestoreConfirm = async () => {
    if (!selectedBackup || !confirmationChecked) return;

    setIsRestoring(true);
    try {
      await onRestore(selectedBackup.id, restoreOptions);
      toast.success(restoreOptions.previewMode ? 'Preview completed' : 'Backup restored successfully');
      setRestoreDialogOpen(false);
      setSelectedBackup(null);
      setConfirmationChecked(false);
      onRefresh();
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('Failed to restore backup');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteClick = (backupId: string) => {
    setBackupToDelete(backupId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!backupToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(backupToDelete);
      toast.success('Backup deleted');
      setDeleteDialogOpen(false);
      setBackupToDelete(null);
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete backup');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Filename</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No backups found
                </TableCell>
              </TableRow>
            ) : (
              backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>
                    {formatDistanceToNow(new Date(backup.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="font-medium">{backup.filename}</TableCell>
                  <TableCell>{formatFileSize(backup.fileSize)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{backup.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {backup.recordCount !== null ? backup.recordCount.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(backup.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{backup.createdBy.name || 'Unknown'}</div>
                      <div className="text-gray-500 text-xs">{backup.createdBy.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {backup.status === 'COMPLETED' && backup.fileUrl && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(backup)}
                            title="Download backup"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreClick(backup)}
                            title="Restore backup"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(backup.id)}
                        title="Delete backup"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Restore Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Backup</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to restore the backup: <strong>{selectedBackup?.filename}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium">Warning</p>
              <p className="text-sm text-yellow-700 mt-1">
                Restoring this backup will modify your database. Make sure you understand the implications.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="previewMode"
                  checked={restoreOptions.previewMode}
                  onChange={(e) =>
                    setRestoreOptions({ ...restoreOptions, previewMode: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="previewMode" className="text-sm font-medium">
                  Preview mode (dry run - no changes will be made)
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Conflict Resolution</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="conflictResolution"
                      value="SKIP"
                      checked={restoreOptions.conflictResolution === 'SKIP'}
                      onChange={(e) =>
                        setRestoreOptions({
                          ...restoreOptions,
                          conflictResolution: e.target.value as 'SKIP' | 'OVERWRITE',
                        })
                      }
                    />
                    <span className="text-sm">Skip existing records</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="conflictResolution"
                      value="OVERWRITE"
                      checked={restoreOptions.conflictResolution === 'OVERWRITE'}
                      onChange={(e) =>
                        setRestoreOptions({
                          ...restoreOptions,
                          conflictResolution: e.target.value as 'SKIP' | 'OVERWRITE',
                        })
                      }
                    />
                    <span className="text-sm">Overwrite existing records</span>
                  </label>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="confirmation"
                  checked={confirmationChecked}
                  onChange={(e) => setConfirmationChecked(e.target.checked)}
                  className="mt-1 rounded"
                />
                <label htmlFor="confirmation" className="text-sm">
                  I understand this will modify the database and I have reviewed the options above
                </label>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreConfirm}
              disabled={!confirmationChecked || isRestoring}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRestoring ? 'Restoring...' : restoreOptions.previewMode ? 'Preview' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this backup? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
