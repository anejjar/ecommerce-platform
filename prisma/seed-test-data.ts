import { PrismaClient, UserRole, OrderStatus, PaymentStatus, RefundStatus, RefundReason, DiscountType, PostStatus, MediaType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting comprehensive test data seeding...');

    // 1. Clean up existing data
    console.log('🧹 Cleaning up existing data...');
    try {
        // Delete in reverse order of dependencies
        await prisma.refundItem.deleteMany({});
        await prisma.refund.deleteMany({});
        await prisma.orderNote.deleteMany({});
        await prisma.orderItem.deleteMany({});
        await prisma.order.deleteMany({});
        await prisma.review.deleteMany({});
        await prisma.cartItem.deleteMany({});
        await prisma.cart.deleteMany({});
        await prisma.address.deleteMany({});
        await prisma.productImage.deleteMany({});
        await prisma.productVariant.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});
        await prisma.newsletterSubscriber.deleteMany({});
        await prisma.blogPost.deleteMany({});
        await prisma.discountCode.deleteMany({});
        await prisma.wishlistItem.deleteMany({});
        await prisma.passwordReset.deleteMany({});
        await prisma.adminActivityLog.deleteMany({});
        await prisma.abandonedCartEmail.deleteMany({});
        await prisma.abandonedCart.deleteMany({});
        // Media cleanup
        await prisma.mediaLibrary.deleteMany({});

        // Delete users
        await prisma.account.deleteMany({});
        // await prisma.session.deleteMany({}); // Removed as it doesn't exist
        await prisma.user.deleteMany({});

        console.log('🧹 Cleanup finished.');
    } catch (error) {
        console.warn('⚠️ Error during cleanup (might be fine if tables are empty or constraints prevent deletion):', error);
    }

    // 2. Users & Roles
    console.log('👤 Seeding Users...');
    const password = await hash('password123', 12);

    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            name: 'Super Admin',
            password,
            role: 'SUPERADMIN',
            emailVerified: new Date(),
        },
    });

    const manager = await prisma.user.create({
        data: {
            email: 'manager@example.com',
            name: 'Store Manager',
            password,
            role: 'MANAGER',
            emailVerified: new Date(),
        },
    });

    const customer1 = await prisma.user.create({
        data: {
            email: 'alice@example.com',
            name: 'Alice Wonderland',
            password,
            role: 'CUSTOMER',
            emailVerified: new Date(),
        },
    });

    const customer2 = await prisma.user.create({
        data: {
            email: 'bob@example.com',
            name: 'Bob Builder',
            password,
            role: 'CUSTOMER',
            emailVerified: new Date(),
        },
    });

    // 3. Categories
    console.log('📂 Seeding Categories...');
    const categoriesData = [
        { name: 'Coffee Beans', slug: 'coffee-beans', description: 'Premium roasted coffee beans from around the world.' },
        { name: 'Brewing Gear', slug: 'brewing-gear', description: 'Everything you need to brew the perfect cup.' },
        { name: 'Accessories', slug: 'accessories', description: 'Mugs, filters, and other coffee essentials.' },
        { name: 'Merchandise', slug: 'merchandise', description: 'Branded apparel and gifts.' },
    ];

    const categories = [];
    for (const cat of categoriesData) {
        const category = await prisma.category.create({
            data: cat,
        });
        categories.push(category);
    }

    // 4. Products
    console.log('☕ Seeding Products...');
    const productsData = [
        {
            name: 'Ethiopian Yirgacheffe',
            slug: 'ethiopian-yirgacheffe',
            description: 'Bright and floral with notes of jasmine and lemon. Light roast.',
            price: 18.00,
            stock: 50,
            sku: 'COF-ETH-001',
            categoryId: categories[0].id,
            images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1000'],
        },
        {
            name: 'Colombian Supremo',
            slug: 'colombian-supremo',
            description: 'Balanced and smooth with caramel sweetness and nutty undertones. Medium roast.',
            price: 16.50,
            stock: 75,
            sku: 'COF-COL-001',
            categoryId: categories[0].id,
            images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000'],
        },
        {
            name: 'French Press Pro',
            slug: 'french-press-pro',
            description: 'Stainless steel french press for a rich and full-bodied brew.',
            price: 35.00,
            stock: 20,
            sku: 'GEAR-FP-001',
            categoryId: categories[1].id,
            images: ['https://images.unsplash.com/photo-1565458318268-68875326d604?auto=format&fit=crop&q=80&w=1000'],
        },
        {
            name: 'Ceramic Pour Over',
            slug: 'ceramic-pour-over',
            description: 'Classic ceramic dripper for a clean and aromatic cup.',
            price: 22.00,
            stock: 30,
            sku: 'GEAR-PO-001',
            categoryId: categories[1].id,
            images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1000'],
        },
        {
            name: 'Barista Apron',
            slug: 'barista-apron',
            description: 'Professional grade canvas apron with leather straps.',
            price: 45.00,
            stock: 15,
            sku: 'MERCH-APR-001',
            categoryId: categories[3].id,
            images: ['https://images.unsplash.com/photo-1556742046-806e8ac66099?auto=format&fit=crop&q=80&w=1000'],
        },
    ];

    const products = [];
    for (const prod of productsData) {
        const { images, ...productData } = prod;
        const product = await prisma.product.create({
            data: {
                ...productData,
                images: {
                    create: images.map((url, index) => ({
                        url,
                        position: index,
                        alt: productData.name,
                    })),
                },
            },
        });
        products.push(product);
    }

    // 5. Orders
    console.log('📦 Seeding Orders...');

    // Address for Alice - Order 1
    const addressAlice1 = await prisma.address.create({
        data: {
            userId: customer1.id,
            firstName: 'Alice',
            lastName: 'Wonderland',
            address1: '123 Rabbit Hole Ln',
            city: 'Wonderland',
            state: 'WL',
            postalCode: '12345',
            country: 'USA',
            phone: '555-0101',
            isDefault: true,
        },
    });

    // Order 1: Completed
    await prisma.order.create({
        data: {
            orderNumber: 'ORD-TEST-001',
            userId: customer1.id,
            status: OrderStatus.DELIVERED,
            paymentStatus: PaymentStatus.PAID,
            subtotal: 53.00,
            tax: 5.30,
            shipping: 0,
            total: 58.30,
            shippingAddressId: addressAlice1.id,
            items: {
                create: [
                    { productId: products[0].id, quantity: 2, price: 18.00, total: 36.00 },
                    { productId: products[1].id, quantity: 1, price: 17.00, total: 17.00 },
                ],
            },
        },
    });

    // Address for Alice - Order 2
    const addressAlice2 = await prisma.address.create({
        data: {
            userId: customer1.id,
            firstName: 'Alice',
            lastName: 'Wonderland',
            address1: '123 Rabbit Hole Ln',
            city: 'Wonderland',
            state: 'WL',
            postalCode: '12345',
            country: 'USA',
            phone: '555-0101',
        },
    });

    // Order 2: Processing
    await prisma.order.create({
        data: {
            orderNumber: 'ORD-TEST-002',
            userId: customer1.id,
            status: OrderStatus.PROCESSING,
            paymentStatus: PaymentStatus.PAID,
            subtotal: 35.00,
            tax: 3.50,
            shipping: 5.00,
            total: 43.50,
            shippingAddressId: addressAlice2.id,
            items: {
                create: [
                    { productId: products[2].id, quantity: 1, price: 35.00, total: 35.00 },
                ],
            },
        },
    });

    // Address for Bob
    const addressBob = await prisma.address.create({
        data: {
            userId: customer2.id,
            firstName: 'Bob',
            lastName: 'Builder',
            address1: '456 Construction Way',
            city: 'Buildsville',
            state: 'BV',
            postalCode: '67890',
            country: 'USA',
            phone: '555-0202',
        },
    });

    // Order 3: Pending Payment (Bob)
    await prisma.order.create({
        data: {
            orderNumber: 'ORD-TEST-003',
            userId: customer2.id,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            subtotal: 22.00,
            tax: 2.20,
            shipping: 5.00,
            total: 29.20,
            shippingAddressId: addressBob.id,
            items: {
                create: [
                    { productId: products[3].id, quantity: 1, price: 22.00, total: 22.00 },
                ],
            },
        },
    });

    // 6. Reviews
    console.log('⭐ Seeding Reviews...');
    await prisma.review.create({
        data: {
            userId: customer1.id,
            productId: products[0].id,
            rating: 5,
            title: 'Amazing Coffee!',
            comment: 'This is hands down the best Ethiopian coffee I have ever tasted. Highly recommended!',
            verified: true,
            approved: true,
        },
    });

    await prisma.review.create({
        data: {
            userId: customer2.id,
            productId: products[0].id,
            rating: 4,
            title: 'Good brew',
            comment: 'Very tasty, but a bit pricey.',
            verified: true,
            approved: true,
        },
    });

    // 7. Discount Codes
    console.log('🏷️ Seeding Discount Codes...');
    await prisma.discountCode.create({
        data: {
            code: 'WELCOME10',
            type: DiscountType.PERCENTAGE,
            value: 10,
            startDate: new Date(),
            isActive: true,
        },
    });

    await prisma.discountCode.create({
        data: {
            code: 'SUMMER25',
            type: DiscountType.FIXED_AMOUNT,
            value: 25,
            minOrderAmount: 100,
            startDate: new Date(),
            isActive: true,
        },
    });

    // 8. Blog Posts
    console.log('📝 Seeding Blog Posts...');
    await prisma.blogPost.create({
        data: {
            title: 'The Ultimate V60 Brewing Guide',
            slug: 'brewing-guide-v60',
            content: '<h1>How to Brew with V60</h1><p>The V60 is a classic pour-over method...</p>',
            excerpt: 'Master the art of pour-over coffee with our comprehensive V60 guide.',
            status: PostStatus.PUBLISHED,
            authorId: admin.id,
            publishedAt: new Date(),
        },
    });

    await prisma.blogPost.create({
        data: {
            title: 'Understanding Coffee Origins',
            slug: 'coffee-bean-origins',
            content: '<h1>Coffee Around the World</h1><p>From Ethiopia to Colombia...</p>',
            excerpt: 'A deep dive into how geography affects coffee flavor profiles.',
            status: PostStatus.DRAFT,
            authorId: admin.id,
        },
    });

    // 9. Refunds
    console.log('💸 Seeding Refunds...');
    // Create a refund for Order 1 (partial)
    const order1Ref = await prisma.order.findUnique({ where: { orderNumber: 'ORD-TEST-001' } });
    if (order1Ref) {
        await prisma.refund.create({
            data: {
                rmaNumber: 'RMA-001',
                orderId: order1Ref.id,
                requestedById: customer1.id,
                status: RefundStatus.PENDING,
                reason: RefundReason.CHANGED_MIND,
                refundAmount: 18.00,
                refundItems: {
                    create: [
                        {
                            quantity: 1,
                            orderItemId: (await prisma.orderItem.findFirst({ where: { orderId: order1Ref.id, productId: products[0].id } }))?.id!,
                            productId: products[0].id,
                        }
                    ]
                }
            }
        });
    }

    // 10. Newsletter Subscribers
    console.log('📧 Seeding Newsletter Subscribers...');
    await prisma.newsletterSubscriber.create({
        data: {
            email: 'subscriber@example.com',
            name: 'News Reader',
            isActive: true,
            source: 'footer',
        },
    });

    await prisma.newsletterSubscriber.create({
        data: {
            email: customer1.email,
            userId: customer1.id,
            name: customer1.name,
            isActive: true,
            source: 'checkout',
        },
    });

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
