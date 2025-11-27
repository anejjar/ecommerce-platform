#!/usr/bin/env tsx
/**
 * Script to remove a feature from the seed-features.ts file
 * Usage: npx tsx scripts/remove-feature-from-seed.ts <feature_name>
 * Example: npx tsx scripts/remove-feature-from-seed.ts analytics_dashboard
 */

import * as fs from 'fs';
import * as path from 'path';

const featureNameToRemove = process.argv[2];

if (!featureNameToRemove) {
  console.error('❌ Error: Please provide a feature name to remove');
  console.log('Usage: npx tsx scripts/remove-feature-from-seed.ts <feature_name>');
  console.log('Example: npx tsx scripts/remove-feature-from-seed.ts analytics_dashboard');
  process.exit(1);
}

const seedFilePath = path.join(__dirname, '..', 'prisma', 'seed-features.ts');

try {
  // Read the seed file
  let content = fs.readFileSync(seedFilePath, 'utf-8');

  // Check if the feature exists in the file
  const searchPattern = new RegExp(`name:\\s*['"\`]${featureNameToRemove}['"\`]`, 'g');
  if (!content.match(searchPattern)) {
    console.error(`❌ Feature "${featureNameToRemove}" not found in seed file`);
    console.log('💡 Make sure the feature name matches exactly (case-sensitive)');
    process.exit(1);
  }

  // Create a more robust regex pattern to match the entire feature object
  // This pattern:
  // 1. Matches the opening brace and any preceding whitespace/comments
  // 2. Matches all content until it finds the specific feature name
  // 3. Continues matching until the closing brace and comma
  // 4. Handles various formatting styles
  const featurePattern = new RegExp(
    `\\n\\s*\\/\\/[^\\n]*\\n\\s*\\{[^}]*name:\\s*['"\`]${featureNameToRemove}['"\`][^}]*\\},?\\s*\\n?`,
    'gm'
  );

  // Try the pattern with comments first
  let updatedContent = content.replace(featurePattern, '');

  // If that didn't work, try without comments
  if (updatedContent === content) {
    const simplePattern = new RegExp(
      `\\s*\\{[^}]*name:\\s*['"\`]${featureNameToRemove}['"\`][^}]*\\},?\\s*\\n?`,
      'gm'
    );
    updatedContent = content.replace(simplePattern, '');
  }

  // Verify that the feature was actually removed
  if (updatedContent === content) {
    console.error(`❌ Failed to remove feature "${featureNameToRemove}"`);
    console.log('💡 The feature might have unusual formatting. Please remove it manually.');
    process.exit(1);
  }

  // Clean up any double newlines that might have been created
  updatedContent = updatedContent.replace(/\n\n\n+/g, '\n\n');

  // Write the updated content back to the file
  fs.writeFileSync(seedFilePath, updatedContent, 'utf-8');

  console.log(`✅ Successfully removed feature "${featureNameToRemove}" from seed file`);
  console.log(`📝 File updated: ${seedFilePath}`);
  console.log('');
  console.log('🔄 Next steps:');
  console.log('   1. Review the changes in seed-features.ts');
  console.log('   2. Run: npx tsx prisma/seed-features.ts (to verify syntax)');
  console.log('   3. Commit the changes');
} catch (error) {
  console.error('❌ Error removing feature from seed file:', error);
  process.exit(1);
}
