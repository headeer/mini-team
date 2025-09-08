import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

function parseWidth(name: string): number | undefined {
  const m = name.match(/(\d{2,3})\s*cm/i);
  return m ? Number(m[1]) : undefined;
}

function buildName(old: string, newWidth: number): string {
  return old.replace(/(\d{2,3})\s*cm/i, `${newWidth}cm`);
}

async function run() {
  const list: Array<{ _id: string; name: string; slug?: { current?: string }; subcategory?: string; priceTier?: string; specifications?: any }> = await client.fetch(
    `*[_type=='product' && defined(specifications.widthCm) && name match 'Łyżka*cm*']{ _id, name, slug, subcategory, priceTier, specifications }`
  );
  let fixed = 0;
  for (const p of list) {
    const specW = Number(p?.specifications?.widthCm);
    if (!specW) continue;
    const nameW = parseWidth(p.name || '');
    if (nameW && nameW !== specW) {
      const nextName = buildName(p.name, specW);
      // Rebuild slug consistently
      const typeToken = p.subcategory === 'lyzki-kopiace' ? 'kopiaca' : 'skarpowa';
      const tier = (p.priceTier || '').trim();
      const nextSlug = (typeToken === 'kopiaca'
        ? `lyzka-kopiaca-${specW}cm-${tier}`
        : `lyzka-skarpowa-${specW}cm-${tier}`)
        .toLowerCase();
      await client.patch(p._id).set({ name: nextName, slug: { _type: 'slug', current: nextSlug } }).commit();
      fixed += 1;
      // eslint-disable-next-line no-console
      console.log(`✓ Renamed ${p.name} → ${nextName}`);
    }
  }
  // eslint-disable-next-line no-console
  console.log(`Done. Renamed ${fixed} products to match specifications.widthCm.`);
}

run().catch((e) => { console.error(e); process.exit(1); });



