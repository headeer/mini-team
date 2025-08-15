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

async function fixGrabieProductCategory() {
  console.log('🔧 Fixing Grabie product category references...');
  
  try {
    // 1. Find the product that's still referencing the general category
    console.log('🔍 Finding products with general Grabie category...');
    const productsWithGrabieCategory = await client.fetch(`
      *[_type == "product" && references("category-grabie")]{
        _id,
        name,
        slug,
        categories[]->{_id, title}
      }
    `);
    
    console.log('Found products:', productsWithGrabieCategory);
    
    // 2. Update each product to use the specific category
    for (const product of productsWithGrabieCategory) {
      console.log(`\n📝 Updating product: ${product.name}`);
      
      // Determine the correct category based on the product name/description
      let newCategoryId = 'category-grabie-120cm-12mm'; // Default for 120cm with 12mm
      
      if (product.name.includes('15mm')) {
        newCategoryId = 'category-grabie-120cm-15mm';
      } else if (product.name.includes('100cm') && product.name.includes('15mm')) {
        newCategoryId = 'category-grabie-100cm-15mm';
      } else if (product.name.includes('100cm') && product.name.includes('12mm')) {
        newCategoryId = 'category-grabie-100cm-12mm';
      }
      
      console.log(`   → Changing to category: ${newCategoryId}`);
      
      // Update the product's category
      await client
        .patch(product._id)
        .set({
          categories: [{ _type: 'reference', _ref: newCategoryId }]
        })
        .commit();
      
      console.log(`   ✅ Updated ${product.name}`);
    }
    
    // 3. Now try to delete the general Grabie category
    console.log('\n🗑️ Attempting to delete general Grabie category...');
    const deleteResult = await client.delete('category-grabie');
    console.log('✅ Successfully deleted general Grabie category!');
    
    // 4. List remaining categories
    console.log('\n📋 Remaining Grabie categories:');
    const remainingCategories = await client.fetch('*[_type == "category" && _id match "category-grabie*"]{_id, title} | order(title)');
    
    remainingCategories.forEach((cat: any) => {
      console.log(`   • ${cat.title} (${cat._id})`);
    });
    
    console.log('\n🎉 All done! General Grabie category removed and products updated!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixGrabieProductCategory();
