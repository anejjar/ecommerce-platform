
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            refunds: true
        }
    });

    console.log('Last 5 Orders:');
    orders.forEach(order => {
        console.log(`Order #${order.orderNumber}: PaymentStatus=${order.paymentStatus}, Refunds=${order.refunds.length}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
