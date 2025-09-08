import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

dotenv.config({ path: '.env.local' });

type TierKey = '1-1.5t' | '1.5-2.3t' | '2.3-3t' | '3-5t';

type DiggingItem = { widthCm: number; priceNet: number; toothCost: number; toothQty: number };
type SkarpowaItem = { widthCm: number; priceNet: number; hydraulic?: boolean };
type Matrix = Record<TierKey, { digging: DiggingItem[]; skarpowa: SkarpowaItem[] }>;

const MATRIX: Matrix = {
  '1-1.5t': {
    digging: [
      { widthCm: 18, priceNet: 680, toothCost: 120, toothQty: 2 },
      { widthCm: 20, priceNet: 700, toothCost: 120, toothQty: 2 },
      { widthCm: 23, priceNet: 710, toothCost: 120, toothQty: 2 },
      { widthCm: 25, priceNet: 730, toothCost: 120, toothQty: 2 },
      { widthCm: 27, priceNet: 740, toothCost: 120, toothQty: 3 },
      { widthCm: 30, priceNet: 760, toothCost: 160, toothQty: 3 },
      { widthCm: 40, priceNet: 910, toothCost: 160, toothQty: 3 },
      { widthCm: 45, priceNet: 830, toothCost: 200, toothQty: 4 },
      { widthCm: 50, priceNet: 850, toothCost: 200, toothQty: 4 },
      { widthCm: 60, priceNet: 900, toothCost: 240, toothQty: 5 },
      { widthCm: 70, priceNet: 940, toothCost: 240, toothQty: 5 },
    ],
    skarpowa: [
      { widthCm: 80, priceNet: 970 },
      { widthCm: 90, priceNet: 1000 },
      { widthCm: 100, priceNet: 1040 },
    ],
  },
  '1.5-2.3t': {
    digging: [
      { widthCm: 25, priceNet: 960, toothCost: 120, toothQty: 2 },
      { widthCm: 30, priceNet: 980, toothCost: 160, toothQty: 3 },
      { widthCm: 40, priceNet: 1080, toothCost: 160, toothQty: 3 },
      { widthCm: 45, priceNet: 1120, toothCost: 200, toothQty: 4 },
      { widthCm: 50, priceNet: 1160, toothCost: 200, toothQty: 4 },
      { widthCm: 60, priceNet: 1200, toothCost: 240, toothQty: 5 },
    ],
    skarpowa: [
      { widthCm: 120, priceNet: 1550 },
      { widthCm: 130, priceNet: 1680 },
      { widthCm: 120, priceNet: 3200, hydraulic: true },
    ],
  },
  '2.3-3t': {
    digging: [
      { widthCm: 25, priceNet: 1060, toothCost: 120, toothQty: 2 },
      { widthCm: 30, priceNet: 1080, toothCost: 160, toothQty: 3 },
      { widthCm: 40, priceNet: 1090, toothCost: 160, toothQty: 3 },
      { widthCm: 45, priceNet: 1220, toothCost: 200, toothQty: 4 },
      { widthCm: 50, priceNet: 1260, toothCost: 200, toothQty: 4 },
      { widthCm: 60, priceNet: 1300, toothCost: 240, toothQty: 5 },
      { widthCm: 80, priceNet: 1390, toothCost: 270, toothQty: 6 },
    ],
    skarpowa: [
      { widthCm: 120, priceNet: 1550 },
      { widthCm: 130, priceNet: 1680 },
      { widthCm: 120, priceNet: 3200, hydraulic: true },
    ],
  },
  '3-5t': {
    digging: [
      { widthCm: 25, priceNet: 1550, toothCost: 130, toothQty: 2 },
      { widthCm: 30, priceNet: 1590, toothCost: 165, toothQty: 3 },
      { widthCm: 35, priceNet: 1620, toothCost: 165, toothQty: 3 },
      { widthCm: 40, priceNet: 1670, toothCost: 165, toothQty: 3 },
      { widthCm: 45, priceNet: 1730, toothCost: 165, toothQty: 3 },
      { widthCm: 50, priceNet: 1790, toothCost: 200, toothQty: 4 },
      { widthCm: 60, priceNet: 1920, toothCost: 200, toothQty: 4 },
      { widthCm: 70, priceNet: 1980, toothCost: 235, toothQty: 4 },
      { widthCm: 80, priceNet: 2080, toothCost: 235, toothQty: 4 },
      { widthCm: 90, priceNet: 2270, toothCost: 270, toothQty: 5 },
      { widthCm: 100, priceNet: 2400, toothCost: 270, toothQty: 5 },
    ],
    skarpowa: [
      { widthCm: 120, priceNet: 2090 },
      { widthCm: 150, priceNet: 2200 },
    ],
  },
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

function drawingsFor(type: 'kopiaca' | 'skarpowa' | 'skarpowa-hydr', tier: TierKey) {
  const isLargeTier = tier === '2.3-3t' || tier === '3-5t';
  const code = type === 'kopiaca'
    ? (isLargeTier ? 'lyzka_kopiaca_v2' : 'lyzka_kopiaca_v1')
    : (isLargeTier ? 'lyzka_skarpowa_v2' : 'lyzka_skarpowa_v1');
  return [ { title: undefined, code } ];
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

async function productExists(name: string, widthCm: number, tier: TierKey, type: 'kopiaca' | 'skarpowa' | 'skarpowa-hydr') {
  const byExact = await client.fetch(`*[_type=='product' && name==$n][0]{_id}`, { n: name });
  if (byExact?._id) return byExact._id as string;
  const pattern = await client.fetch(`*[_type=='product' && name match $w && name match $t][0]{_id}`, { w: `*${widthCm}cm*`, t: type === 'kopiaca' ? '*kopi*' : '*skarpo*' });
  if (pattern?._id) return pattern._id as string;
  return undefined;
}

async function run() {
  const brandId = await ensureBrandId();
  for (const tier of Object.keys(MATRIX) as TierKey[]) {
    const catId = await ensureCategoryId(tier);
    // Digging
    for (const d of MATRIX[tier].digging) {
      const name = `Łyżka kopiąca ${d.widthCm}cm (${tier.replace('1.5','1,5')})`.replace('(1-1.5t)','(1-2t)');
      const exists = await productExists(name, d.widthCm, tier, 'kopiaca');
      if (!exists) {
        await client.create({
          _type: 'product',
          name,
          slug: { _type: 'slug', current: `lyzka-kopiaca-${d.widthCm}cm-${tier}` },
          description: `Łyżka kopiąca ${d.widthCm}cm do maszyn ${tier.replace('1.5','1,5').replace('t',' t')}. Lemiesz tnący 110×16mm Hardox HB500. Opcjonalnie: zęby, spód Hardox HB500.`,
          priceNet: d.priceNet,
          priceTier: tier,
          toothCost: d.toothCost,
          toothQty: d.toothQty,
          teethEnabled: true,
          subcategory: 'lyzki-kopiace',
          specifications: { widthCm: d.widthCm },
          brand: brandId ? { _type: 'reference', _ref: brandId } : undefined,
          categories: catId ? [{ _type: 'reference', _ref: catId }] : undefined,
          technicalDrawings: drawingsFor('kopiaca', tier),
          status: 'hot',
          stock: 0,
          dateUpdated: new Date().toISOString(),
        });
        // eslint-disable-next-line no-console
        console.log(`➕ Created ${name}`);
      }
    }
    // Skarpowe
    for (const s of MATRIX[tier].skarpowa) {
      const t: 'skarpowa' | 'skarpowa-hydr' = s.hydraulic ? 'skarpowa-hydr' : 'skarpowa';
      const label = t === 'skarpowa-hydr' ? 'Łyżka skarpowa Hydr' : 'Łyżka skarpowa';
      const name = `${label} ${s.widthCm}cm`;
      const exists = await productExists(name, s.widthCm, tier, t);
      if (!exists) {
        await client.create({
          _type: 'product',
          name,
          slug: { _type: 'slug', current: `lyzka-${t}-${s.widthCm}cm-${tier}` },
          description: `${label} ${s.widthCm}cm do maszyn ${tier.replace('1.5','1,5').replace('t',' t')}.`,
          priceNet: s.priceNet,
          priceTier: tier,
          subcategory: 'lyzki-skarpowe',
          specifications: { widthCm: s.widthCm },
          brand: brandId ? { _type: 'reference', _ref: brandId } : undefined,
          categories: catId ? [{ _type: 'reference', _ref: catId }] : undefined,
          technicalDrawings: drawingsFor('skarpowa', tier),
          status: 'hot',
          stock: 0,
          dateUpdated: new Date().toISOString(),
        });
        // eslint-disable-next-line no-console
        console.log(`➕ Created ${name}`);
      }
    }
  }
}

run().catch((e) => { console.error(e); process.exit(1); });



