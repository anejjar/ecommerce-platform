import useSWR from 'swr';
import { PageStatus } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LandingPage {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: PageStatus;
    publishedAt: string | null;
    author: {
        id: string;
        name: string;
        email: string;
    };
    blockCount: number;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

interface LandingPageDetail extends Omit<LandingPage, 'blockCount'> {
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    ogImage: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    scheduledPublishAt: string | null;
    layoutConfig: Record<string, any> | null;
    customCss: string | null;
    customJs: string | null;
    templateId: string | null;
    blocks: Array<{
        id: string;
        templateId: string;
        template: {
            id: string;
            name: string;
            category: string;
        };
        config: Record<string, any>;
        order: number;
        isVisible: boolean;
        hideOnMobile: boolean;
        hideOnTablet: boolean;
        hideOnDesktop: boolean;
    }>;
}

interface UseLandingPagesOptions {
    status?: PageStatus;
    authorId?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'createdAt' | 'publishedAt' | 'viewCount';
    sortOrder?: 'asc' | 'desc';
}

export function useLandingPages(options: UseLandingPagesOptions = {}) {
    const params = new URLSearchParams();

    if (options.status) params.append('status', options.status);
    if (options.authorId) params.append('authorId', options.authorId);
    if (options.search) params.append('search', options.search);
    if (options.page) params.append('page', String(options.page));
    if (options.limit) params.append('limit', String(options.limit));
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `/api/admin/landing-pages?${params.toString()}`;

    const { data, error, mutate } = useSWR(url, fetcher);

    return {
        pages: data?.pages as LandingPage[] | undefined,
        pagination: data?.pagination,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
}

export function useLandingPage(id: string | null, includeBlocks = true) {
    const params = new URLSearchParams();
    if (!includeBlocks) params.append('includeBlocks', 'false');

    const url = id ? `/api/admin/landing-pages/${id}?${params.toString()}` : null;

    const { data, error, mutate } = useSWR(url, fetcher);

    return {
        page: data as LandingPageDetail | undefined,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
}

export async function createLandingPage(data: Partial<LandingPageDetail>) {
    const response = await fetch('/api/admin/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create landing page');
    }

    return response.json();
}

export async function updateLandingPage(id: string, data: Partial<LandingPageDetail>) {
    const response = await fetch(`/api/admin/landing-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update landing page');
    }

    return response.json();
}

export async function deleteLandingPage(id: string) {
    const response = await fetch(`/api/admin/landing-pages/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete landing page');
    }

    return response.json();
}

export async function publishLandingPage(id: string, scheduledPublishAt?: string) {
    const response = await fetch(`/api/admin/landing-pages/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledPublishAt }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish landing page');
    }

    return response.json();
}

export async function unpublishLandingPage(id: string) {
    const response = await fetch(`/api/admin/landing-pages/${id}/unpublish`, {
        method: 'POST',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unpublish landing page');
    }

    return response.json();
}

export async function duplicateLandingPage(id: string, title: string, slug: string) {
    const response = await fetch(`/api/admin/landing-pages/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to duplicate landing page');
    }

    return response.json();
}
