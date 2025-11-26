'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface ValidationError {
  row: number;
  field?: string;
  message: string;
  type: 'ERROR' | 'WARNING';
}

interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  preview?: any[];
}

interface ValidationResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validationResult: ValidationResult | null;
  onProceedToImport: () => void;
  isProcessing?: boolean;
}

export function ValidationResultsDialog({
  open,
  onOpenChange,
  validationResult,
  onProceedToImport,
  isProcessing = false,
}: ValidationResultsDialogProps) {
  if (!validationResult) return null;

  const hasErrors = validationResult.errors.length > 0;
  const hasWarnings = validationResult.warnings.length > 0;
  const canProceed = !hasErrors || validationResult.validRows > 0;

  const handleDownloadErrorReport = () => {
    try {
      // Create CSV content for error report
      const headers = ['Row', 'Type', 'Field', 'Message'];
      const allIssues = [
        ...validationResult.errors.map((e) => ({
          row: e.row,
          type: 'ERROR',
          field: e.field || '-',
          message: e.message,
        })),
        ...validationResult.warnings.map((w) => ({
          row: w.row,
          type: 'WARNING',
          field: w.field || '-',
          message: w.message,
        })),
      ];

      const csvContent = [
        headers.join(','),
        ...allIssues.map((issue) =>
          [issue.row, issue.type, issue.field, `"${issue.message}"`].join(',')
        ),
      ].join('\n');

      // Create and download blob
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `validation-errors-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Error report downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download error report');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Validation Results</DialogTitle>
          <DialogDescription>
            Review the validation results before proceeding with the import
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Total Rows</p>
              <p className="text-2xl font-bold">{validationResult.totalRows}</p>
            </div>
            <div className="border rounded-lg p-4 bg-green-50">
              <p className="text-sm text-green-700 mb-1">Valid Rows</p>
              <p className="text-2xl font-bold text-green-700">
                {validationResult.validRows}
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-red-50">
              <p className="text-sm text-red-700 mb-1">Invalid Rows</p>
              <p className="text-2xl font-bold text-red-700">
                {validationResult.invalidRows}
              </p>
            </div>
          </div>

          {/* Status Message */}
          {hasErrors && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">
                  {validationResult.errors.length} Error(s) Found
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {validationResult.validRows > 0
                    ? `You can still proceed to import ${validationResult.validRows} valid row(s), skipping the invalid ones.`
                    : 'Please fix the errors in your file and try again.'}
                </p>
              </div>
            </div>
          )}

          {hasWarnings && !hasErrors && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium">
                  {validationResult.warnings.length} Warning(s) Found
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  These warnings won't prevent the import, but you should review them.
                </p>
              </div>
            </div>
          )}

          {!hasErrors && !hasWarnings && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-800 font-medium">
                  Validation Successful
                </p>
                <p className="text-sm text-green-700 mt-1">
                  All rows passed validation. You can proceed with the import.
                </p>
              </div>
            </div>
          )}

          {/* Errors and Warnings */}
          {(hasErrors || hasWarnings) && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Issues Found</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadErrorReport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>

              <ScrollArea className="h-[200px] border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Row</TableHead>
                      <TableHead className="w-24">Type</TableHead>
                      <TableHead className="w-32">Field</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...validationResult.errors, ...validationResult.warnings]
                      .sort((a, b) => a.row - b.row)
                      .map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.row}</TableCell>
                          <TableCell>
                            <Badge
                              variant={issue.type === 'ERROR' ? 'destructive' : 'secondary'}
                            >
                              {issue.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {issue.field || '-'}
                          </TableCell>
                          <TableCell className="text-sm">{issue.message}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Preview */}
          {validationResult.preview && validationResult.preview.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">
                Preview (First {validationResult.preview.length} Valid Rows)
              </h3>
              <ScrollArea className="h-[200px] border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(validationResult.preview[0]).map((key) => (
                        <TableHead key={key} className="font-mono text-xs">
                          {key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResult.preview.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <TableCell key={cellIndex} className="text-sm">
                            {String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onProceedToImport}
            disabled={!canProceed || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? 'Processing...' : `Proceed to Import (${validationResult.validRows} rows)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
