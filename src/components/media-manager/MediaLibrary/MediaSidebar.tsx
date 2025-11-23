'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MediaItem } from '../types';
import { formatBytes } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { X, Trash2, Save, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MediaSidebarProps {
    item: MediaItem | null;
    onClose: () => void;
    onUpdate: (id: string, data: Partial<MediaItem>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export const MediaSidebar: React.FC<MediaSidebarProps> = ({ item, onClose, onUpdate, onDelete }) => {
    const [formData, setFormData] = useState({
        altText: '',
        title: '',
        caption: '',
        description: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                altText: item.altText || '',
                title: item.title || '',
                caption: item.caption || '',
                description: item.description || '',
            });
        }
    }, [item]);

    if (!item) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate(item.id, formData);
            toast.success('Media updated successfully');
        } catch (error) {
            toast.error('Failed to update media');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;

        setIsDeleting(true);
        try {
            await onDelete(item.id);
            toast.success('Media deleted successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to delete media');
        } finally {
            setIsDeleting(false);
        }
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(item.secureUrl);
        toast.success('URL copied to clipboard');
    };

    return (
        <div className="fixed inset-y-0 right-0 z-50 w-80 border-l bg-background shadow-lg sm:w-96 overflow-y-auto">
            <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-semibold">Media Details</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="p-4 space-y-6">
                {/* Preview */}
                <div className="aspect-video relative overflow-hidden rounded-lg border bg-muted">
                    {item.type === 'IMAGE' ? (
                        <Image
                            src={item.secureUrl}
                            alt={item.altText || item.filename}
                            fill
                            className="object-contain"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No preview available
                        </div>
                    )}
                </div>

                {/* File Info */}
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Filename:</span>
                        <span className="truncate" title={item.filename}>{item.filename}</span>

                        <span className="text-muted-foreground">Type:</span>
                        <span>{item.mimeType}</span>

                        <span className="text-muted-foreground">Size:</span>
                        <span>{formatBytes(item.fileSize)}</span>

                        {item.width && (
                            <>
                                <span className="text-muted-foreground">Dimensions:</span>
                                <span>{item.width} x {item.height}</span>
                            </>
                        )}

                        <span className="text-muted-foreground">Uploaded:</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={copyUrl}>
                            <Copy className="mr-2 h-3 w-3" /> Copy URL
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Metadata Form */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="altText">Alt Text</Label>
                        <Input
                            id="altText"
                            name="altText"
                            value={formData.altText}
                            onChange={handleChange}
                            placeholder="Describe the image for SEO"
                        />
                        <p className="text-xs text-muted-foreground">Important for accessibility and SEO.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Textarea
                            id="caption"
                            name="caption"
                            value={formData.caption}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                </div>
            </div>
        </div>
    );
};
