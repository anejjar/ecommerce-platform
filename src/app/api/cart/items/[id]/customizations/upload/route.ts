import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/cart/items/[id]/customizations/upload
 * Upload a file for a customization field
 */
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    // Check authentication - session required
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id: cartItemId } = await context.params;
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fieldId = formData.get('fieldId') as string;

    // Validate input
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!fieldId) {
      return NextResponse.json({ error: 'Field ID is required' }, { status: 400 });
    }

    // Check if cart item exists and belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: user.id,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            published: true,
          },
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found or does not belong to you' },
        { status: 404 }
      );
    }

    if (!cartItem.product.published) {
      return NextResponse.json(
        { error: 'Product is no longer available' },
        { status: 400 }
      );
    }

    // Get the customization field
    const field = await prisma.productCustomizationField.findFirst({
      where: {
        id: fieldId,
        productId: cartItem.product.id,
      },
    });

    if (!field) {
      return NextResponse.json(
        { error: 'Customization field not found' },
        { status: 404 }
      );
    }

    // Validate that this field is a FILE type
    if (field.type !== 'FILE') {
      return NextResponse.json(
        { error: 'This field does not accept file uploads' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxFileSize = field.maxFileSize || 5000; // Default 5MB in KB
    const fileSizeInKB = file.size / 1024;

    if (fileSizeInKB > maxFileSize) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum allowed size of ${maxFileSize}KB`,
          maxSize: maxFileSize,
          actualSize: Math.round(fileSizeInKB),
        },
        { status: 400 }
      );
    }

    // Validate file type if specified
    if (field.allowedTypes) {
      const allowedTypes = field.allowedTypes.split(',').map((type) => type.trim());
      const fileType = file.type;

      // Check if file type matches any allowed type
      const isAllowed = allowedTypes.some((allowedType) => {
        // Support wildcards like "image/*"
        if (allowedType.endsWith('/*')) {
          const category = allowedType.split('/')[0];
          return fileType.startsWith(category + '/');
        }
        return fileType === allowedType;
      });

      if (!isAllowed) {
        return NextResponse.json(
          {
            error: `File type "${fileType}" is not allowed. Allowed types: ${field.allowedTypes}`,
            allowedTypes: field.allowedTypes,
            fileType,
          },
          { status: 400 }
        );
      }
    }

    // Upload to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(
        file,
        `ecommerce/customizations/${cartItem.product.id}`
      );
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to cloud storage' },
        { status: 500 }
      );
    }

    // Check if a customization already exists for this field
    const existingCustomization = await prisma.cartItemCustomization.findFirst({
      where: {
        cartItemId,
        fieldId,
      },
    });

    // Create or update the customization with the file URL
    const priceModifier = Number(field.priceModifier) || 0;

    const customization = await prisma.cartItemCustomization.upsert({
      where: {
        id: existingCustomization?.id || 'new-id', // Provide fallback for new records
      },
      create: {
        cartItemId,
        fieldId,
        fileUrl: uploadResult.secure_url,
        fileName: file.name,
        priceModifier,
      },
      update: {
        fileUrl: uploadResult.secure_url,
        fileName: file.name,
        priceModifier,
      },
    });

    return NextResponse.json({
      success: true,
      customization: {
        id: customization.id,
        fieldId: customization.fieldId,
        fileUrl: customization.fileUrl,
        fileName: customization.fileName,
        priceModifier: customization.priceModifier,
      },
      cloudinary: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      },
    });
  } catch (error) {
    console.error('Error uploading customization file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
