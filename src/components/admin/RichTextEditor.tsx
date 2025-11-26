'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
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
} from 'lucide-react';
import { MediaPicker } from '@/components/media-manager/MediaPicker/MediaPicker';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: 'Tell your story...',
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
        </div>
    );
}
