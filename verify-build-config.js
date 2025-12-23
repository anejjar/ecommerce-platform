#!/usr/bin/env node

/**
 * Build Configuration Verification Script
 *
 * This script verifies that your Next.js build is properly configured
 * to use Webpack instead of Turbopack for faster production builds.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Next.js Build Configuration...\n');

let hasIssues = false;

// Check 1: Verify next.config.ts has turbo disabled
console.log('1️⃣  Checking next.config.ts...');
try {
  const configPath = path.join(__dirname, 'next.config.ts');
  const configContent = fs.readFileSync(configPath, 'utf8');

  if (configContent.includes('turbo: undefined') ||
      configContent.includes('turbo:undefined') ||
      configContent.includes('turbo = undefined')) {
    console.log('   ✅ Turbopack is disabled in config');
  } else {
    console.log('   ⚠️  Could not verify Turbopack is disabled');
    console.log('   💡 Make sure next.config.ts has: experimental: { turbo: undefined }');
    hasIssues = true;
  }

  if (configContent.includes("output: 'standalone'")) {
    console.log('   ✅ Standalone output is enabled');
  } else {
    console.log('   ⚠️  Standalone output not found');
    hasIssues = true;
  }
} catch (error) {
  console.log('   ❌ Could not read next.config.ts');
  hasIssues = true;
}

// Check 2: Verify package.json build script
console.log('\n2️⃣  Checking package.json build script...');
try {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  const buildScript = packageJson.scripts?.build || '';

  if (buildScript.includes('--turbo')) {
    console.log('   ❌ Build script uses --turbo flag!');
    console.log('   💡 Remove --turbo from build script in package.json');
    hasIssues = true;
  } else {
    console.log('   ✅ Build script does not use --turbo flag');
  }

  if (buildScript === 'next build') {
    console.log('   ✅ Build script is correct: "next build"');
  }
} catch (error) {
  console.log('   ❌ Could not read package.json');
  hasIssues = true;
}

// Check 3: Check for Turbopack environment variables
console.log('\n3️⃣  Checking for Turbopack environment variables...');
const turboEnvVars = ['TURBOPACK', 'NEXT_TURBOPACK'];
const foundEnvVars = turboEnvVars.filter(varName => process.env[varName]);

if (foundEnvVars.length > 0) {
  console.log(`   ⚠️  Found Turbopack env vars: ${foundEnvVars.join(', ')}`);
  console.log('   💡 Unset these environment variables for production builds');
  hasIssues = true;
} else {
  console.log('   ✅ No Turbopack environment variables found');
}

// Check 4: Verify .next cache doesn't exist (suggests clean build)
console.log('\n4️⃣  Checking build cache...');
const nextCachePath = path.join(__dirname, '.next');
if (fs.existsSync(nextCachePath)) {
  console.log('   ℹ️  .next directory exists (from previous build)');
  console.log('   💡 For a clean build, run: rm -rf .next && npm run build');
} else {
  console.log('   ✅ No build cache (clean state)');
}

// Summary
console.log('\n' + '='.repeat(60));
if (!hasIssues) {
  console.log('✅ Configuration looks good!');
  console.log('\n📊 Expected build performance:');
  console.log('   • Total build time: 3-5 minutes (with Webpack)');
  console.log('   • Previously: 14+ minutes (with Turbopack)');
  console.log('   • Improvement: ~70% faster builds');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. Verify build logs say "Compiled successfully" (not "Turbopack")');
  console.log('   3. Check total build time is under 5 minutes');
} else {
  console.log('⚠️  Found configuration issues!');
  console.log('\n🔧 Please fix the issues above and run this script again.');
  console.log('   Then run: npm run build');
  process.exit(1);
}
console.log('='.repeat(60) + '\n');
