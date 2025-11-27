import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BlockPreview } from '../block-editor/BlockPreview';

interface SortableBlockProps {
    id: string;
    block: any;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

export const SortableBlock: React.FC<SortableBlockProps> = ({
    id,
    block,
    isSelected,
    onSelect,
    onRemove
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group border-2 rounded-lg transition-all mb-4 bg-white",
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-gray-300"
            )}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            {/* Drag Handle & Actions - Visible on Hover or Selected */}
            <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white shadow-sm border rounded-full px-2 py-1 transition-opacity z-10",
                isSelected || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move p-1 hover:bg-gray-100 rounded"
                >
                    <GripVertical className="h-4 w-4 text-gray-500" />
                </div>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <span className="text-xs font-medium px-1 text-gray-600">
                    {block.template?.name || 'Block'}
                </span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>

            {/* Block Content Preview */}
            <div className="pointer-events-none p-4 min-h-[100px]">
                {block.template ? (
                    <BlockPreview
                        template={block.template}
                        config={block.config}
                    />
                ) : (
                    <div className="flex items-center justify-center h-24 bg-gray-50 text-gray-400 rounded">
                        Unknown Block Template
                    </div>
                )}
            </div>
        </div>
    );
};
