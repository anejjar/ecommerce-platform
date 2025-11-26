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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImportUpload } from '@/components/admin/ImportUpload';
import { ValidationResultsDialog } from '@/components/admin/ValidationResultsDialog';
import { Upload, FileUp, RefreshCw, Trash2, CheckCircle2, Play, AlertCircle, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface DataImport {
  id: string;
  type: string;
  format: string;
  mode: string;
  status: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  recordsProcessed: number | null;
  recordsSuccess: number | null;
  recordsFailed: number | null;
  recordsSkipped: number | null;
  validationResult: any | null;
  errorMessage: string | null;
  createdAt: Date | string;
  processedAt: Date | string | null;
  createdBy: {
    name: string | null;
    email: string;
  };
}

interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
    type: 'ERROR' | 'WARNING';
  }>;
  warnings: Array<{
    row: number;
    field?: string;
    message: string;
    type: 'ERROR' | 'WARNING';
  }>;
  preview?: any[];
}

export default function ImportPage() {
  const [imports, setImports] = useState<DataImport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateType, setTemplateType] = useState<string>('PRODUCTS');
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [currentValidationResult, setCurrentValidationResult] = useState<ValidationResult | null>(null);
  const [selectedImportId, setSelectedImportId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorsDialogOpen, setErrorsDialogOpen] = useState(false);
  const [currentErrors, setCurrentErrors] = useState<any>(null);

  const fetchImports = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/import');
      if (!response.ok) {
        throw new Error('Failed to fetch imports');
      }
      const data = await response.json();
      setImports(data.imports);
    } catch (error) {
      console.error('Error fetching imports:', error);
      toast.error('Failed to load imports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImports();

    // Auto-refresh every 5 seconds if there are in-progress imports
    const interval = setInterval(() => {
      const hasInProgress = imports.some(
        (i) => i.status === 'PROCESSING' || i.status === 'VALIDATING'
      );
      if (hasInProgress) {
        fetchImports();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchImports, imports]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'secondary',
      VALIDATING: 'default',
      VALIDATED: 'outline',
      PROCESSING: 'default',
      COMPLETED: 'outline',
      FAILED: 'destructive',
      PARTIAL: 'secondary',
    };

    const colors: Record<string, string> = {
      VALIDATED: 'text-green-600',
      COMPLETED: 'text-green-600',
    };

    return (
      <Badge variant={variants[status] || 'default'} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '-';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/export/template/${templateType}`);
      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateType.toLowerCase()}-template.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download template');
    }
  };

  const handleValidate = async (importId: string) => {
    setIsValidating(true);
    setSelectedImportId(importId);

    try {
      const response = await fetch(`/api/admin/import/${importId}/validate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Validation failed');
      }

      const data = await response.json();
      setCurrentValidationResult(data.validationResult);
      setValidationDialogOpen(true);
      toast.success('Validation completed');
      fetchImports();
    } catch (error) {
      console.error('Validation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to validate import');
    } finally {
      setIsValidating(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedImportId) return;

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/admin/import/${selectedImportId}/process`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Processing failed');
      }

      toast.success('Import processing started');
      setValidationDialogOpen(false);
      setSelectedImportId(null);
      setCurrentValidationResult(null);
      fetchImports();
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process import');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewErrors = (importItem: DataImport) => {
    setCurrentErrors(importItem.validationResult);
    setErrorsDialogOpen(true);
  };

  const handleDelete = async (importId: string) => {
    if (!confirm('Are you sure you want to delete this import?')) return;

    try {
      const response = await fetch(`/api/admin/import/${importId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete import');
      }

      toast.success('Import deleted');
      fetchImports();
    } catch (error) {
      console.error('Error deleting import:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete import');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileUp className="w-8 h-8" />
            Import Management
          </h1>
          <p className="text-gray-600 mt-2">
            Import data from CSV or JSON files into your store
          </p>
        </div>
        <Button variant="outline" onClick={fetchImports} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Imports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {imports.filter((i) => i.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Validated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {imports.filter((i) => i.status === 'VALIDATED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {imports.filter((i) => i.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {imports.filter((i) => i.status === 'FAILED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload & Template */}
        <div className="space-y-6">
          {/* Download Template */}
          <Card>
            <CardHeader>
              <CardTitle>Download Template</CardTitle>
              <CardDescription>
                Get a CSV template with the correct format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Select value={templateType} onValueChange={setTemplateType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCTS">Products</SelectItem>
                    <SelectItem value="ORDERS">Orders</SelectItem>
                    <SelectItem value="CUSTOMERS">Customers</SelectItem>
                    <SelectItem value="CATEGORIES">Categories</SelectItem>
                    <SelectItem value="INVENTORY">Inventory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleDownloadTemplate} className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Templates include:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Required fields</li>
                  <li>Optional fields</li>
                  <li>Example data</li>
                  <li>Field descriptions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Upload */}
          <ImportUpload onUploadComplete={fetchImports} />
        </div>

        {/* Right Column - Import History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>View and manage your data imports</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Loading imports...</p>
                </div>
              ) : imports.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No imports yet</p>
                  <p className="text-sm mt-1">Upload your first file to get started</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Filename</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {imports.map((importItem) => (
                        <TableRow key={importItem.id}>
                          <TableCell>
                            <div className="text-sm">
                              {formatDistanceToNow(new Date(importItem.createdAt), {
                                addSuffix: true,
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{importItem.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate text-sm">
                              {importItem.filename}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(importItem.fileSize)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{importItem.mode}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(importItem.status)}</TableCell>
                          <TableCell>
                            {importItem.recordsProcessed !== null ? (
                              <div className="text-sm">
                                <div className="text-green-600">
                                  {importItem.recordsSuccess || 0} success
                                </div>
                                {(importItem.recordsFailed || 0) > 0 && (
                                  <div className="text-red-600">
                                    {importItem.recordsFailed} failed
                                  </div>
                                )}
                                {(importItem.recordsSkipped || 0) > 0 && (
                                  <div className="text-gray-600">
                                    {importItem.recordsSkipped} skipped
                                  </div>
                                )}
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {importItem.status === 'PENDING' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleValidate(importItem.id)}
                                  disabled={isValidating}
                                  title="Validate import"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              {importItem.status === 'VALIDATED' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedImportId(importItem.id);
                                    if (importItem.validationResult) {
                                      setCurrentValidationResult(importItem.validationResult);
                                      setValidationDialogOpen(true);
                                    }
                                  }}
                                  title="Process import"
                                >
                                  <Play className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              {(importItem.status === 'FAILED' || importItem.status === 'PARTIAL') &&
                                importItem.validationResult && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewErrors(importItem)}
                                    title="View errors"
                                  >
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(importItem.id)}
                                title="Delete import"
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

      {/* Validation Results Dialog */}
      <ValidationResultsDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        validationResult={currentValidationResult}
        onProceedToImport={handleProcess}
        isProcessing={isProcessing}
      />

      {/* Errors Dialog */}
      <Dialog open={errorsDialogOpen} onOpenChange={setErrorsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Import Errors</DialogTitle>
            <DialogDescription>
              Review the errors that occurred during import processing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {currentErrors && (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium">
                    {currentErrors.errors?.length || 0} Error(s) Found
                  </p>
                </div>
                <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentErrors.errors?.map((error: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{error.row}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {error.field || '-'}
                          </TableCell>
                          <TableCell>{error.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
