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

// Mapping of product slugs to their technical drawings
const technicalDrawingMap = {
  'grabie-120cm-standard': '/images/techniczne/grabie_120cm_12mm.pdf',
  'grabie-100cm-12mm': '/images/techniczne/grabie_100cm_grubosc_zeba_12mm.pdf',
  'grabie-100cm-15mm': '/images/techniczne/grabie_100cm_grubosc_zeba_15mm.pdf',
  'grabie-120cm-12mm': '/images/techniczne/grabie_120cm_12mm.pdf',
  'grabie-120cm-15mm': '/images/techniczne/grabie_120cm_15mm.pdf',
};

async function updateGrabieTechnicalDrawings() {
  console.log('🔧 Updating Grabie products with technical drawings in Sanity...\n');
  
  try {
    for (const [slug, drawingUrl] of Object.entries(technicalDrawingMap)) {
      console.log(`📄 Updating product: ${slug}`);
      console.log(`   → Adding technical drawing: ${drawingUrl}`);
      
      // Find the product by slug
      const product = await client.fetch(
        '*[_type == "product" && slug.current == $slug][0]',
        { slug }
      );
      
      if (product) {
        // Update the product with technical drawing and new array-based field for migration
        const result = await client
          .patch(product._id)
          .set({
            technicalDrawing: {
              url: drawingUrl,
              title: `Rysunek techniczny - ${product.name}`,
              type: 'pdf'
            },
            technicalDrawings: [
              {
                _type: 'object',
                title: `Rysunek techniczny - ${product.name}`,
                externalUrl: drawingUrl
              }
            ],
            'specifications.technicalDrawing': drawingUrl
          })
          .commit();
        
        console.log(`   ✅ Updated ${product.name} (${result._id})\n`);
      } else {
        console.log(`   ❌ Product not found: ${slug}\n`);
      }
    }
    
    console.log('🎉 All Grabie products updated with technical drawings!');
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const grabieProducts = await client.fetch(`
      *[_type == "product" && slug.current match "grabie*"]{
        _id,
        name,
        "slug": slug.current,
        technicalDrawing,
        technicalDrawings,
        "hasTechnicalDrawing": defined(technicalDrawing.url) || count(technicalDrawings) > 0
      } | order(name)
    `);
    
    grabieProducts.forEach((product: any) => {
      const icon = product.hasTechnicalDrawing ? '✅' : '❌';
      console.log(`${icon} ${product.name} (${product.slug})`);
      if (product.technicalDrawing?.url) {
        console.log(`   📄 ${product.technicalDrawing.url}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateGrabieTechnicalDrawings();
