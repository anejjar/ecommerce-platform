'use client';

import React from 'react';
import { EditorLayout } from './EditorLayout';
import { usePageEditor, EditorBlock } from '@/hooks/usePageEditor';

interface PageEditorProps {
    page: {
        id: string;
        title: string;
        blocks: any[];
    };
    templates: any[];
}

export const PageEditor: React.FC<PageEditorProps> = ({
    page,
    templates
}) => {
    // Transform initial blocks to match EditorBlock interface
    const initialBlocks: EditorBlock[] = page.blocks.map(block => ({
        id: block.id,
        templateId: block.templateId,
        config: block.config || {},
        order: block.order,
        template: block.template
    }));

    const {
        blocks,
        selectedBlockId,
        setSelectedBlockId,
        addBlock,
        updateBlockConfig,
        removeBlock,
        reorderBlocks,
        savePage,
        isSaving,
        isDirty
    } = usePageEditor({
        pageId: page.id,
        initialBlocks
    });

    return (
        <EditorLayout
            pageTitle={page.title}
            blocks={blocks}
            templates={templates}
            selectedBlockId={selectedBlockId}
            isSaving={isSaving}
            isDirty={isDirty}
            onAddBlock={addBlock}
            onSelectBlock={setSelectedBlockId}
            onRemoveBlock={removeBlock}
            onReorderBlocks={reorderBlocks}
            onUpdateBlockConfig={updateBlockConfig}
            onSave={savePage}
        />
    );
};
