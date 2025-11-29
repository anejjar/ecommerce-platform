import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableBlock } from './SortableBlock';
import { EditorBlock } from '@/hooks/usePageEditor';
import { DeviceType } from './DevicePreview';
import { cn } from '@/lib/utils';

interface CanvasProps {
    blocks: EditorBlock[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string) => void;
    onToggleBlockSettings?: (id: string) => void;
    onRemoveBlock: (id: string) => void;
    onReorderBlocks: (blocks: EditorBlock[]) => void;
    onDuplicateBlock?: (blockId: string) => void;
    device: DeviceType;
}

export const Canvas: React.FC<CanvasProps> = ({
    blocks,
    selectedBlockId,
    onSelectBlock,
    onToggleBlockSettings,
    onRemoveBlock,
    onReorderBlocks,
    onDuplicateBlock,
    device
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex((block) => block.id === active.id);
            const newIndex = blocks.findIndex((block) => block.id === over.id);

            onReorderBlocks(arrayMove(blocks, oldIndex, newIndex));
        }
    };

    const getWidthClass = () => {
        switch (device) {
            case 'mobile': return 'max-w-[375px]';
            case 'tablet': return 'max-w-[768px]';
            default: return 'max-w-full';
        }
    };

    return (
        <div className={cn(
            "transition-all duration-300 ease-in-out w-full",
            getWidthClass()
        )}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={blocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={cn(
                        "space-y-3 min-h-[200px] bg-white shadow-sm border rounded-lg p-6 transition-all",
                        device !== 'desktop' && "border-2 border-gray-300 my-8"
                    )}>
                        {blocks.map((block) => (
                            <SortableBlock
                                key={block.id}
                                id={block.id}
                                block={block}
                                isSelected={selectedBlockId === block.id}
                                onSelect={() => onSelectBlock(block.id)}
                                onToggleSettings={onToggleBlockSettings ? () => onToggleBlockSettings(block.id) : undefined}
                                onRemove={() => onRemoveBlock(block.id)}
                                onDuplicate={onDuplicateBlock ? () => onDuplicateBlock(block.id) : undefined}
                            />
                        ))}

                        {blocks.length === 0 && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gradient-to-br from-gray-50 to-gray-100/50">
                                <div className="max-w-md mx-auto">
                                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 mb-2">Start Building Your Page</p>
                                    <p className="text-sm text-gray-600 mb-4">Click on blocks in the library to add them to your canvas.</p>
                                    <p className="text-xs text-gray-500">Drag blocks to reorder • Click to configure</p>
                                </div>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};
