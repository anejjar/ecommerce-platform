import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const DEFAULT_WHATSAPP_TEMPLATE = `Hello! I'd like to place an order:

{items}

Total: {total}

Shipping to:
{customerName}
{address}
{phone}

Order Reference: {orderReference}`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const { cartItems, formData, total, checkoutSettings } = body;

    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!formData.phone) {
      return NextResponse.json(
        { error: 'Phone number is required for WhatsApp orders' },
        { status: 400 }
      );
    }

    if (!formData.address || !formData.city) {
      return NextResponse.json(
        { error: 'Complete address is required' },
        { status: 400 }
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Get WhatsApp business number from settings
    const whatsAppNumber = checkoutSettings?.whatsAppBusinessNumber;
    if (!whatsAppNumber) {
      return NextResponse.json(
        { error: 'WhatsApp ordering is not configured' },
        { status: 400 }
      );
    }

    // Generate order reference
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderReference = `WA-${timestamp}-${random}`;

    // Create address record
    const address = await prisma.address.create({
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company || null,
        address1: formData.address,
        address2: formData.address2 || null,
        city: formData.city,
        state: formData.state || null,
        postalCode: formData.postalCode || '00000',
        country: formData.country || 'Morocco',
        phone: formData.phone,
        userId: session?.user?.id || null,
      },
    });

    // Calculate order totals
    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const shipping = checkoutSettings?.defaultShippingCost || 10;
    const orderTotal = parseFloat(subtotal) + parseFloat(shipping);

    // Create order with PENDING status and WHATSAPP source
    const order = await prisma.order.create({
      data: {
        orderNumber: orderReference,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        orderSource: 'WHATSAPP',
        subtotal: subtotal,
        shipping: shipping,
        tax: 0,
        total: orderTotal,
        userId: session?.user?.id || null,
        isGuest: !session,
        guestEmail: formData.email,
        shippingAddressId: address.id,
        billingAddressId: address.id,
        notes: formData.orderNotes || null,
        whatsAppOrderData: {
          timestamp: new Date().toISOString(),
          customerPhone: formData.phone,
          messagePreview: `Order ${orderReference}`,
          conversionSource: 'button_click',
        },
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Format cart items for WhatsApp message
    const itemsList = order.items
      .map(
        (item: any) =>
          `- ${item.product.name} x${item.quantity} = ${parseFloat(item.total).toFixed(2)} MAD`
      )
      .join('\n');

    // Format address
    const fullAddress = `${formData.address}${formData.address2 ? ', ' + formData.address2 : ''}\n${formData.city}, ${formData.country}`;

    // Process message template
    const template = checkoutSettings?.whatsAppMessageTemplate || DEFAULT_WHATSAPP_TEMPLATE;
    const message = template
      .replace('{items}', itemsList)
      .replace('{total}', `${orderTotal.toFixed(2)} MAD`)
      .replace('{customerName}', `${formData.firstName} ${formData.lastName}`)
      .replace('{address}', fullAddress)
      .replace('{phone}', formData.phone)
      .replace('{orderReference}', orderReference);

    // Generate WhatsApp URL
    const cleanPhone = whatsAppNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      orderReference,
      orderId: order.id,
      whatsappUrl,
      message,
    });
  } catch (error) {
    console.error('Error creating WhatsApp order:', error);
    return NextResponse.json(
      { error: 'Failed to create WhatsApp order' },
      { status: 500 }
    );
  }
}
