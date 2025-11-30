'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PageStatus } from '@prisma/client';

interface PageSettingsFormProps {
    pageData: {
        title: string;
        slug: string;
        description?: string;
        seoTitle?: string;
        seoDescription?: string;
        seoKeywords?: string;
        status: PageStatus;
        overridesStorefrontPage?: boolean;
        overriddenPageType?: string | null;
    };
    onChange: (field: string, value: any) => void;
}

export const PageSettingsForm: React.FC<PageSettingsFormProps> = ({
    pageData,
    onChange,
}) => {
    return (
        <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-sm text-gray-900">Basic Information</h3>
                    <p className="text-xs text-muted-foreground mt-1">Configure the basic page details</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                        id="title"
                        value={pageData.title}
                        onChange={(e) => onChange('title', e.target.value)}
                        placeholder="Enter page title"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                        id="slug"
                        value={pageData.slug}
                        onChange={(e) => onChange('slug', e.target.value)}
                        placeholder="page-url-slug"
                    />
                    <p className="text-xs text-muted-foreground">
                        {pageData.overridesStorefrontPage && pageData.overriddenPageType ? (
                            <>
                                This page overrides the <strong>{pageData.overriddenPageType}</strong> storefront page.
                                {pageData.status !== 'PUBLISHED' && (
                                    <span className="block mt-1 text-amber-600 font-medium">
                                        ⚠️ Page must be Published for override to take effect
                                    </span>
                                )}
                            </>
                        ) : (
                            <>URL: /landing/{pageData.slug}</>
                        )}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={pageData.description || ''}
                        onChange={(e) => onChange('description', e.target.value)}
                        placeholder="Brief description of the page"
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={String(pageData.status || 'DRAFT')}
                        onValueChange={(value) => onChange('status', value as PageStatus)}
                    >
                        <SelectTrigger id="status" className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    {pageData.overridesStorefrontPage && pageData.status !== 'PUBLISHED' && (
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <p className="text-xs text-amber-800">
                                <strong>Note:</strong> Storefront page overrides only work when the page status is <strong>Published</strong>. 
                                Change the status to Published to activate the override.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4 pt-4 border-t">
                <div>
                    <h3 className="font-semibold text-sm text-gray-900">SEO Settings</h3>
                    <p className="text-xs text-muted-foreground mt-1">Optimize your page for search engines</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                        id="seoTitle"
                        value={pageData.seoTitle || ''}
                        onChange={(e) => onChange('seoTitle', e.target.value)}
                        placeholder="Title for search engines"
                        maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                        {(pageData.seoTitle || '').length}/60 characters
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                        id="seoDescription"
                        value={pageData.seoDescription || ''}
                        onChange={(e) => onChange('seoDescription', e.target.value)}
                        placeholder="Description for search engines"
                        rows={3}
                        maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground">
                        {(pageData.seoDescription || '').length}/160 characters
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="seoKeywords">SEO Keywords</Label>
                    <Input
                        id="seoKeywords"
                        value={pageData.seoKeywords || ''}
                        onChange={(e) => onChange('seoKeywords', e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-xs text-muted-foreground">
                        Comma-separated keywords
                    </p>
                </div>
            </div>
        </div>
    );
};
