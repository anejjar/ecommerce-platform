import React from 'react';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Image from 'next/image';

interface SidebarBlockProps {
    template: {
        id: string;
        name: string;
        category: string;
        thumbnail?: string | null;
        description?: string | null;
    };
    onAdd: () => void;
}

export const SidebarBlock: React.FC<SidebarBlockProps> = ({
    template,
    onAdd
}) => {
    return (
        <Card
            className="group relative cursor-pointer hover:border-primary transition-all overflow-hidden"
            onClick={onAdd}
        >
            <div className="aspect-video bg-gray-100 relative">
                {template.thumbnail ? (
                    <Image
                        src={template.thumbnail}
                        alt={template.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                        No Preview
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus className="text-white h-8 w-8" />
                </div>
            </div>

            <div className="p-3">
                <h4 className="font-medium text-sm truncate" title={template.name}>
                    {template.name}
                </h4>
                <p className="text-xs text-muted-foreground capitalize mt-1">
                    {template.category.toLowerCase().replace('_', ' ')}
                </p>
            </div>
        </Card>
    );
};
