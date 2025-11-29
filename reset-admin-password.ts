import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'admin123';
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
    });

    console.log(`✅ Password for ${user.email} reset to '${password}'.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
