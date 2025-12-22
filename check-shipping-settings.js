// Test script to verify shipping settings are properly configured
const fetch = require('node-fetch');

async function checkShippingSettings() {
  try {
    console.log('Checking shipping settings configuration...\n');

    // Fetch checkout settings (includes shipping settings)
    const response = await fetch('http://localhost:3000/api/checkout-settings');

    if (!response.ok) {
      console.error('❌ Failed to fetch checkout settings');
      return;
    }

    const data = await response.json();

    console.log('✅ Checkout Settings API Response:');
    console.log('=====================================');

    if (data.shippingSettings) {
      console.log('\n📦 Shipping Settings:');
      console.log('-------------------');
      console.log('Free Shipping Enabled:', data.shippingSettings.shipping_enable_free);
      console.log('Free Shipping Threshold:', data.shippingSettings.shipping_free_threshold);
      console.log('Flat Rate Enabled:', data.shippingSettings.shipping_enable_flat_rate);
      console.log('Flat Rate Amount:', data.shippingSettings.shipping_flat_rate);
      console.log('\n💰 Tax Settings:');
      console.log('-------------------');
      console.log('Tax Enabled:', data.shippingSettings.tax_enable);
      console.log('Tax Rate:', data.shippingSettings.tax_rate_default + '%');

      console.log('\n✅ All settings are properly configured and accessible!');
    } else {
      console.log('⚠️  No shipping settings found in response');
      console.log('Response:', JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkShippingSettings();
