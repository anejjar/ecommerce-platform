import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'admin123';

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`❌ User ${email} not found in database.`);
        return;
    }

    console.log(`✅ User ${email} found.`);
    console.log(`Role: ${user.role}`);

    const isValid = await compare(password, user.password);

    if (isValid) {
        console.log('✅ Password matches.');
    } else {
        console.log('❌ Password does NOT match.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
