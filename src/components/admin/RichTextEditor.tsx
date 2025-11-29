'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Minus,
    Table as TableIcon,
    Plus,
    Trash2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Columns,
} from 'lucide-react';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Create compelling product description with images, tables, and formatting...' }: RichTextEditorProps) {
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: false,
                allowBase64: false,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4 block',
                    style: 'display: block; max-width: 100%; height: auto;',
                },
            }),
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse border border-gray-300 my-4',
                },
            }),
            TableRow.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 bg-gray-100 font-semibold p-2',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 p-2',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-2',
            },
        },
    });

    const handleMediaSelect = useCallback((media: any[]) => {
        if (media.length > 0) {
            const image = media[0];
            editor?.chain().focus().setImage({ src: image.url, alt: image.alt || '' }).run();
        }
        setIsMediaPickerOpen(false);
    }, [editor]);

    const openLinkDialog = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href || '';
        const { from, to } = editor?.state.selection || { from: 0, to: 0 };
        const text = editor?.state.doc.textBetween(from, to, '');

        setLinkUrl(previousUrl);
        setLinkText(text || '');
        setIsLinkDialogOpen(true);
    }, [editor]);

    const handleInsertLink = useCallback(() => {
        if (!linkUrl) {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            if (linkText && !editor?.state.selection.empty) {
                editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            } else if (linkText) {
                editor?.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
            } else {
                editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            }
        }
        setIsLinkDialogOpen(false);
        setLinkUrl('');
        setLinkText('');
    }, [editor, linkUrl, linkText]);

    const setHeading = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6) => {
        editor?.chain().focus().toggleHeading({ level }).run();
    }, [editor]);

    const setParagraph = useCallback(() => {
        editor?.chain().focus().setParagraph().run();
    }, [editor]);

    const insertTable = useCallback(() => {
        editor?.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run();
        setIsTableDialogOpen(false);
    }, [editor, tableRows, tableCols]);

    const addColumnBefore = useCallback(() => {
        editor?.chain().focus().addColumnBefore().run();
    }, [editor]);

    const addColumnAfter = useCallback(() => {
        editor?.chain().focus().addColumnAfter().run();
    }, [editor]);

    const deleteColumn = useCallback(() => {
        editor?.chain().focus().deleteColumn().run();
    }, [editor]);

    const addRowBefore = useCallback(() => {
        editor?.chain().focus().addRowBefore().run();
    }, [editor]);

    const addRowAfter = useCallback(() => {
        editor?.chain().focus().addRowAfter().run();
    }, [editor]);

    const deleteRow = useCallback(() => {
        editor?.chain().focus().deleteRow().run();
    }, [editor]);

    const deleteTable = useCallback(() => {
        editor?.chain().focus().deleteTable().run();
    }, [editor]);

    const insertImageTextLayout = useCallback((imagePosition: 'left' | 'right') => {
        // Insert a side-by-side layout with image and text
        const layoutClass = imagePosition === 'left' ? 'image-text-layout image-left' : 'image-text-layout image-right';
        const htmlContent = `<div class="${layoutClass}">
            <div class="layout-image">
                <p style="text-align: center; color: #6b7280; font-style: italic; padding: 2rem;">Click here and use the image button to insert an image</p>
            </div>
            <div class="layout-text">
                <p>Your text content here. You can format this text with headings, lists, and other formatting options.</p>
            </div>
        </div>`;
        editor?.chain().focus().insertContent(htmlContent).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive,
        children,
        title
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                "h-8 px-2 hover:bg-muted",
                isActive && "bg-muted text-primary"
            )}
            title={title}
        >
            {children}
        </Button>
    );

    const ToolbarSeparator = () => (
        <div className="w-px h-6 bg-border" />
    );

    return (
        <div className="relative">
            {/* Toolbar */}
            <div className="sticky top-0 z-10 bg-background border-b border-border mb-4">
                <div className="flex items-center gap-1 p-2 flex-wrap">
                    {/* Heading Selector */}
                    <Select
                        value={
                            editor.isActive('heading', { level: 1 }) ? 'h1' :
                                editor.isActive('heading', { level: 2 }) ? 'h2' :
                                    editor.isActive('heading', { level: 3 }) ? 'h3' :
                                        editor.isActive('heading', { level: 4 }) ? 'h4' :
                                            editor.isActive('heading', { level: 5 }) ? 'h5' :
                                                editor.isActive('heading', { level: 6 }) ? 'h6' :
                                                    'paragraph'
                        }
                        onValueChange={(value) => {
                            if (value === 'paragraph') setParagraph();
                            else setHeading(parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6);
                        }}
                    >
                        <SelectTrigger className="w-[120px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paragraph">Paragraph</SelectItem>
                            <SelectItem value="h1">Heading 1</SelectItem>
                            <SelectItem value="h2">Heading 2</SelectItem>
                            <SelectItem value="h3">Heading 3</SelectItem>
                            <SelectItem value="h4">Heading 4</SelectItem>
                            <SelectItem value="h5">Heading 5</SelectItem>
                            <SelectItem value="h6">Heading 6</SelectItem>
                        </SelectContent>
                    </Select>

                    <ToolbarSeparator />

                    {/* Text Formatting */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Inline Code"
                    >
                        <Code className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarSeparator />

                    {/* Lists */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarSeparator />

                    {/* Blocks */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <Code className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Horizontal Rule"
                    >
                        <Minus className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarSeparator />

                    {/* Text Alignment */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarSeparator />

                    {/* Insert */}
                    <ToolbarButton
                        onClick={openLinkDialog}
                        isActive={editor.isActive('link')}
                        title="Insert Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => setIsMediaPickerOpen(true)}
                        title="Insert Image"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => setIsTableDialogOpen(true)}
                        title="Insert Table"
                    >
                        <TableIcon className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarSeparator />

                    {/* Table Controls (only show when in table) */}
                    {editor.isActive('table') && (
                        <>
                            <ToolbarButton
                                onClick={addColumnBefore}
                                title="Add Column Before"
                            >
                                <Plus className="w-4 h-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={addColumnAfter}
                                title="Add Column After"
                            >
                                <Plus className="w-4 h-4 rotate-90" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={deleteColumn}
                                title="Delete Column"
                            >
                                <Trash2 className="w-4 h-4" />
                            </ToolbarButton>
                            <ToolbarSeparator />
                            <ToolbarButton
                                onClick={addRowBefore}
                                title="Add Row Before"
                            >
                                <Plus className="w-4 h-4 rotate-90" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={addRowAfter}
                                title="Add Row After"
                            >
                                <Plus className="w-4 h-4 rotate-90" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={deleteRow}
                                title="Delete Row"
                            >
                                <Trash2 className="w-4 h-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={deleteTable}
                                title="Delete Table"
                            >
                                <Trash2 className="w-4 h-4" />
                            </ToolbarButton>
                            <ToolbarSeparator />
                        </>
                    )}

                    {/* Image + Text Layouts */}
                    <ToolbarButton
                        onClick={() => insertImageTextLayout('left')}
                        title="Image Left + Text Right"
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span className="ml-1 text-xs">L</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => insertImageTextLayout('right')}
                        title="Text Left + Image Right"
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span className="ml-1 text-xs">R</span>
                    </ToolbarButton>

                    <ToolbarSeparator />

                    {/* Undo/Redo */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />

            <MediaPicker
                open={isMediaPickerOpen}
                onOpenChange={setIsMediaPickerOpen}
                onSelect={handleMediaSelect}
                type="IMAGE"
                multiple={false}
            />

            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="link-text">Link Text (optional)</Label>
                            <Input id="link-text" placeholder="Click here" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link-url">URL</Label>
                            <Input id="link-url" placeholder="https://example.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInsertLink(); } }} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
                        {editor?.isActive('link') && (
                            <Button variant="destructive" onClick={() => { editor?.chain().focus().extendMarkRange('link').unsetLink().run(); setIsLinkDialogOpen(false); }}>Remove Link</Button>
                        )}
                        <Button onClick={handleInsertLink}>{editor?.isActive('link') ? 'Update' : 'Insert'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Table</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="table-rows">Rows</Label>
                                <Input 
                                    id="table-rows" 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    value={tableRows} 
                                    onChange={(e) => setTableRows(parseInt(e.target.value) || 3)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="table-cols">Columns</Label>
                                <Input 
                                    id="table-cols" 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    value={tableCols} 
                                    onChange={(e) => setTableCols(parseInt(e.target.value) || 3)} 
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTableDialogOpen(false)}>Cancel</Button>
                        <Button onClick={insertTable}>Insert Table</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
