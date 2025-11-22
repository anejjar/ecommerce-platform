const fs = require('fs');
const path = require('path');

// Read the English translation file as the source of truth
const enTranslations = require('../messages/en.json');

// Helper to convert nested object to type path
function generateTypePaths(obj, prefix = '') {
  let paths = [];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object - recurse
      paths = paths.concat(generateTypePaths(value, currentPath));
    } else {
      // Leaf node - add the path
      paths.push(`  | '${currentPath}'`);
    }
  }

  return paths;
}

// Generate the type definition
const typePaths = generateTypePaths(enTranslations);
const typeDefinition = `// Auto-generated translation keys from messages/en.json
// DO NOT EDIT MANUALLY - Run 'npm run generate:translation-types' to regenerate

export type TranslationKey =
${typePaths.join('\n')};

// Helper type for nested translation access
export type NestedKeyOf<T extends object> = {
  [Key in keyof T & string]: T[Key] extends object
    ? Key | \`\${Key}.\${NestedKeyOf<T[Key]>}\`
    : Key;
}[keyof T & string];
`;

// Write to file
const outputPath = path.join(__dirname, '../src/types/translations.ts');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, typeDefinition, 'utf-8');

console.log('✅ Translation types generated successfully!');
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 Total keys: ${typePaths.length}`);
