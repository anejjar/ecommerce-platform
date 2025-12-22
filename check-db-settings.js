// Script to check shipping settings in database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseSettings() {
  try {
    console.log('Checking shipping settings in database...\n');

    // Fetch all shipping settings from database
    const settings = await prisma.storeSetting.findMany({
      where: { category: 'shipping' },
      orderBy: { key: 'asc' },
    });

    if (settings.length === 0) {
      console.log('⚠️  No shipping settings found in database!');
      console.log('Please configure shipping settings in the admin panel at /admin/settings/shipping\n');
      return;
    }

    console.log('✅ Shipping settings found in database:');
    console.log('=======================================\n');

    settings.forEach((setting) => {
      console.log(`${setting.key}: ${setting.value}`);
    });

    console.log('\n✅ Database settings are configured!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseSettings();
