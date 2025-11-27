import useSWR from 'swr';
import { BlockCategory } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BlockTemplate {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: BlockCategory;
    thumbnail: string | null;
    previewUrl: string | null;
    isSystem: boolean;
    isActive: boolean;
    isPro: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

interface BlockTemplateDetail extends BlockTemplate {
    defaultConfig: Record<string, any>;
    configSchema: Record<string, any>;
    componentCode: string;
    htmlTemplate: string | null;
    cssStyles: string | null;
}

interface UseBlockTemplatesOptions {
    category?: BlockCategory;
    isActive?: boolean;
    isPro?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'createdAt' | 'usageCount';
    sortOrder?: 'asc' | 'desc';
}

export function useBlockTemplates(options: UseBlockTemplatesOptions = {}) {
    const params = new URLSearchParams();

    if (options.category) params.append('category', options.category);
    if (options.isActive !== undefined) params.append('isActive', String(options.isActive));
    if (options.isPro !== undefined) params.append('isPro', String(options.isPro));
    if (options.search) params.append('search', options.search);
    if (options.page) params.append('page', String(options.page));
    if (options.limit) params.append('limit', String(options.limit));
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `/api/admin/blocks/templates?${params.toString()}`;

    const { data, error, mutate } = useSWR(url, fetcher);

    return {
        templates: data?.templates as BlockTemplate[] | undefined,
        pagination: data?.pagination,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
}

export function useBlockTemplate(id: string | null) {
    const url = id ? `/api/admin/blocks/templates/${id}` : null;

    const { data, error, mutate } = useSWR(url, fetcher);

    return {
        template: data as BlockTemplateDetail | undefined,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
}

export async function createBlockTemplate(data: Partial<BlockTemplateDetail>) {
    const response = await fetch('/api/admin/blocks/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create template');
    }

    return response.json();
}

export async function updateBlockTemplate(id: string, data: Partial<BlockTemplateDetail>) {
    const response = await fetch(`/api/admin/blocks/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update template');
    }

    return response.json();
}

export async function deleteBlockTemplate(id: string) {
    const response = await fetch(`/api/admin/blocks/templates/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete template');
    }

    return response.json();
}

export async function duplicateBlockTemplate(id: string, name: string, slug: string) {
    const response = await fetch(`/api/admin/blocks/templates/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to duplicate template');
    }

    return response.json();
}
