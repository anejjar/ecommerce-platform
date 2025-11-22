import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Creating SUPERADMIN user...\n');

  const email = 'superadmin@yourstore.com';
  const password = 'superadmin123'; // CHANGE THIS IN PRODUCTION!
  const name = 'Super Admin';

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`⚠️  User with email ${email} already exists.`);
    console.log(`Updating to SUPERADMIN role...\n`);

    await prisma.user.update({
      where: { email },
      data: { role: 'SUPERADMIN' },
    });

    console.log('✅ User updated to SUPERADMIN!');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'SUPERADMIN',
      },
    });

    console.log('✅ SUPERADMIN user created successfully!\n');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  IMPORTANT: Change this password immediately after first login!\n');
  }

  console.log('\n🎯 Next steps:');
  console.log('1. Go to http://localhost:3000/admin/login');
  console.log('2. Login with the credentials above');
  console.log('3. Navigate to "Features" in the admin sidebar');
  console.log('4. Enable the "Analytics & Reporting Dashboard" feature');
  console.log('5. The Analytics menu will appear in the sidebar');
  console.log('\n✨ Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error creating SUPERADMIN:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
