'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatBytes } from '../utils';

interface MediaUploaderProps {
    onUploadComplete: () => void;
    folderId?: string | null;
}

interface UploadFile {
    file: File;
    id: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadComplete, folderId }) => {
    const [uploads, setUploads] = useState<UploadFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newUploads = acceptedFiles.map((file) => ({
            file,
            id: Math.random().toString(36).substring(7),
            progress: 0,
            status: 'pending' as const,
        }));

        setUploads((prev) => [...prev, ...newUploads]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': [],
            'audio/*': [],
            'application/pdf': [],
        },
    });

    const uploadFile = async (upload: UploadFile) => {
        const formData = new FormData();
        formData.append('file', upload.file);
        if (folderId) {
            formData.append('folderId', folderId);
        }

        try {
            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploads((prev) =>
                        prev.map((u) => (u.id === upload.id ? { ...u, progress, status: 'uploading' } : u))
                    );
                }
            };

            const promise = new Promise((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        let errorMessage = 'Upload failed';
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.error) errorMessage = response.error;
                        } catch {
                            // ignore json parse error
                        }
                        reject(new Error(errorMessage));
                    }
                };
                xhr.onerror = () => reject(new Error('Upload failed'));
            });

            xhr.open('POST', '/api/media/upload');
            xhr.send(formData);

            await promise;

            setUploads((prev) =>
                prev.map((u) => (u.id === upload.id ? { ...u, progress: 100, status: 'completed' } : u))
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed';
            setUploads((prev) =>
                prev.map((u) => (u.id === upload.id ? { ...u, status: 'error', error: errorMessage } : u))
            );
        }
    };

    const startUpload = async () => {
        setIsUploading(true);
        const pendingUploads = uploads.filter((u) => u.status === 'pending');

        // Upload 3 files at a time
        const batchSize = 3;
        for (let i = 0; i < pendingUploads.length; i += batchSize) {
            const batch = pendingUploads.slice(i, i + batchSize);
            await Promise.all(batch.map((u) => uploadFile(u)));
        }

        setIsUploading(false);
        onUploadComplete();
    };

    const removeUpload = (id: string) => {
        setUploads((prev) => prev.filter((u) => u.id !== id));
    };

    const clearCompleted = () => {
        setUploads((prev) => prev.filter((u) => u.status !== 'completed'));
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors cursor-pointer",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                )}
            >
                <input {...getInputProps()} />
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">
                    {isDragActive ? "Drop files here" : "Drag & drop files here, or click to select"}
                </p>
                <p className="text-sm text-muted-foreground">
                    Supports images, videos, audio, and documents up to 10MB
                </p>
            </div>

            {uploads.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Upload Queue ({uploads.length})</h3>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearCompleted}
                                disabled={isUploading || !uploads.some(u => u.status === 'completed')}
                            >
                                Clear Completed
                            </Button>
                            <Button
                                size="sm"
                                onClick={startUpload}
                                disabled={isUploading || !uploads.some(u => u.status === 'pending')}
                            >
                                {isUploading ? 'Uploading...' : 'Start Upload'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {uploads.map((upload) => (
                            <div
                                key={upload.id}
                                className="flex items-center justify-between rounded-md border p-3"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{upload.file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(upload.file.size)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {upload.status === 'uploading' && (
                                        <Progress value={upload.progress} className="w-24" />
                                    )}
                                    {upload.status === 'completed' && (
                                        <div className="flex items-center text-green-600">
                                            <CheckCircle className="mr-1 h-4 w-4" />
                                            <span className="text-xs">Done</span>
                                        </div>
                                    )}
                                    {upload.status === 'error' && (
                                        <div className="flex items-center text-red-600" title={upload.error}>
                                            <AlertCircle className="mr-1 h-4 w-4" />
                                            <span className="text-xs max-w-[150px] truncate">{upload.error || 'Error'}</span>
                                        </div>
                                    )}
                                    {upload.status === 'pending' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => removeUpload(upload.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
