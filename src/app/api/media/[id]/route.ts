import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const media = await prisma.mediaLibrary.findUnique({
            where: { id },
            include: {
                folder: true,
                tags: true,
                uploadedBy: {
                    select: { name: true, image: true },
                },
                usage: true,
            },
        });

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        return NextResponse.json(media);
    } catch (error) {
        console.error('Get media error:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();

        const media = await prisma.mediaLibrary.update({
            where: { id },
            data: {
                altText: data.altText,
                title: data.title,
                caption: data.caption,
                description: data.description,
                folderId: data.folderId,
                tags: data.tags ? {
                    set: [], // Clear existing tags
                    connectOrCreate: data.tags.map((tag: string) => ({
                        where: { name: tag },
                        create: { name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') },
                    })),
                } : undefined,
            },
            include: {
                tags: true,
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error('Update media error:', error);
        return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const media = await prisma.mediaLibrary.findUnique({
            where: { id },
        });

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(media.publicId);

        // Delete from database
        await prisma.mediaLibrary.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete media error:', error);
        return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
}
