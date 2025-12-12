import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Updating feature flag from product_import_export to data_import_export...');

    // Check if the old feature flag exists
    const oldFeature = await prisma.featureFlag.findUnique({
        where: {
            name: 'product_import_export',
        },
    });

    if (oldFeature) {
        console.log('📋 Found existing product_import_export feature flag');

        // Check if new feature flag already exists
        const newFeature = await prisma.featureFlag.findUnique({
            where: {
                name: 'data_import_export',
            },
        });

        if (newFeature) {
            console.log('⚠️  data_import_export feature flag already exists');
            console.log('🗑️  Deleting old product_import_export feature flag...');

            await prisma.featureFlag.delete({
                where: {
                    name: 'product_import_export',
                },
            });

            console.log('✅ Old feature flag deleted successfully');
        } else {
            console.log('🔄 Updating feature flag key and details...');

            // Update the feature flag
            await prisma.featureFlag.update({
                where: {
                    name: 'product_import_export',
                },
                data: {
                    name: 'data_import_export',
                    description: 'Comprehensive import/export system for all data types including products, images, blog posts, orders, customers, and more. Supports CSV and JSON formats with validation, relationship handling, and media file uploads.',
                },
            });

            console.log('✅ Feature flag updated successfully from product_import_export to data_import_export');
        }
    } else {
        console.log('⚠️  product_import_export feature flag not found');

        // Check if data_import_export already exists
        const newFeature = await prisma.featureFlag.findUnique({
            where: {
                name: 'data_import_export',
            },
        });

        if (newFeature) {
            console.log('✅ data_import_export feature flag already exists');
        } else {
            console.log('➕ Creating new data_import_export feature flag...');

            await prisma.featureFlag.create({
                data: {
                    name: 'data_import_export',
                    displayName: 'Data Import/Export',
                    description: 'Comprehensive import/export system for all data types including products, images, blog posts, orders, customers, and more. Supports CSV and JSON formats with validation, relationship handling, and media file uploads.',
                    enabled: false,
                    tier: 'ENTERPRISE',
                },
            });

            console.log('✅ New feature flag created successfully');
        }
    }

    console.log('📝 Migration complete! You can now enable the data_import_export feature in /admin/features');
}

main()
    .catch((e) => {
        console.error('❌ Error updating feature flag:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
