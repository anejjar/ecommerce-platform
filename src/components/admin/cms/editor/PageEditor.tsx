'use client';

import React from 'react';
import { EditorLayout } from './EditorLayout';
import { usePageEditor, EditorBlock } from '@/hooks/usePageEditor';
import { normalizeBlockConfig } from '@/lib/normalizeBlockConfig';

interface PageEditorProps {
    page: {
        id: string;
        title: string;
        slug: string;
        blocks: any[];
        overridesStorefrontPage?: boolean;
        overriddenPageType?: string | null;
    };
    templates: any[];
}

export const PageEditor: React.FC<PageEditorProps> = ({
    page,
    templates
}) => {
    // Transform initial blocks to match EditorBlock interface
    const initialBlocks: EditorBlock[] = page.blocks.map(block => {
        // Normalize config to ensure repeater fields are arrays
        const normalizedConfig = block.template?.configSchema
            ? normalizeBlockConfig(block.config || {}, block.template.configSchema)
            : (block.config || {});
        
        return {
            id: block.id,
            templateId: block.templateId,
            config: normalizedConfig,
            order: block.order,
            template: block.template
        };
    });

    const {
        blocks,
        pageData,
        selectedBlockId,
        setSelectedBlockId,
        addBlock,
        updateBlockConfig,
        updatePageData,
        removeBlock,
        reorderBlocks,
        savePage,
        isSaving,
        isDirty,
        autoSaveStatus,
        undo,
        redo,
        canUndo,
        canRedo,
        duplicateBlock
    } = usePageEditor({
        pageId: page.id,
        initialBlocks,
        initialPageData: {
            title: page.title,
            slug: page.slug,
            description: page.description,
            seoTitle: page.seoTitle,
            seoDescription: page.seoDescription,
            seoKeywords: page.seoKeywords,
            status: page.status,
            overridesStorefrontPage: page.overridesStorefrontPage ?? false,
            overriddenPageType: page.overriddenPageType || null,
        },
        templates: templates, // Pass templates for fallback
    });

    return (
        <EditorLayout
            pageTitle={pageData.title || page.title}
            pageId={page.id}
            pageSlug={pageData.slug || page.slug}
            pageData={{
                ...pageData,
                overridesStorefrontPage: pageData.overridesStorefrontPage ?? page.overridesStorefrontPage ?? false,
                overriddenPageType: pageData.overriddenPageType ?? page.overriddenPageType ?? null,
            }}
            blocks={blocks}
            templates={templates}
            selectedBlockId={selectedBlockId}
            isSaving={isSaving}
            isDirty={isDirty}
            autoSaveStatus={autoSaveStatus}
            onAddBlock={addBlock}
            onSelectBlock={setSelectedBlockId}
            onRemoveBlock={removeBlock}
            onReorderBlocks={reorderBlocks}
            onUpdateBlockConfig={updateBlockConfig}
            onUpdatePageData={updatePageData}
            onSave={savePage}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onDuplicateBlock={duplicateBlock}
        />
    );
};
