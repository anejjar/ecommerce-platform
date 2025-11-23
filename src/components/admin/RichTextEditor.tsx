'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
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
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Image as ImageIcon,
    Quote,
    Undo,
    Redo,
} from 'lucide-react';
import { useCallback, useState } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 border rounded-md',
            },
        },
    });

    const openImageDialog = useCallback(() => {
        setImageUrl('');
        setIsImageDialogOpen(true);
    }, []);

    const handleInsertImage = useCallback(() => {
        if (imageUrl) {
            editor?.chain().focus().setImage({ src: imageUrl }).run();
        }
        setIsImageDialogOpen(false);
        setImageUrl('');
    }, [editor, imageUrl]);

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

    if (!editor) {
        return null;
    }

    return (
        <>
            <div className="border rounded-md">
                <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-200' : ''}><Bold className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-200' : ''}><Italic className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}><Heading1 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}><Heading2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}><List className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}><ListOrdered className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}><Quote className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={openLinkDialog} className={editor.isActive('link') ? 'bg-gray-200' : ''}><LinkIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={openImageDialog}><ImageIcon className="w-4 h-4" /></Button>
                    <div className="flex-1" />
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}><Undo className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}><Redo className="w-4 h-4" /></Button>
                </div>
                <EditorContent editor={editor} className="p-4 min-h-[300px]" />
            </div>

            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <Input id="image-url" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInsertImage(); } }} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleInsertImage}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
        </>
    );
}
