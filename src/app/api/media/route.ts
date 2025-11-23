import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search') || '';
        const folderId = searchParams.get('folderId');
        const type = searchParams.get('type');
        const sort = searchParams.get('sort') || 'newest';

        const skip = (page - 1) * limit;

        const where: Prisma.MediaLibraryWhereInput = {};

        if (search) {
            where.OR = [
                { filename: { contains: search } },
                { title: { contains: search } },
                { altText: { contains: search } },
                { caption: { contains: search } },
            ];
        }

        if (folderId) {
            where.folderId = folderId === 'root' ? null : folderId;
        }

        if (type) {
            where.type = type as any;
        }

        let orderBy: Prisma.MediaLibraryOrderByWithRelationInput = { createdAt: 'desc' };

        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'name_asc':
                orderBy = { filename: 'asc' };
                break;
            case 'name_desc':
                orderBy = { filename: 'desc' };
                break;
            case 'size_asc':
                orderBy = { fileSize: 'asc' };
                break;
            case 'size_desc':
                orderBy = { fileSize: 'desc' };
                break;
        }

        const [media, total] = await Promise.all([
            prisma.mediaLibrary.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    folder: true,
                    uploadedBy: {
                        select: { name: true, image: true },
                    },
                },
            }),
            prisma.mediaLibrary.count({ where }),
        ]);

        return NextResponse.json({
            media,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('Media list error:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}
