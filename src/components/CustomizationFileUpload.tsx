'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CustomizationFileUploadProps {
  fieldId: string;
  fieldLabel: string;
  cartItemId?: string;
  maxFileSize?: number; // in KB
  allowedTypes?: string;
  value?: {
    fileUrl: string;
    fileName: string;
  };
  onChange: (value: { fileUrl: string; fileName: string } | null) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function CustomizationFileUpload({
  fieldId,
  fieldLabel,
  cartItemId,
  maxFileSize = 5120, // 5MB default
  allowedTypes = 'image/jpeg,image/png,image/webp,application/pdf',
  value,
  onChange,
  onError,
  disabled = false,
}: CustomizationFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(value?.fileUrl || null);
  const [error, setError] = useState<string | null>(null);

  // Parse allowed types
  const allowedTypesArray = allowedTypes.split(',').map((type) => type.trim());
  const maxFileSizeBytes = maxFileSize * 1024;

  // Check if file type is an image
  const isImage = (fileType: string) => fileType.startsWith('image/');

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSizeBytes) {
      return `File size exceeds maximum allowed size of ${(maxFileSize / 1024).toFixed(2)}MB`;
    }

    // Check file type
    const isAllowed = allowedTypesArray.some((allowedType) => {
      if (allowedType.endsWith('/*')) {
        const category = allowedType.split('/')[0];
        return file.type.startsWith(category + '/');
      }
      return file.type === allowedType;
    });

    if (!isAllowed) {
      const readableTypes = allowedTypesArray
        .map((type) => {
          if (type === 'image/jpeg') return 'JPEG';
          if (type === 'image/png') return 'PNG';
          if (type === 'image/webp') return 'WebP';
          if (type === 'application/pdf') return 'PDF';
          return type;
        })
        .join(', ');
      return `File type not allowed. Accepted types: ${readableTypes}`;
    }

    return null;
  };

  // Upload file to API
  const uploadFile = async (file: File) => {
    // Note: For new products not yet in cart, we'll store the file temporarily
    // and upload it when the product is added to cart
    if (!cartItemId) {
      // Create a local preview
      if (isImage(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setPreview(dataUrl);
          // Store file data temporarily (will be uploaded when added to cart)
          onChange({
            fileUrl: dataUrl, // Temporary local URL
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
      } else {
        onChange({
          fileUrl: '', // Will be uploaded later
          fileName: file.name,
        });
      }
      return;
    }

    // Upload to server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldId', fieldId);

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`/api/cart/items/${cartItemId}/customizations/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();

      // Set preview if it's an image
      if (isImage(file.type)) {
        setPreview(data.cloudinary.url);
      }

      // Call onChange with uploaded file data
      onChange({
        fileUrl: data.cloudinary.url,
        fileName: file.name,
      });

      // Reset progress after a short delay
      setTimeout(() => {
        setProgress(0);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        if (onError) onError(validationError);
        return;
      }

      uploadFile(file);
    },
    [fieldId, cartItemId, maxFileSizeBytes, allowedTypesArray]
  );

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypesArray.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxFileSizeBytes,
    multiple: false,
    disabled: disabled || uploading,
  });

  // Remove file
  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);
  };

  // If file is uploaded, show preview
  if (value && !uploading) {
    const isImageFile = value.fileUrl.startsWith('data:image') || value.fileUrl.includes('cloudinary');

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {isImageFile ? (
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={value.fileUrl}
                  alt={value.fileName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center">
                <FileIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="font-medium text-sm text-gray-900 truncate">{value.fileName}</p>
            </div>
            <p className="text-xs text-gray-500">File uploaded successfully</p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          !isDragActive && 'border-gray-300 hover:border-gray-400',
          (disabled || uploading) && 'opacity-50 cursor-not-allowed',
          error && 'border-red-300 bg-red-50'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="w-full max-w-xs">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">Uploading... {progress}%</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragActive ? 'Drop file here' : 'Drag & drop file here, or click to select'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max file size: {(maxFileSize / 1024).toFixed(2)}MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
