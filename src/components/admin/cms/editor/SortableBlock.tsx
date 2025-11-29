import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Settings, Move, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BlockPreview } from '../block-editor/BlockPreview';

interface SortableBlockProps {
    id: string;
    block: any;
    isSelected: boolean;
    onSelect: () => void;
    onToggleSettings?: () => void;
    onRemove: () => void;
    onDuplicate?: () => void;
}

export const SortableBlock: React.FC<SortableBlockProps> = ({
    id,
    block,
    isSelected,
    onSelect,
    onToggleSettings,
    onRemove,
    onDuplicate
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
                "relative group transition-all mb-4",
                isSelected ? "ring-2 ring-primary ring-offset-2 rounded-lg" : ""
            )}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            {/* Hover Actions Overlay */}
            <div className={cn(
                "absolute -top-3 right-4 flex items-center gap-1 bg-white shadow-md border rounded-lg p-1 transition-all z-20",
                isSelected || isDragging ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto"
            )}>
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
                    title="Drag to reorder"
                >
                    <Move className="h-3.5 w-3.5" />
                </div>

                <div className="w-px h-4 bg-gray-200" />

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-7 w-7 transition-colors",
                        isSelected ? "text-primary bg-primary/10" : "text-gray-500 hover:text-primary hover:bg-primary/5"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleSettings) {
                            onToggleSettings();
                        } else {
                            onSelect();
                        }
                    }}
                    title={isSelected ? "Close Settings" : "Open Settings"}
                >
                    <Settings className="h-3.5 w-3.5" />
                </Button>

                <div className="w-px h-4 bg-gray-200" />

                {onDuplicate && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDuplicate();
                            }}
                            title="Duplicate block"
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <div className="w-px h-4 bg-gray-200" />
                    </>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    title="Remove block"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Block Content */}
            <div className={cn(
                "bg-white rounded-lg border shadow-sm overflow-hidden transition-all",
                isSelected ? "border-primary/20" : "border-gray-200 hover:border-gray-300"
            )}>
                <div className="pointer-events-none min-h-[100px]">
                    {block.template ? (
                        <BlockPreview
                            template={block.template}
                            config={block.config}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-24 bg-gray-50 text-gray-400">
                            Unknown Block Template
                        </div>
                    )}
                </div>
            </div>

            {/* Selection Label */}
            {isSelected && (
                <div className="absolute -top-3 left-4 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20 uppercase tracking-wider">
                    {block.template?.name}
                </div>
            )}
        </div>
    );
};
