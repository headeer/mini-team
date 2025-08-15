import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure your Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!,
  apiVersion: '2024-01-01',
});

async function checkCategoryCounts() {
  console.log('📊 Checking category product counts...\n');
  
  try {
    // Get categories with product counts (same query as used in the app)
    const categories = await client.fetch(`
      *[_type == 'category'] | order(title asc) {
        _id,
        title,
        "productCount": count(*[_type == "product" && references(^._id)])
      }
    `);
    
    console.log('All Categories:');
    console.log('================');
    categories.forEach((cat: any) => {
      const icon = cat.productCount > 0 ? '✅' : '❌';
      console.log(`${icon} ${cat.title}: ${cat.productCount} products (${cat._id})`);
    });
    
    // Show specifically Grabie categories
    const grabieCategories = categories.filter((cat: any) => cat._id.includes('grabie'));
    console.log('\n🥄 Grabie Categories:');
    console.log('=====================');
    grabieCategories.forEach((cat: any) => {
      const icon = cat.productCount > 0 ? '✅' : '❌';
      console.log(`${icon} ${cat.title}: ${cat.productCount} products`);
    });
    
    // Show categories that will appear in "Popular Categories" (productCount > 0)
    const popularCategories = categories.filter((cat: any) => cat.productCount > 0);
    console.log('\n🔥 Popular Categories (will show on homepage):');
    console.log('===============================================');
    popularCategories.forEach((cat: any) => {
      console.log(`✅ ${cat.title}: ${cat.productCount} products`);
    });
    
    console.log(`\n📈 Total categories with products: ${popularCategories.length}/${categories.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCategoryCounts();
