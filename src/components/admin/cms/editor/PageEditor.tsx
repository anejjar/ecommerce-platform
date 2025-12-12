'use client';

import React from 'react';
import { EnhancedEditorLayout } from './EnhancedEditorLayout';
import { useEnhancedPageEditor } from '@/hooks/useEnhancedPageEditor';
import { normalizeBlockConfig } from '@/lib/normalizeBlockConfig';
import { EditorBlock, ContainerType } from '@/types/editor';
import { splitConfigIntoTabs } from '@/lib/editor-utils';

interface PageEditorProps {
    page: {
        id: string;
        title: string;
        slug: string;
        blocks: any[];
        overridesStorefrontPage?: boolean;
        overriddenPageType?: string | null;
        description?: string;
        seoTitle?: string;
        seoDescription?: string;
        seoKeywords?: string;
        status?: string;
    };
    templates: any[];
}

export const PageEditor: React.FC<PageEditorProps> = ({
    page,
    templates
}) => {
    // Transform initial blocks to match new EditorBlock interface
    const initialBlocks: EditorBlock[] = page.blocks.map(block => {
        // Normalize config to ensure repeater fields are arrays
        const normalizedConfig = block.template?.configSchema
            ? normalizeBlockConfig(block.config || {}, block.template.configSchema)
            : (block.config || {});

        // If block has new structure, use it; otherwise split old config
        let contentConfig, styleConfig, advancedConfig;

        if (block.contentConfig) {
            // Block already has new structure
            contentConfig = block.contentConfig;
            styleConfig = block.styleConfig || {};
            advancedConfig = block.advancedConfig || {};
        } else {
            // Migrate from old config structure
            const split = splitConfigIntoTabs(normalizedConfig, block.template?.configSchema);
            contentConfig = split.contentConfig;
            styleConfig = split.styleConfig;
            advancedConfig = split.advancedConfig;
        }

        return {
            id: block.id,
            templateId: block.templateId,
            containerType: block.containerType || ContainerType.BLOCK,
            parentId: block.parentId || null,
            contentConfig,
            styleConfig,
            advancedConfig,
            layoutSettings: block.layoutSettings || undefined,
            config: normalizedConfig, // Keep for backwards compatibility
            order: block.order,
            isVisible: block.isVisible !== false,
            template: block.template
        };
    });

    const editor = useEnhancedPageEditor({
        pageId: page.id,
        initialBlocks,
        initialPageData: {
            id: page.id,
            title: page.title,
            slug: page.slug,
            description: page.description,
            seoTitle: page.seoTitle,
            seoDescription: page.seoDescription,
            seoKeywords: page.seoKeywords,
            status: page.status as any,
            useBlockEditor: true,
            overridesStorefrontPage: page.overridesStorefrontPage ?? false,
            overriddenPageType: page.overriddenPageType || null,
        },
        templates: templates,
        autoSaveEnabled: true,
        autoSaveDelay: 2000,
    });

    return (
        <EnhancedEditorLayout
            pageTitle={editor.pageData.title || page.title}
            pageId={page.id}
            pageSlug={editor.pageData.slug || page.slug}
            pageData={{
                ...editor.pageData,
                overridesStorefrontPage: editor.pageData.overridesStorefrontPage ?? page.overridesStorefrontPage ?? false,
                overriddenPageType: editor.pageData.overriddenPageType ?? page.overriddenPageType ?? null,
            }}
            blocks={editor.blocks}
            templates={templates}
            selectedBlockId={editor.selectedBlockId}
            hoveredBlockId={editor.hoveredBlockId}
            deviceMode={editor.deviceMode}
            isSaving={editor.isSaving}
            isDirty={editor.isDirty}
            autoSaveStatus={editor.autoSaveStatus}
            canUndo={editor.canUndo}
            canRedo={editor.canRedo}
            clipboard={editor.clipboard}

            // Block operations
            onAddBlock={editor.addBlock}
            onAddContainerBlock={editor.addContainerBlock}
            onSelectBlock={editor.setSelectedBlockId}
            onHoverBlock={editor.setHoveredBlockId}
            onRemoveBlock={editor.removeBlock}
            onReorderBlocks={editor.reorderBlocks}
            onMoveBlock={editor.moveBlock}
            onUpdateBlockConfig={editor.updateBlockConfig}
            onDuplicateBlock={editor.duplicateBlock}
            onToggleVisibility={editor.toggleBlockVisibility}

            // Clipboard operations
            onCopyBlock={editor.copyBlock}
            onPasteBlock={editor.pasteBlock}
            onCopyStyle={editor.copyStyle}
            onPasteStyle={editor.pasteStyle}

            // Page operations
            onUpdatePageData={editor.updatePageData}
            onSave={() => editor.savePage(false)}
            onUndo={editor.undo}
            onRedo={editor.redo}

            // Device mode
            onSetDeviceMode={editor.setDeviceMode}
        />
    );
};
