import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const feature = await prisma.featureFlag.upsert({
            where: { name: 'refund_management' },
            update: { enabled: true },
            create: {
                name: 'refund_management',
                displayName: 'Refund Management',
                description: 'Allow customers to request refunds',
                category: 'Operations',
                enabled: true,
            },
        });
        console.log('Successfully enabled refund_management feature:', feature);
    } catch (error) {
        console.error('Error enabling feature:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
