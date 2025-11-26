'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExportForm } from '@/components/admin/ExportForm';
import { Download, FileDown, RefreshCw, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface DataExport {
  id: string;
  type: string;
  format: string;
  status: string;
  filename: string | null;
  fileUrl: string | null;
  fileSize: number | null;
  recordCount: number | null;
  filters: string | null;
  errorMessage: string | null;
  createdAt: Date | string;
  completedAt: Date | string | null;
  expiresAt: Date | string | null;
  createdBy: {
    name: string | null;
    email: string;
  };
}

export default function ExportPage() {
  const [exports, setExports] = useState<DataExport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExports = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/export');
      if (!response.ok) {
        throw new Error('Failed to fetch exports');
      }
      const data = await response.json();
      setExports(data.exports);
    } catch (error) {
      console.error('Error fetching exports:', error);
      toast.error('Failed to load exports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExports();

    // Auto-refresh every 5 seconds if there are in-progress exports
    const interval = setInterval(() => {
      const hasInProgress = exports.some(
        (e) => e.status === 'IN_PROGRESS' || e.status === 'PENDING'
      );
      if (hasInProgress) {
        fetchExports();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchExports, exports]);

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

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes === 0) return '-';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (exportItem: DataExport) => {
    if (!exportItem.fileUrl) {
      toast.error('Export file not available');
      return;
    }

    try {
      const response = await fetch(exportItem.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportItem.filename || `export-${exportItem.id}.${exportItem.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Export downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download export');
    }
  };

  const handleDelete = async (exportId: string) => {
    if (!confirm('Are you sure you want to delete this export?')) return;

    try {
      const response = await fetch(`/api/admin/export/${exportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete export');
      }

      toast.success('Export deleted');
      fetchExports();
    } catch (error) {
      console.error('Error deleting export:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete export');
    }
  };

  const isExpired = (expiresAt: Date | string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileDown className="w-8 h-8" />
            Export Management
          </h1>
          <p className="text-gray-600 mt-2">
            Export your data in various formats for analysis or backup
          </p>
        </div>
        <Button variant="outline" onClick={fetchExports} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {exports.filter((e) => e.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {exports.filter((e) => e.status === 'IN_PROGRESS').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {exports.filter((e) => e.status === 'FAILED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Export Form */}
        <div className="lg:col-span-1">
          <ExportForm onExportCreated={fetchExports} />
        </div>

        {/* Recent Exports */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>View and download your exports</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Loading exports...</p>
                </div>
              ) : exports.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileDown className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No exports yet</p>
                  <p className="text-sm mt-1">Create your first export using the form</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exports.map((exportItem) => (
                        <TableRow key={exportItem.id}>
                          <TableCell>
                            <div className="text-sm">
                              {formatDistanceToNow(new Date(exportItem.createdAt), {
                                addSuffix: true,
                              })}
                            </div>
                            {exportItem.expiresAt && (
                              <div className="text-xs text-gray-500">
                                {isExpired(exportItem.expiresAt) ? (
                                  <span className="text-red-600">Expired</span>
                                ) : (
                                  `Expires ${formatDistanceToNow(new Date(exportItem.expiresAt), {
                                    addSuffix: true,
                                  })}`
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{exportItem.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{exportItem.format}</Badge>
                          </TableCell>
                          <TableCell>
                            {exportItem.recordCount !== null
                              ? exportItem.recordCount.toLocaleString()
                              : '-'}
                          </TableCell>
                          <TableCell>{formatFileSize(exportItem.fileSize)}</TableCell>
                          <TableCell>{getStatusBadge(exportItem.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {exportItem.status === 'COMPLETED' &&
                                exportItem.fileUrl &&
                                !isExpired(exportItem.expiresAt) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(exportItem)}
                                    title="Download export"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(exportItem.id)}
                                title="Delete export"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
