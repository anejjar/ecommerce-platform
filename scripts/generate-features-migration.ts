import { featureDocs } from '../src/lib/feature-docs';
import * as fs from 'fs';
import * as path from 'path';

// Map tier to SQL enum value
function tierToSQL(tier: string): string {
  return tier.toUpperCase();
}

// Escape SQL strings
function escapeSQL(str: string): string {
  return str.replace(/'/g, "''").replace(/\n/g, '\\n');
}

async function main() {
  console.log('📝 Generating features migration SQL...');

  const features = Object.values(featureDocs);
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '');
  const migrationName = `${timestamp}_seed_all_features`;
  const migrationDir = path.join(__dirname, '..', 'prisma', 'migrations', migrationName);

  // Create migration directory
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
  }

  // Generate SQL
  let sql = `-- Seed all features from feature-docs.ts
-- This migration ensures all features from feature-docs.ts are present in the database
-- Uses INSERT ... ON DUPLICATE KEY UPDATE to handle existing features gracefully

`;

  for (const doc of features) {
    const name = escapeSQL(doc.key);
    const displayName = escapeSQL(doc.title);
    const description = doc.overview ? escapeSQL(doc.overview) : null;
    const category = escapeSQL(doc.category);
    const tier = tierToSQL(doc.tier);

    // Generate a deterministic ID based on the feature name
    // This ensures the same feature always gets the same ID
    const idHash = Buffer.from(doc.key).toString('base64').substring(0, 21).replace(/[^a-zA-Z0-9]/g, '');
    const featureId = `feat_${idHash}`;

    sql += `INSERT INTO \`FeatureFlag\` (\`id\`, \`name\`, \`displayName\`, \`description\`, \`category\`, \`tier\`, \`enabled\`, \`createdAt\`, \`updatedAt\`)
VALUES (
  '${featureId}',
  '${name}',
  '${displayName}',
  ${description ? `'${description}'` : 'NULL'},
  '${category}',
  '${tier}',
  false,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  \`displayName\` = VALUES(\`displayName\`),
  \`description\` = VALUES(\`description\`),
  \`category\` = VALUES(\`category\`),
  \`tier\` = VALUES(\`tier\`),
  \`updatedAt\` = NOW();

`;
  }

  // Write migration file
  const migrationFile = path.join(migrationDir, 'migration.sql');
  fs.writeFileSync(migrationFile, sql);

  console.log(`✅ Migration generated: ${migrationName}`);
  console.log(`   Location: ${migrationFile}`);
  console.log(`   Features: ${features.length}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Review the migration file`);
  console.log(`   2. Run: npx prisma migrate deploy`);
  console.log(`   3. Or run: npx prisma migrate dev`);
}

main().catch((e) => {
  console.error('❌ Error generating migration:', e);
  process.exit(1);
});

