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

interface CanvasProps {
    blocks: EditorBlock[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string) => void;
    onRemoveBlock: (id: string) => void;
    onReorderBlocks: (blocks: EditorBlock[]) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
    blocks,
    selectedBlockId,
    onSelectBlock,
    onRemoveBlock,
    onReorderBlocks
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

    return (
        <div className="min-h-full p-8 pb-32 bg-gray-100/50">
            <div className="max-w-4xl mx-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={blocks.map(b => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4 min-h-[200px]">
                            {blocks.map((block) => (
                                <SortableBlock
                                    key={block.id}
                                    id={block.id}
                                    block={block}
                                    isSelected={selectedBlockId === block.id}
                                    onSelect={() => onSelectBlock(block.id)}
                                    onRemove={() => onRemoveBlock(block.id)}
                                />
                            ))}

                            {blocks.length === 0 && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500 bg-white/50">
                                    <p className="text-lg font-medium mb-2">Canvas is Empty</p>
                                    <p className="text-sm">Click on blocks in the sidebar to add them to your page.</p>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};
