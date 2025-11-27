import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { SidebarBlock } from './SidebarBlock';
import { Canvas } from './Canvas';
import { ConfigForm } from '../block-editor/ConfigForm';
import { EditorBlock } from '@/hooks/usePageEditor';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EditorLayoutProps {
    pageTitle: string;
    blocks: EditorBlock[];
    templates: any[];
    selectedBlockId: string | null;
    isSaving: boolean;
    isDirty: boolean;
    onAddBlock: (template: any) => void;
    onSelectBlock: (id: string) => void;
    onRemoveBlock: (id: string) => void;
    onReorderBlocks: (blocks: EditorBlock[]) => void;
    onUpdateBlockConfig: (id: string, config: any) => void;
    onSave: () => void;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
    pageTitle,
    blocks,
    templates,
    selectedBlockId,
    isSaving,
    isDirty,
    onAddBlock,
    onSelectBlock,
    onRemoveBlock,
    onReorderBlocks,
    onUpdateBlockConfig,
    onSave
}) => {
    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    // Group templates by category
    const templatesByCategory = templates.reduce((acc, template) => {
        const category = template.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(template);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b flex items-center justify-between px-4 bg-white z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cms/landing-pages" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-sm">{pageTitle}</h1>
                        <span className="text-xs text-muted-foreground">Page Editor</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={onSave}
                        disabled={!isDirty || isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Block Library */}
                <div className="w-80 border-r flex flex-col bg-gray-50/50 shrink-0">
                    <div className="p-4 border-b bg-white">
                        <h2 className="font-semibold text-sm">Block Library</h2>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-6">
                            {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                                <div key={category}>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-1">
                                        {category.replace('_', ' ')}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {(categoryTemplates as any[]).map(template => (
                                            <SidebarBlock
                                                key={template.id}
                                                template={template}
                                                onAdd={() => onAddBlock(template)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <ScrollArea className="flex-1 h-full">
                        <Canvas
                            blocks={blocks}
                            selectedBlockId={selectedBlockId}
                            onSelectBlock={onSelectBlock}
                            onRemoveBlock={onRemoveBlock}
                            onReorderBlocks={onReorderBlocks}
                        />
                    </ScrollArea>
                </div>

                {/* Right Sidebar - Inspector */}
                <div className="w-80 border-l flex flex-col bg-white shrink-0">
                    <div className="p-4 border-b bg-white">
                        <h2 className="font-semibold text-sm">
                            {selectedBlock ? 'Block Settings' : 'Page Settings'}
                        </h2>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4">
                            {selectedBlock ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">
                                            {selectedBlock.template?.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground px-2 py-1 bg-gray-100 rounded">
                                            {selectedBlock.template?.category}
                                        </span>
                                    </div>

                                    <ConfigForm
                                        schema={selectedBlock.template?.configSchema}
                                        data={selectedBlock.config}
                                        onChange={(newConfig) => onUpdateBlockConfig(selectedBlock.id, newConfig)}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>Select a block on the canvas to edit its settings.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};
