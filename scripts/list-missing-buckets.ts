import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

dotenv.config({ path: '.env.local' });

type TierKey = '1-1.5t' | '1.5-2.3t' | '2.3-3t' | '3-5t';
type DiggingItem = { widthCm: number };
type SkarpowaItem = { widthCm: number; hydraulic?: boolean };
type Matrix = Record<TierKey, { digging: DiggingItem[]; skarpowa: SkarpowaItem[] }>;

const MATRIX: Matrix = {
  '1-1.5t': {
    digging: [18,20,23,25,27,30,40,45,50,60,70].map((w) => ({ widthCm: w })),
    skarpowa: [80,90,100].map((w) => ({ widthCm: w })),
  },
  '1.5-2.3t': {
    digging: [25,30,40,45,50,60].map((w) => ({ widthCm: w })),
    skarpowa: [{ widthCm: 120 }, { widthCm: 130 }, { widthCm: 120, hydraulic: true }],
  },
  '2.3-3t': {
    digging: [25,30,40,45,50,60,80].map((w) => ({ widthCm: w })),
    skarpowa: [{ widthCm: 120 }, { widthCm: 130 }, { widthCm: 120, hydraulic: true }],
  },
  '3-5t': {
    digging: [25,30,35,40,45,50,60,70,80,90,100].map((w) => ({ widthCm: w })),
    skarpowa: [{ widthCm: 120 }, { widthCm: 150 }],
  },
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});

function detectTypeFromSubcategoryOrName(subcategory?: string, name?: string): 'kopiaca' | 'skarpowa' | 'skarpowa-hydr' | undefined {
  if (subcategory === 'lyzki-kopiace') return 'kopiaca';
  if (subcategory === 'lyzki-skarpowe') return 'skarpowa';
  const lower = String(name || '').toLowerCase();
  if (lower.includes('skarpo') && lower.includes('hydr')) return 'skarpowa-hydr';
  if (lower.includes('skarpo')) return 'skarpowa';
  if (lower.includes('kopi')) return 'kopiaca';
  return undefined;
}

function parseWidth(name: string, specsWidth?: number): number | undefined {
  if (typeof specsWidth === 'number') return specsWidth;
  const m = name.match(/(\d{2,3})\s*cm/i);
  return m ? Number(m[1]) : undefined;
}

function tierFromPriceTierOrName(priceTier?: string, name?: string): TierKey | undefined {
  const t = String(priceTier || '').trim();
  const lower = String(name || '').toLowerCase();
  if (t === '1-1.5t' || /(1\s*[-–]\s*1[\-\.,]?5\s*t|1-1\.5t|1-2t)/.test(lower)) return '1-1.5t';
  if (t === '1.5-2.3t' || /(1[\-\.,]?5\s*[-–]\s*2\.3t|1\.5-2\.3t)/.test(lower)) return '1.5-2.3t';
  if (t === '2.3-3t' || /(2\.3\s*[-–]\s*3t|2\.3-3t|2-3t)/.test(lower)) return '2.3-3t';
  if (t === '3-5t' || /(3\s*[-–]\s*5t|3-5t)/.test(lower)) return '3-5t';
  return undefined;
}

async function run() {
  const list: Array<{ _id: string; name: string; priceTier?: string; subcategory?: string; specifications?: any }> = await client.fetch(
    `*[_type=='product' && name match 'Łyżka*']{ _id, name, priceTier, subcategory, specifications }`
  );

  const index = new Map<string, true>();
  for (const p of list) {
    const type = detectTypeFromSubcategoryOrName(p.subcategory, p.name);
    if (!type) continue;
    const width = parseWidth(p.name, p?.specifications?.widthCm);
    const tier = tierFromPriceTierOrName(p.priceTier, p.name);
    if (!width || !tier) continue;
    index.set(`${type}:${tier}:${width}`, true);
  }

  const missing: string[] = [];
  (Object.keys(MATRIX) as TierKey[]).forEach((tier) => {
    const cfg = MATRIX[tier];
    for (const d of cfg.digging) {
      if (!index.has(`kopiaca:${tier}:${d.widthCm}`)) missing.push(`[${tier}] kopiąca ${d.widthCm}cm`);
    }
    for (const s of cfg.skarpowa) {
      const t = s.hydraulic ? 'skarpowa-hydr' : 'skarpowa';
      if (!index.has(`${t}:${tier}:${s.widthCm}`)) missing.push(`[${tier}] ${t.replace('skarpowa','skarpowa') } ${s.widthCm}cm${s.hydraulic ? ' (Hydr)' : ''}`);
    }
  });

  if (missing.length === 0) {
    console.log('All variants present.');
  } else {
    console.log('\nMissing variants:');
    for (const m of missing) console.log('-', m);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });


