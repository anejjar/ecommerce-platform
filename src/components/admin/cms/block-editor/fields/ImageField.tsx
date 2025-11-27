import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { MediaItem } from '@/components/media-manager/types';
import { X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    recommended?: string; // e.g., "1920x1080px"
    error?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
    label,
    value,
    onChange,
    required,
    recommended,
    error
}) => {
    const [pickerOpen, setPickerOpen] = useState(false);

    const handleSelect = (media: MediaItem[]) => {
        if (media.length > 0) {
            onChange(media[0].url);
        }
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {recommended && (
                    <span className="text-xs text-muted-foreground">{recommended}</span>
                )}
            </div>

            <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                {value ? (
                    <div className="relative group">
                        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                            <Image
                                src={value}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setPickerOpen(true)}
                            >
                                Change
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleClear}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <ImageIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            No image selected
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setPickerOpen(true)}
                        >
                            Select Image
                        </Button>
                    </div>
                )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <MediaPicker
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                onSelect={handleSelect}
                type="IMAGE"
                multiple={false}
            />
        </div>
    );
};
