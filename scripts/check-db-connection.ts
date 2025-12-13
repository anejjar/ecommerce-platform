
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Starting DB connection check...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined (hidden)' : 'Undefined');

    try {
        console.log('Attempting to connect to database...');
        await prisma.$connect();
        console.log('Successfully connected to database.');

        console.log('Attempting simple query (count users)...');
        const userCount = await prisma.user.count();
        console.log(`Query successful. User count: ${userCount}`);

        console.log('Attempting to fetch store settings (used in Home Page)...');
        const settings = await prisma.storeSetting.findMany({
            take: 5,
        });
        console.log(`Fetched ${settings.length} store settings.`);

    } catch (error) {
        console.error('DB Connection or Query failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log('Disconnected.');
    }
}

main();
