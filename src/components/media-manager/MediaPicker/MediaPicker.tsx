'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MediaGrid } from '../MediaLibrary/MediaGrid';
import { MediaUploader } from '../MediaUploader/MediaUploader';
import { MediaItem, MediaFilters } from '../types';
import { Input } from '@/components/ui/input';
import { Search, Upload, Check } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

    const [filterType, setFilterType] = useState<string>('ALL');

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            // Use prop type if available, otherwise use local filter
            const typeToUse = type || (filterType !== 'ALL' ? filterType : undefined);
            if (typeToUse) params.append('type', typeToUse);

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
    }, [open, search, filterType]); // Add filterType dependency

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
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white z-10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">Media Library</DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={showUploader ? "secondary" : "default"}
                                size="sm"
                                onClick={() => setShowUploader(!showUploader)}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {showUploader ? 'Back to Library' : 'Upload New'}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
                    {!showUploader && (
                        <div className="p-4 border-b bg-white flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search media files..."
                                    className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            {!type && (
                                <div className="w-full sm:w-[200px]">
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Media</SelectItem>
                                            <SelectItem value="IMAGE">Images</SelectItem>
                                            <SelectItem value="VIDEO">Videos</SelectItem>
                                            <SelectItem value="DOCUMENT">Documents</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-6">
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

                <div className="p-4 border-t bg-white flex justify-between items-center z-10">
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            {selectedItems.length} item{selectedItems.length !== 1 && 's'} selected
                        </div>
                        {selectedItems.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])} className="text-muted-foreground hover:text-foreground">
                                Clear selection
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} disabled={selectedItems.length === 0} className="px-8">
                            <Check className="mr-2 h-4 w-4" />
                            Insert Selected
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
