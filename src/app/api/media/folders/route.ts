import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR', 'VIEWER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const folders = await prisma.mediaFolder.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { media: true },
                },
            },
        });

        // Build tree structure
        const folderMap = new Map();
        const rootFolders: any[] = [];

        folders.forEach(folder => {
            folderMap.set(folder.id, { ...folder, children: [] });
        });

        folders.forEach(folder => {
            if (folder.parentId) {
                const parent = folderMap.get(folder.parentId);
                if (parent) {
                    parent.children.push(folderMap.get(folder.id));
                }
            } else {
                rootFolders.push(folderMap.get(folder.id));
            }
        });

        return NextResponse.json(rootFolders);
    } catch (error) {
        console.error('Get folders error:', error);
        return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        if (!data.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const slug = data.name.toLowerCase().replace(/\s+/g, '-');

        const folder = await prisma.mediaFolder.create({
            data: {
                name: data.name,
                slug,
                parentId: data.parentId || null,
            },
        });

        return NextResponse.json(folder);
    } catch (error) {
        console.error('Create folder error:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}
