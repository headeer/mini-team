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

async function checkGrabieProducts() {
  console.log('🔍 Checking all Grabie products in Sanity...\n');
  
  try {
    // Get all Grabie products
    const grabieProducts = await client.fetch(`
      *[_type == "product" && name match "*rabie*"]{
        _id,
        name,
        "slug": slug.current,
        images,
        technicalDrawing,
        "hasTechnicalDrawing": defined(technicalDrawing.url)
      } | order(name)
    `);
    
    console.log(`Found ${grabieProducts.length} Grabie products:\n`);
    
    grabieProducts.forEach((product: any) => {
      console.log(`📦 ${product.name} (${product.slug})`);
      console.log(`   ID: ${product._id}`);
      
      // Check images
      if (product.images && product.images.length > 0) {
        const imageUrl = product.images[0]?.url || (product.images[0]?.asset ? '[Sanity Asset]' : '[No URL]');
        console.log(`   📸 Image: ${imageUrl}`);
        
        // Check if it's an external image
        if (imageUrl.includes('http://') && !imageUrl.includes('/images/')) {
          console.log(`   ⚠️  EXTERNAL IMAGE DETECTED!`);
        }
      } else {
        console.log(`   ❌ No images found`);
      }
      
      // Check technical drawing
      if (product.hasTechnicalDrawing) {
        console.log(`   📄 Technical Drawing: ${product.technicalDrawing?.url}`);
      } else {
        console.log(`   ❌ No technical drawing`);
      }
      
      console.log('');
    });
    
    // Check for products that might need fixing
    const problematicProducts = grabieProducts.filter((product: any) => {
      const hasExternalImage = product.images?.[0]?.url?.includes('http://') && !product.images[0].url.includes('/images/');
      const hasNoTechnicalDrawing = !product.hasTechnicalDrawing;
      return hasExternalImage || hasNoTechnicalDrawing;
    });
    
    if (problematicProducts.length > 0) {
      console.log('⚠️  Products that need fixing:');
      problematicProducts.forEach((product: any) => {
        console.log(`   - ${product.name} (${product._id})`);
      });
    } else {
      console.log('✅ All Grabie products look good!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkGrabieProducts();
