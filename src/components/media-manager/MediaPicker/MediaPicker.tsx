'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MediaGrid } from '../MediaLibrary/MediaGrid';
import { MediaUploader } from '../MediaUploader/MediaUploader';
import { MediaItem, MediaFilters } from '../types';
import { Input } from '@/components/ui/input';
import { Search, Upload, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MediaPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (media: MediaItem[]) => void;
    multiple?: boolean;
    type?: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
    open,
    onOpenChange,
    onSelect,
    multiple = false,
    type
}) => {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
    const [showUploader, setShowUploader] = useState(false);
    const [search, setSearch] = useState('');

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (type) params.append('type', type);

            const res = await fetch(`/api/media?${params.toString()}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setItems(data.media);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load media');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchMedia();
            setSelectedItems([]);
        }
    }, [open, search]);

    const handleSelect = (item: MediaItem) => {
        if (multiple) {
            setSelectedItems(prev => {
                const exists = prev.find(i => i.id === item.id);
                if (exists) return prev.filter(i => i.id !== item.id);
                return [...prev, item];
            });
        } else {
            setSelectedItems([item]);
        }
    };

    const handleConfirm = () => {
        onSelect(selectedItems);
        onOpenChange(false);
    };

    const handleUploadComplete = () => {
        fetchMedia();
        setShowUploader(false);
        toast.success('Upload complete');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Select Media</DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={showUploader ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setShowUploader(!showUploader)}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {showUploader ? 'Back to Library' : 'Upload New'}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {!showUploader && (
                        <div className="p-4 border-b bg-muted/20">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search media..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4">
                        {showUploader ? (
                            <MediaUploader onUploadComplete={handleUploadComplete} />
                        ) : (
                            <MediaGrid
                                items={items}
                                selectedItems={selectedItems.map(i => i.id)}
                                onSelect={(item) => handleSelect(item)}
                                onItemClick={(item) => handleSelect(item)}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>

                <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        {selectedItems.length} item{selectedItems.length !== 1 && 's'} selected
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} disabled={selectedItems.length === 0}>
                            <Check className="mr-2 h-4 w-4" />
                            Insert Selected
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
