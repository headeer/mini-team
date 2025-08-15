// Simple test script to check Sanity connection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  apiVersion: '2024-01-01',
});

console.log('🔍 Testing Sanity connection...');
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('Token starts with:', process.env.SANITY_API_READ_TOKEN ? process.env.SANITY_API_READ_TOKEN.substring(0, 10) + '...' : 'undefined');

// Test read access
client.fetch('*[_type == "category"][0..2]{_id, title}')
  .then(categories => {
    console.log('✅ Read access works!');
    console.log('Found categories:', categories);
    
    // Test write access by trying to create a test category
    console.log('\n🧪 Testing write access...');
    return client.createOrReplace({
      _id: 'category-test-write-permissions',
      _type: 'category',
      title: 'Test Write Permissions',
      slug: {
        _type: 'slug',
        current: 'test-write-permissions'
      },
      description: 'Test category to check write permissions'
    });
  })
  .then(result => {
    console.log('✅ Write access works!');
    console.log('Created test category:', result._id);
    
    // Clean up - delete the test category
    return client.delete('category-test-write-permissions');
  })
  .then(() => {
    console.log('✅ Cleanup successful!');
    console.log('\n🎉 Your token has both read and write permissions!');
    console.log('You can proceed with the category import.');
  })
  .catch(error => {
    if (error.message.includes('write') || error.message.includes('permission')) {
      console.log('❌ Write access failed:', error.message);
      console.log('\n💡 SOLUTION: You need a write token');
      console.log('1. Go to https://sanity.io/manage');
      console.log('2. Select your project');
      console.log('3. Go to API → Tokens');
      console.log('4. Create a new token with Editor/Admin permissions');
      console.log('5. Add it to your .env.local as SANITY_API_WRITE_TOKEN');
    } else {
      console.log('❌ Connection failed:', error.message);
    }
  });
