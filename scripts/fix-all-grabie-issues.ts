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

async function fixAllGrabieIssues() {
  console.log('🔧 Fixing all Grabie product issues...\n');
  
  try {
    // 1. Delete problematic "Grabie 120cm" products (generic ones with external images)
    console.log('🗑️  Deleting problematic "Grabie 120cm" products...');
    
    const problemProducts = ['product-grabie-120cm', 'drafts.product-grabie-120cm'];
    for (const productId of problemProducts) {
      try {
        await client.delete(productId);
        console.log(`   ✅ Deleted ${productId}`);
      } catch (error) {
        console.log(`   ⚠️  Could not delete ${productId}: ${error}`);
      }
    }
    
    // 2. Update all remaining Grabie products with technical drawings
    console.log('\n📄 Adding technical drawings to Grabie products...');
    
    const technicalDrawingMap: Record<string, string> = {
      'grabie-100cm-12mm': '/images/techniczne/grabie_100cm_grubosc_zeba_12mm.pdf',
      'grabie-100cm-15mm': '/images/techniczne/grabie_100cm_grubosc_zeba_15mm.pdf',
      'grabie-120cm-standard': '/images/techniczne/grabie_120cm_12mm.pdf',
      'grabie-120cm-12mm': '/images/techniczne/grabie_120cm_12mm.pdf',
      'grabie-120cm-15mm': '/images/techniczne/grabie_120cm_15mm.pdf',
    };
    
    for (const [slug, pdfUrl] of Object.entries(technicalDrawingMap)) {
      try {
        // Find the product by slug
        const product = await client.fetch(
          '*[_type == "product" && slug.current == $slug][0]',
          { slug }
        );
        
        if (product) {
          await client
            .patch(product._id)
            .set({
              technicalDrawing: {
                url: pdfUrl,
                title: `Rysunek techniczny - ${product.name}`,
                type: 'pdf'
              }
            })
            .commit();
          
          console.log(`   ✅ Added technical drawing to ${product.name}`);
          console.log(`      → ${pdfUrl}`);
        } else {
          console.log(`   ❌ Product not found: ${slug}`);
        }
      } catch (error) {
        console.log(`   ❌ Error updating ${slug}: ${error}`);
      }
    }
    
    // 3. Verify the fixes
    console.log('\n🔍 Verifying fixes...');
    const grabieProducts = await client.fetch(`
      *[_type == "product" && name match "*rabie*"]{
        _id,
        name,
        "slug": slug.current,
        images,
        technicalDrawing,
        "hasTechnicalDrawing": defined(technicalDrawing.url),
        "hasExternalImage": defined(images[0].url) && images[0].url match "http://*" && !(images[0].url match "*/images/*")
      } | order(name)
    `);
    
    console.log(`\nFound ${grabieProducts.length} Grabie products after fixes:`);
    
    grabieProducts.forEach((product: any) => {
      const statusIcon = product.hasTechnicalDrawing && !product.hasExternalImage ? '✅' : '⚠️';
      console.log(`${statusIcon} ${product.name} (${product.slug})`);
      
      if (product.hasExternalImage) {
        console.log(`   ❌ Still has external image`);
      }
      if (!product.hasTechnicalDrawing) {
        console.log(`   ❌ Missing technical drawing`);
      }
      if (product.hasTechnicalDrawing && !product.hasExternalImage) {
        console.log(`   ✅ Has technical drawing and local image`);
      }
    });
    
    console.log('\n🎉 Grabie product fixes completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixAllGrabieIssues();
