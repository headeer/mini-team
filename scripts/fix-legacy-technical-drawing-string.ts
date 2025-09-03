import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!,
  apiVersion: '2024-01-01',
});

async function run() {
  console.log('🔧 Fixing legacy technicalDrawing string → object & technicalDrawings[]\n');
  try {
    // Focus explicitly on docs where legacy field is likely a string
    const products: Array<{ _id: string; name?: string; technicalDrawing?: any; technicalDrawings?: any[] }> = await client.fetch(
      `*[_type=='product' && defined(technicalDrawing)]{ _id, name, technicalDrawing, technicalDrawings } | order(name asc)`,
      {},
      { perspective: 'raw' }
    );

    let fixed = 0;
    let skipped = 0;

    for (const p of products) {
      const td = (p as any).technicalDrawing;
      if (typeof td === 'string' && td.trim().length > 0) {
        const url = td.trim();
        const title = `Rysunek techniczny - ${p?.name || ''}`.trim();
        const newLegacyObj = {
          _type: 'object',
          url,
          title,
          type: 'pdf',
        };
        const nextArray = Array.isArray(p.technicalDrawings) ? [...p.technicalDrawings] : [];
        // Push into new array only if not present already
        const exists = nextArray.some((x: any) => x?.externalUrl === url || x?.file?.asset?._ref || x?.image?.asset?._ref);
        if (!exists) {
          nextArray.push({ _type: 'object', title, externalUrl: url });
        }
        try {
          const idsToPatch = new Set<string>([p._id]);
          // Also patch sibling published/draft counterpart
          const baseId = p._id.replace(/^drafts\./, '');
          idsToPatch.add(baseId);
          idsToPatch.add(`drafts.${baseId}`);

          for (const id of idsToPatch) {
            try {
              await client.patch(id)
                .set({ technicalDrawing: newLegacyObj, technicalDrawings: nextArray })
                .commit();
            } catch (e) {
              // ignore missing sibling docs
            }
          }
          console.log(`✅ Fixed: ${p?.name || p._id}`);
          fixed++;
        } catch (e) {
          console.log(`❌ Patch failed for ${p?.name || p._id}: ${(e as Error)?.message}`);
        }
      } else {
        // Not a string; if it's an object already but Studio still complains, ensure field is correctly shaped
        if (td && typeof td === 'object' && !('url' in td) && typeof (td as any) === 'object') {
          // Unset broken field to remove Studio warning
          const baseId = p._id.replace(/^drafts\./, '');
          const ids = [p._id, baseId, `drafts.${baseId}`];
          for (const id of ids) {
            try {
              await client.patch(id).unset(['technicalDrawing']).commit();
            } catch {}
          }
        } else {
          skipped++;
        }
      }
    }

    console.log(`\n🎉 Done. Fixed: ${fixed}, skipped: ${skipped}`);

    const remaining: Array<{_id: string; name?: string; technicalDrawing?: any}> = await client.fetch(
      `*[_type=='product' && technicalDrawing != null && !defined(technicalDrawing.url)]{_id,name,technicalDrawing}`
    );
    console.log(`\n🔎 Remaining legacy string-like technicalDrawing fields: ${remaining.length}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exitCode = 1;
  }
}

run();


