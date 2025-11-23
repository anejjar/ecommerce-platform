'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { TemplateVariablesHelper } from '@/components/admin/TemplateVariablesHelper';
import { TemplatePreviewDialog } from '@/components/admin/TemplatePreviewDialog';

export default function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [template, setTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchTemplate();
    }, []);

    const fetchTemplate = async () => {
        try {
            const response = await fetch(`/api/admin/templates/${id}`);
            if (response.ok) {
                const data = await response.json();
                setTemplate(data.template);
                setName(data.template.name);
                setContent(data.template.content);
                setIsActive(data.template.isActive);
            } else {
                toast.error('Failed to load template');
                router.push('/admin/templates');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Validate JSON if it's a PDF template
            if (!template.type.includes('EMAIL')) {
                try {
                    JSON.parse(content);
                } catch (e) {
                    toast.error('Invalid JSON format');
                    setSaving(false);
                    return;
                }
            }

            const response = await fetch(`/api/admin/templates/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    content,
                    isActive,
                }),
            });

            if (response.ok) {
                toast.success('Template saved successfully');
                fetchTemplate(); // Refresh to get updated active status
            } else {
                toast.error('Failed to save template');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleInsertVariable = (variable: string) => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + variable + content.substring(end);

        setContent(newContent);

        // Set cursor position after inserted variable
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + variable.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!template) return <div className="text-center py-12">Template not found</div>;

    const isEmail = template.type.includes('EMAIL');

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Template</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowPreview(true)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 flex-1 min-h-0">
                {/* Settings Panel */}
                <div className="space-y-6 overflow-y-auto pr-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Template Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Holiday Theme"
                                />
                            </div>

                            <div className="flex items-center justify-between border p-3 rounded-md">
                                <div className="space-y-0.5">
                                    <Label>Active Template</Label>
                                    <p className="text-sm text-gray-500">
                                        Use this template for {template.type.replace('_', ' ')}
                                    </p>
                                </div>
                                <Switch
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Template Variables</Label>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Browse and insert variables into your template
                                </p>
                                <TemplateVariablesHelper onInsert={handleInsertVariable} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Editor Panel */}
                <div className="md:col-span-2 flex flex-col min-h-0">
                    <Card className="flex-1 flex flex-col min-h-0">
                        <CardHeader className="py-3">
                            <CardTitle>{isEmail ? 'HTML Editor' : 'Configuration (JSON)'}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 min-h-0">
                            <Textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full min-h-[400px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none p-4"
                                spellCheck={false}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <TemplatePreviewDialog
                content={content}
                templateType={template.type}
                open={showPreview}
                onOpenChange={setShowPreview}
            />
        </div>
    );
}
