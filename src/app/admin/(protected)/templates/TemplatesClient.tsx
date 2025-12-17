'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Mail, Package, Edit, Trash2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { TemplateCreationDialog } from '@/components/admin/TemplateCreationDialog';

interface Template {
    id: string;
    name: string;
    type: string;
    isActive: boolean;
    updatedAt: string;
}

const templateTypes = [
    { value: 'INVOICE', label: 'Invoices', icon: FileText },
    { value: 'PACKING_SLIP', label: 'Packing Slips', icon: Package },
    { value: 'EMAIL_TRANSACTIONAL', label: 'Transactional Emails', icon: Mail },
    { value: 'EMAIL_MARKETING', label: 'Marketing Emails', icon: Mail },
];

export default function TemplatesPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('INVOICE');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchTemplates();
    }, [selectedType]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/templates?type=${selectedType}`);
            if (response.ok) {
                const data = await response.json();
                setTemplates(data.templates);
            }
        } catch (error) {
            toast.error('Failed to fetch templates');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            const response = await fetch(`/api/admin/templates/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Template deleted');
                fetchTemplates();
            } else {
                toast.error('Failed to delete template');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleDuplicate = async (id: string) => {
        setDuplicatingId(id);
        try {
            const response = await fetch(`/api/admin/templates/${id}/duplicate`, {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Template duplicated successfully!');
                fetchTemplates();
                // Optionally navigate to the new template
                // router.push(`/admin/templates/${data.template.id}`);
            } else {
                toast.error('Failed to duplicate template');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setDuplicatingId(null);
        }
    };

    const handleTemplateCreated = (templateId: string) => {
        router.push(`/admin/templates/${templateId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Template Manager</h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage templates for invoices, emails, and packing slips
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {templateTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                        <Button
                            key={type.value}
                            variant={selectedType === type.value ? 'default' : 'outline'}
                            onClick={() => setSelectedType(type.value)}
                            className="flex items-center gap-2"
                        >
                            <Icon className="w-4 h-4" />
                            {type.label}
                        </Button>
                    );
                })}
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading templates...</p>
                </div>
            ) : templates.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                        <p className="text-muted-foreground mb-6">
                            Get started by creating your first template
                        </p>
                        <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Template
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card
                            key={template.id}
                            className={`relative transition-all hover:shadow-md ${
                                template.isActive ? 'ring-2 ring-primary' : ''
                            }`}
                        >
                            {template.isActive && (
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-primary">Active</Badge>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-lg pr-16">{template.name}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-sm text-muted-foreground">
                                        Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/templates/${template.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDuplicate(template.id)}
                                                disabled={duplicatingId === template.id}
                                                title="Duplicate template"
                                            >
                                                {duplicatingId === template.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDelete(template.id)}
                                                disabled={template.isActive}
                                                title={
                                                    template.isActive
                                                        ? 'Cannot delete active template'
                                                        : 'Delete template'
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <TemplateCreationDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onTemplateCreated={handleTemplateCreated}
                initialType={selectedType}
            />
        </div>
    );
}
