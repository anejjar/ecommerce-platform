'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImportUploadProps {
  onUploadComplete: () => void;
}

export function ImportUpload({ onUploadComplete }: ImportUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>('PRODUCTS');
  const [importMode, setImportMode] = useState<string>('CREATE');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];

      // Validate file type
      const validExtensions = ['csv', 'json'];
      const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        toast.error('Invalid file type. Please upload CSV or JSON files only.');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (uploadedFile.size > maxSize) {
        toast.error('File is too large. Maximum size is 10MB.');
        return;
      }

      setFile(uploadedFile);
      toast.success('File selected successfully');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', importType);
      formData.append('mode', importMode);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      toast.success('File uploaded successfully. Ready for validation.');

      // Reset form
      setFile(null);
      setUploadProgress(0);
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Import File</CardTitle>
        <CardDescription>
          Upload a CSV or JSON file to import data into your store
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Import Type</Label>
            <Select value={importType} onValueChange={setImportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRODUCTS">Products</SelectItem>
                <SelectItem value="PRODUCT_IMAGES">Product Images</SelectItem>
                <SelectItem value="PRODUCT_VARIANTS">Product Variants</SelectItem>
                <SelectItem value="ORDERS">Orders</SelectItem>
                <SelectItem value="CUSTOMERS">Customers</SelectItem>
                <SelectItem value="CATEGORIES">Categories</SelectItem>
                <SelectItem value="INVENTORY">Inventory</SelectItem>
                <SelectItem value="BLOG_POSTS">Blog Posts</SelectItem>
                <SelectItem value="PAGES">Pages</SelectItem>
                <SelectItem value="MEDIA_LIBRARY">Media Library</SelectItem>
                <SelectItem value="REVIEWS">Reviews</SelectItem>
                <SelectItem value="NEWSLETTER_SUBSCRIBERS">Newsletter Subscribers</SelectItem>
                <SelectItem value="DISCOUNT_CODES">Discount Codes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Import Mode</Label>
            <Select value={importMode} onValueChange={setImportMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREATE">Create Only</SelectItem>
                <SelectItem value="UPDATE">Update Only</SelectItem>
                <SelectItem value="UPSERT">Create or Update</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="mb-2 block">File Upload</Label>

          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600 font-medium">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">
                    Drag and drop a file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: CSV, JSON (max 10MB)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-10 h-10 text-blue-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isUploading && (
                <div className="mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">Import Process</p>
          <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
            <li>Upload your file</li>
            <li>Validate the data structure</li>
            <li>Review validation results</li>
            <li>Process the import</li>
          </ol>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </CardContent>
    </Card>
  );
}
