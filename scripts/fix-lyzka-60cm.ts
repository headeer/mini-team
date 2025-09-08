import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

dotenv.config({ path: '.env.local' });

type TierKey = '1-1.5t' | '1.5-2.3t' | '2.3-3t' | '3-5t';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

function detectTierFromName(name: string): TierKey | undefined {
  const lower = name.toLowerCase();
  if (/(1\s*[-–]\s*2\s*t|1-2t|1-1\.5t)/.test(lower)) return '1-1.5t';
  if (/(1[\-\.,]?5\s*[-–]\s*2\.3\s*t|1\.5-2\.3t)/.test(lower)) return '1.5-2.3t';
  if (/(2\s*[-–]\s*3\s*t|2-3t|2\.3-3t)/.test(lower)) return '2.3-3t';
  if (/(3\s*[-–]\s*5\s*t|3-5t)/.test(lower)) return '3-5t';
  return undefined;
}

async function ensureCategoryId(tier: TierKey): Promise<string | undefined> {
  const slugByTier: Record<TierKey, string> = {
    '1-1.5t': 'lyzki-1-1.5t',
    '1.5-2.3t': 'lyzki-1.5-2.3t',
    '2.3-3t': 'lyzki-2.3-3t',
    '3-5t': 'lyzki-3-5t',
  };
  return client.fetch(`*[_type=='category' && slug.current==$s][0]._id`, { s: slugByTier[tier] });
}

async function ensureBrandId(): Promise<string | undefined> {
  return client.fetch(`*[_type=='brand' && (title match 'MiniTeamProject' || slug.current match 'mtt' || slug.current match 'miniteam*')][0]._id`);
}

async function run() {
  const list: any[] = await client.fetch(`*[_type=='product' && name match 'Łyżka*60cm*kopi*']{ _id,name,slug,priceNet,toothCost,toothQty,priceTier,subcategory,specifications } | order(name asc)`);
  const byTier: Record<string, any> = {};
  for (const p of list) {
    const t = (p.priceTier as TierKey) || detectTierFromName(p.name || '');
    if (t) byTier[t] = p;
  }

  // Desired values per tier
  const desired: Record<TierKey, { priceNet: number; toothCost: number; toothQty: number; name: string } | undefined> = {
    '1-1.5t': { priceNet: 900, toothCost: 240, toothQty: 5, name: 'Łyżka kopiąca 60cm (1-2t)' },
    '1.5-2.3t': { priceNet: 1200, toothCost: 240, toothQty: 5, name: 'Łyżka kopiąca 60cm (1,5-2.3t)' },
    '2.3-3t': { priceNet: 1300, toothCost: 240, toothQty: 5, name: 'Łyżka kopiąca 60cm (2-3t)' },
    '3-5t': { priceNet: 1920, toothCost: 200, toothQty: 4, name: 'Łyżka kopiąca 60cm (3-5t)' },
  };

  // Update existing
  for (const tier of ['1-1.5t','1.5-2.3t','2.3-3t'] as TierKey[]) {
    const p = byTier[tier];
    const d = desired[tier]!;
    if (!p) continue;
    await client.patch(p._id).set({
      priceNet: d.priceNet,
      toothCost: d.toothCost,
      toothQty: d.toothQty,
      priceTier: tier,
      subcategory: 'lyzki-kopiace',
      specifications: { ...(p.specifications || {}), widthCm: 60 },
    }).commit();
    console.log(`✅ Updated ${d.name}`);
  }

  // Create missing 3-5t if absent
  if (!byTier['3-5t']) {
    const tier: TierKey = '3-5t';
    const d = desired[tier]!;
    const catId = await ensureCategoryId(tier);
    const brandId = await ensureBrandId();
    const slug = 'lyzka-kopiaca-60cm-3-5t';
    await client.createIfNotExists({
      _type: 'product',
      _id: `product-${slug}`,
      name: d.name,
      slug: { _type: 'slug', current: slug },
      description: 'Łyżka kopiąca 60cm do maszyn 3–5 t. Lemiesz tnący 110×16mm Hardox HB500. Opcjonalnie: zęby, spód Hardox HB500.',
      priceNet: d.priceNet,
      priceTier: tier,
      toothCost: d.toothCost,
      toothQty: d.toothQty,
      teethEnabled: true,
      subcategory: 'lyzki-kopiace',
      specifications: { widthCm: 60 },
      brand: brandId ? { _type: 'reference', _ref: brandId } : undefined,
      categories: catId ? [{ _type: 'reference', _ref: catId }] : undefined,
      status: 'hot',
      stock: 0,
      dateUpdated: new Date().toISOString(),
    });
    console.log(`➕ Created ${d.name}`);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });



