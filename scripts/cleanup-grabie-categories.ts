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

async function cleanupGrabieCategories() {
  console.log('🧹 Starting Grabie categories cleanup...');
  
  try {
    // 1. Delete the general "Grabie" category
    console.log('🗑️ Removing general "Grabie" category...');
    const deleteResult = await client.delete('category-grabie');
    console.log('✅ Deleted general Grabie category:', deleteResult._id);
    
    // 2. List remaining Grabie categories
    console.log('\n📋 Remaining Grabie categories:');
    const remainingCategories = await client.fetch('*[_type == "category" && _id match "category-grabie*"]{_id, title} | order(title)');
    
    remainingCategories.forEach((cat: any) => {
      console.log(`   • ${cat.title} (${cat._id})`);
    });
    
    console.log('\n✅ Cleanup completed successfully!');
    console.log('\n📝 Now you should update your product categories:');
    console.log('   • "Grabie 120cm (Standard)" → category-grabie-120cm-12mm');
    console.log('   • "Grabie 120cm grubość zęba 12mm" → category-grabie-120cm-12mm');
    console.log('   • "Grabie 120cm grubość zęba 15mm" → category-grabie-120cm-15mm');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupGrabieCategories();
