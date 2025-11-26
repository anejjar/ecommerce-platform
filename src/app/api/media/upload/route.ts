import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user exists in database (handles stale sessions after DB resets)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });
        console.log(user)

        if (!user) {
            return NextResponse.json({ error: 'User record not found. Please login again.' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folderId = formData.get('folderId') as string | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file, 'ecommerce/media-library');

        // Determine media type
        let mediaType = 'OTHER';
        if (result.resource_type === 'image') mediaType = 'IMAGE';
        else if (result.resource_type === 'video') mediaType = 'VIDEO';
        else if (result.resource_type === 'raw') mediaType = 'DOCUMENT';

        // Create database record
        const media = await prisma.mediaLibrary.create({
            data: {
                filename: file.name,
                originalName: file.name,
                mimeType: file.type,
                fileSize: result.bytes,
                type: mediaType as any,
                cloudinaryId: result.public_id,
                url: result.url,
                secureUrl: result.secure_url,
                publicId: result.public_id,
                version: result.version,
                format: result.format,
                width: result.width,
                height: result.height,
                aspectRatio: result.width && result.height ? result.width / result.height : null,
                uploadedById: session.user.id,
                folderId: folderId || null,
            },
        });

        // Create thumbnail variant if it's an image
        if (mediaType === 'IMAGE') {
            // Note: In a real implementation, we might want to eagerly generate variants
            // or just rely on Cloudinary's dynamic transformation URLs.
            // For now, we'll just store the main image.
        }

        return NextResponse.json(media);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
