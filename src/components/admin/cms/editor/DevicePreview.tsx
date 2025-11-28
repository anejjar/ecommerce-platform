'use client';

import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DevicePreviewProps {
    device: DeviceType;
    onChange: (device: DeviceType) => void;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({
    device,
    onChange
}) => {
    return (
        <div className="flex items-center bg-gray-100 p-1 rounded-lg border">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange('desktop')}
                className={cn(
                    "h-7 w-7 p-0 hover:bg-white hover:shadow-sm transition-all",
                    device === 'desktop' && "bg-white shadow-sm text-primary"
                )}
                title="Desktop View"
            >
                <Monitor className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange('tablet')}
                className={cn(
                    "h-7 w-7 p-0 hover:bg-white hover:shadow-sm transition-all",
                    device === 'tablet' && "bg-white shadow-sm text-primary"
                )}
                title="Tablet View"
            >
                <Tablet className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange('mobile')}
                className={cn(
                    "h-7 w-7 p-0 hover:bg-white hover:shadow-sm transition-all",
                    device === 'mobile' && "bg-white shadow-sm text-primary"
                )}
                title="Mobile View"
            >
                <Smartphone className="h-4 w-4" />
            </Button>
        </div>
    );
};
