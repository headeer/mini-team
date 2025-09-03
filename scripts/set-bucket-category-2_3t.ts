import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!,
  apiVersion: '2024-01-01',
});

const TARGET_TITLE = 'Łyżki kat. 2.3-3 Tony';
const TARGET_SLUG = 'lyzki-2.3-3t';
const OLD_SLUGS = ['lyzki-2-3t', 'łyżki-2-3t'];

const PRODUCT_NAMES = [
  'Łyżka kopiąca 120cm (2-3t)',
  'Łyżka kopiąca 130cm (2-3t)',
  'Łyżka kopiąca 25cm (2-3t)',
  'Łyżka kopiąca 30cm (2-3t)',
  'Łyżka kopiąca 35cm (2-3t)',
  'Łyżka kopiąca 40cm (2-3t)',
  'Łyżka kopiąca 45cm (2-3t)',
  'Łyżka kopiąca 50cm (2-3t)',
  'Łyżka kopiąca 60cm (2-3t)',
  'Łyżka kopiąca 80cm (2-3t)'
];

async function ensureCategory() {
  const existing = await client.fetch(`*[_type=='category' && slug.current==$slug][0]{_id}`, { slug: TARGET_SLUG });
  if (existing?._id) return existing._id as string;
  const created = await client.create({ _type: 'category', title: TARGET_TITLE, slug: { _type: 'slug', current: TARGET_SLUG }, visible: true });
  console.log(`✅ Created category ${TARGET_TITLE}`);
  return created._id as string;
}

async function run() {
  console.log('🔧 Setting category to', TARGET_TITLE);
  const targetCatId = await ensureCategory();

  // Find products by name
  const products: any[] = await client.fetch(`*[_type=='product' && name in $names]{ _id, name, categories[]->{_id, title, "slug": slug.current} }`, { names: PRODUCT_NAMES });
  console.log(`Found ${products.length} products.`);

  const oldCatIds: string[] = await client.fetch(`*[_type=='category' && slug.current in $slugs][]._id`, { slugs: OLD_SLUGS });

  for (const p of products) {
    const existingCatIds: string[] = (p.categories || []).map((c: any) => c?._id).filter(Boolean);
    const filtered = existingCatIds.filter((id) => !oldCatIds.includes(id));
    if (!filtered.includes(targetCatId)) filtered.push(targetCatId);
    await client.patch(p._id).set({ categories: filtered.map((id) => ({ _type: 'reference', _ref: id })) }).commit();
    console.log(`✅ ${p.name} → ${TARGET_TITLE}`);
  }

  console.log('🎉 Done');
}

run().catch((e) => { console.error('❌ Error:', e); process.exit(1); });


