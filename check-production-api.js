// Check if production API has products
// Run: node check-production-api.js

const https = require('https');

const PRODUCTION_API = 'https://api.bestbuyersview.com/api';

async function checkAPI() {
  console.log('\n🔍 Checking Production API...\n');

  // Check products endpoint
  console.log('1. Checking products endpoint...');
  console.log(`   URL: ${PRODUCTION_API}/products\n`);

  https.get(`${PRODUCTION_API}/products`, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const products = json.data?.products || [];

        console.log('✅ API Response:');
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Products found: ${products.length}`);

        if (products.length === 0) {
          console.log('\n❌ NO PRODUCTS IN DATABASE!');
          console.log('\n📝 Next Steps:');
          console.log('   1. Add products via dashboard: https://bestbuyersview.com/dashboard/products/create');
          console.log('   2. Or import products via API');
          console.log('   3. Rebuild and redeploy your site');
          console.log('   4. Sitemap will automatically include all products!\n');
        } else {
          console.log('\n✅ Products found! Showing first 3:');
          products.slice(0, 3).forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.title} (${p._id})`);
            console.log(`      Category: ${p.mainCategory?.name} > ${p.subCategory?.name}`);
          });

          console.log('\n⚠️ If sitemap is empty but products exist:');
          console.log('   1. Check NEXT_PUBLIC_API_URL in production env vars');
          console.log('   2. Redeploy to rebuild sitemap');
          console.log('   3. Wait for ISR revalidation (1 hour)\n');
        }
      } catch (error) {
        console.error('❌ Error parsing JSON:', error.message);
        console.log('Raw response:', data.substring(0, 500));
      }
    });
  }).on('error', (error) => {
    console.error('❌ Network Error:', error.message);
    console.log('\nPossible issues:');
    console.log('   - API server is down');
    console.log('   - Wrong API URL');
    console.log('   - CORS/Network issue\n');
  });

  // Also check blog endpoint
  console.log('2. Checking blog endpoint...');
  console.log(`   URL: ${PRODUCTION_API}/blog\n`);

  https.get(`${PRODUCTION_API}/blog`, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const blogs = json.data || [];

        console.log('✅ Blog API Response:');
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Blog posts found: ${blogs.length}\n`);
      } catch (error) {
        console.error('❌ Error parsing blog JSON:', error.message);
      }
    });
  }).on('error', (error) => {
    console.error('❌ Blog endpoint error:', error.message);
  });
}

checkAPI();
