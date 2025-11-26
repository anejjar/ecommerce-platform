import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { orderConfirmationEmail, welcomeEmail, adminNewOrderEmail, lowStockAlertEmail } from '@/lib/email-templates';
import bcrypt from 'bcryptjs';

async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const todayOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const sequence = String(todayOrders + 1).padStart(4, '0');
  return `ORD-${year}${month}${day}-${sequence}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items, shippingAddress, customerInfo, isGuest, createAccount, password, orderNotes } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address1 ||
      !shippingAddress.city
    ) {
      return NextResponse.json(
        { error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }

    if (!customerInfo?.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find or create user
    let user;

    if (session && session.user) {
      // Logged in user
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found. Please sign in again.' },
          { status: 401 }
        );
      }
    } else if (isGuest) {
      // Guest checkout
      if (createAccount) {
        // Guest wants to create account
        if (!password || password.length < 6) {
          return NextResponse.json(
            { error: 'Password must be at least 6 characters' },
            { status: 400 }
          );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: customerInfo.email },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: 'Email already exists. Please sign in.' },
            { status: 400 }
          );
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
          data: {
            email: customerInfo.email,
            password: hashedPassword,
            name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
            role: 'CUSTOMER',
          },
        });

        // Send welcome email
        try {
          await sendEmail({
            to: user.email,
            subject: 'Welcome to Our Store!',
            html: welcomeEmail(user.name || user.email),
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
        }
      } else {
        // Pure guest checkout - no user account
        user = null;
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate totals and validate stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      let price;
      let stock;

      if (item.variantId) {
        // Get variant price and stock
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant || !variant.product.published) {
          return NextResponse.json(
            { error: `Product variant not available` },
            { status: 400 }
          );
        }

        price = variant.price ? Number(variant.price) : Number(variant.product.price);
        stock = variant.stock;

        if (stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for variant` },
            { status: 400 }
          );
        }
      } else {
        // Get base product price and stock
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.published) {
          return NextResponse.json(
            { error: `Product not available` },
            { status: 400 }
          );
        }

        price = Number(product.price);
        stock = product.stock;

        if (stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name}` },
            { status: 400 }
          );
        }
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId || null,
        price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    let total = subtotal + tax + shipping;

    // Handle Discount Code
    let discountAmount = 0;
    let discountCodeId = null;

    if (body.discountCodeId) {
      const discount = await prisma.discountCode.findUnique({
        where: { id: body.discountCodeId },
      });

      if (discount && discount.isActive) {
        const now = new Date();
        const isValidDate =
          discount.startDate <= now &&
          (!discount.endDate || discount.endDate >= now);
        const isValidUsage =
          !discount.maxUses || discount.usedCount < discount.maxUses;
        const isValidMinOrder =
          !discount.minOrderAmount ||
          subtotal >= Number(discount.minOrderAmount);

        if (isValidDate && isValidUsage && isValidMinOrder) {
          if (discount.type === 'PERCENTAGE') {
            discountAmount = (subtotal * Number(discount.value)) / 100;
          } else {
            discountAmount = Number(discount.value);
          }

          // Ensure discount doesn't exceed total
          discountAmount = Math.min(discountAmount, total);
          total -= discountAmount;
          discountCodeId = discount.id;

          // Increment usage count
          await prisma.discountCode.update({
            where: { id: discount.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    // Create shipping address
    const address = await prisma.address.create({
      data: {
        firstName: customerInfo.firstName || '',
        lastName: customerInfo.lastName || '',
        company: shippingAddress.company || null,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state || null,
        postalCode: shippingAddress.postalCode || '00000',
        country: shippingAddress.country || 'Morocco',
        phone: customerInfo.phone || null,
        userId: user?.id || null,
      },
    });

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        tax,
        shipping,
        total,
        discountCodeId,
        discountAmount,
        notes: orderNotes || null,
        userId: user?.id || null,
        isGuest: !user || isGuest,
        guestEmail: !user ? customerInfo.email : null,
        shippingAddressId: address.id,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: true,
        shippingAddress: true,
      },
    });

    // Update stock (product AND variant if applicable)
    for (const item of items) {
      if (item.variantId) {
        // Update variant stock AND product stock
        await prisma.$transaction([
          prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
          prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        ]);
      } else {
        // Update product stock only (no variants)
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    // Check for low stock alerts after stock updates
    try {
      const productIds = items.map((item: any) => item.productId);

      const lowStockProducts = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          stockAlert: {
            isNot: null,
          },
        },
        include: {
          stockAlert: true,
        },
      });

      const productsToAlert = lowStockProducts.filter((product) => {
        if (!product.stockAlert) return false;
        const threshold = product.stockAlert.threshold;
        return product.stock <= threshold && !product.stockAlert.notified;
      });

      if (productsToAlert.length > 0) {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
          await sendEmail({
            to: adminEmail,
            subject: 'Low Stock Alert',
            html: lowStockAlertEmail(
              productsToAlert.map((p) => ({
                name: p.name,
                sku: p.sku,
                stock: p.stock,
                threshold: p.stockAlert!.threshold,
              }))
            ),
          });

          // Mark alerts as notified
          await prisma.stockAlert.updateMany({
            where: {
              productId: { in: productsToAlert.map((p) => p.id) },
            },
            data: {
              notified: true,
            },
          });
        }
      }
    } catch (stockAlertError) {
      console.error('Failed to check/send stock alerts:', stockAlertError);
      // Don't fail the order if stock alert fails
    }

    // Send order confirmation email
    const emailTo = user?.email || customerInfo.email;
    const customerName = user?.name || `${customerInfo.firstName} ${customerInfo.lastName}`.trim();

    try {
      await sendEmail({
        to: emailTo,
        subject: `Order Confirmation - ${orderNumber}`,
        html: orderConfirmationEmail(
          {
            orderNumber: order.orderNumber,
            total: order.total.toString(),
            subtotal: order.subtotal.toString(),
            tax: order.tax.toString(),
            shipping: order.shipping.toString(),
            discountAmount: order.discountAmount.toString(),
            status: order.status,
            items: order.items.map((item) => ({
              product: { name: item.product.name },
              quantity: item.quantity,
              price: item.price.toString(),
              total: item.total.toString(),
            })),
            shippingAddress: order.shippingAddress || undefined,
          },
          customerName || emailTo
        ),
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    // Send admin notification email
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `New Order Received - ${orderNumber}`,
          html: adminNewOrderEmail(
            {
              orderNumber: order.orderNumber,
              total: order.total.toString(),
              subtotal: order.subtotal.toString(),
              tax: order.tax.toString(),
              shipping: order.shipping.toString(),
              discountAmount: order.discountAmount.toString(),
              status: order.status,
              items: order.items.map((item) => ({
                product: { name: item.product.name },
                quantity: item.quantity,
                price: item.price.toString(),
                total: item.total.toString(),
              })),
              shippingAddress: order.shippingAddress || undefined,
            },
            emailTo
          ),
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
