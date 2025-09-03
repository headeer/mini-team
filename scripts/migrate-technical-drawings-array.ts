import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local (same as other scripts)
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!,
  apiVersion: '2024-01-01',
});

async function migrateLegacyTechnicalDrawings() {
  console.log('🔧 Migrating legacy technicalDrawing → technicalDrawings[] ...\n');

  try {
    const products: Array<{ _id: string; name?: string; technicalDrawing?: { url?: string; title?: string } }> = await client.fetch(
      `*[_type=='product' && defined(technicalDrawing.url) && (!defined(technicalDrawings) || count(technicalDrawings) == 0)]{
        _id,
        name,
        technicalDrawing
      } | order(name asc)`
    );

    console.log(`Found ${products.length} products to update.\n`);

    let success = 0;
    let skipped = 0;

    for (const p of products) {
      const url = p?.technicalDrawing?.url;
      if (!url) { skipped++; continue; }
      const title = p?.technicalDrawing?.title || `Rysunek techniczny - ${p?.name || ''}`.trim();

      try {
        await client.patch(p._id)
          .set({
            technicalDrawings: [
              {
                _type: 'object',
                title,
                externalUrl: url,
              }
            ]
          })
          .commit();
        success++;
        console.log(`✅ ${p.name || p._id}`);
      } catch (e) {
        console.log(`❌ ${p.name || p._id}: ${(e as Error)?.message}`);
      }
    }

    console.log(`\n🎉 Migration complete. Updated: ${success}, skipped: ${skipped}`);

    // Verification
    const remaining: number = await client.fetch(
      `count(*[_type=='product' && defined(technicalDrawing.url) && (!defined(technicalDrawings) || count(technicalDrawings) == 0)])`
    );
    console.log(`\n🔎 Remaining products still needing migration: ${remaining}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exitCode = 1;
  }
}

migrateLegacyTechnicalDrawings();


