
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const feature = await prisma.featureFlag.findUnique({
        where: { name: 'refund_management' },
    });
    console.log('Refund Management Feature Flag:', feature);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
