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
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});

function parseTierFromName(name: string): TierKey | undefined {
  const lower = name.toLowerCase();
  if (/(1[\-,\.]?5\s*[-–]\s*2\.3\s*t|1\.5-2\.3t)/.test(lower)) return '1.5-2.3t';
  if (/(1\s*[-–]\s*1[\-,\.]?5\s*t|1-1\.5t|1-2\s*t|1-2t)/.test(lower)) return '1-1.5t';
  if (/(2\.3\s*[-–]\s*3\s*t|2\.3-3t|2-3t)/.test(lower)) return '2.3-3t';
  if (/(3\s*[-–]\s*5\s*t|3-5t)/.test(lower)) return '3-5t';
  return undefined;
}

function detectType(name: string): 'kopiaca' | 'skarpowa' | 'skarpowa-hydr' | undefined {
  const lower = name.toLowerCase();
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

function expectedFor(type: 'kopiaca' | 'skarpowa' | 'skarpowa-hydr', tier: TierKey, widthCm: number) {
  const cfg = MATRIX[tier];
  if (!cfg) return undefined;
  if (type === 'kopiaca') return cfg.digging.find(it => it.widthCm === widthCm);
  const sk = cfg.skarpowa.find(it => it.widthCm === widthCm);
  return sk ? { priceNet: sk.priceNet, toothCost: undefined, toothQty: undefined } : undefined;
}

async function run() {
  const list: any[] = await client.fetch(`*[_type=='product' && name match 'Łyżka*']{ _id, name, slug, priceNet, priceGross, basePrice, price, toothCost, toothQty, priceTier, subcategory, specifications, pricing } | order(name asc)`);
  const issues: Array<{ id: string; name: string; field: string; current: any; expected: any }>= [];
  const vat = 0.23;

  for (const p of list) {
    const type = detectType(p.name || '') as any;
    if (!type) continue;
    const width = parseWidth(p.name || '', p?.specifications?.widthCm);
    const tier = (p.priceTier as TierKey) || parseTierFromName(p.name || '');
    if (!width || !tier) continue;
    const exp = expectedFor(type, tier, width);
    if (!exp) continue;
    const currNet: number | undefined = typeof p?.priceNet === 'number' ? p.priceNet : (typeof p?.pricing?.priceNet === 'number' ? p.pricing.priceNet : undefined);
    if (typeof exp.priceNet === 'number' && currNet !== exp.priceNet) {
      issues.push({ id: p._id, name: p.name, field: 'priceNet', current: currNet, expected: exp.priceNet });
    }
    if (type === 'kopiaca') {
      if (typeof exp.toothCost === 'number' && p?.toothCost !== exp.toothCost) {
        issues.push({ id: p._id, name: p.name, field: 'toothCost', current: p?.toothCost, expected: exp.toothCost });
      }
      if (typeof exp.toothQty === 'number' && p?.toothQty !== exp.toothQty) {
        issues.push({ id: p._id, name: p.name, field: 'toothQty', current: p?.toothQty, expected: exp.toothQty });
      }
    }
    const expGross = typeof exp.priceNet === 'number' ? Math.round(exp.priceNet * (1 + vat) * 100) / 100 : undefined;
    const currGross: number | undefined = typeof p?.priceGross === 'number' ? p.priceGross : (typeof p?.pricing?.priceGross === 'number' ? p.pricing.priceGross : undefined);
    if (typeof expGross === 'number' && currGross !== expGross) {
      issues.push({ id: p._id, name: p.name, field: 'priceGross', current: currGross, expected: expGross });
    }
  }

  if (issues.length === 0) {
    console.log('No discrepancies found.');
    return;
  }

  console.log('\nDiscrepancies found (current → expected):');
  for (const i of issues) {
    console.log(`- ${i.name} | ${i.field}: ${i.current} → ${i.expected}`);
  }

  if (String(process.env.FIX || 'false').toLowerCase() === 'true') {
    console.log('\nApplying fixes...');
    for (const i of issues) {
      try {
        await client.patch(i.id).set({ [i.field]: i.expected }).commit();
        console.log(`✓ ${i.name} – ${i.field} fixed`);
      } catch (e) {
        console.log(`! ${i.name} – ${i.field} failed: ${String(e)}`);
      }
    }
  } else {
    console.log('\nDry-run only. To fix, run with: FIX=true ts-node scripts/audit-bucket-pricing.ts');
  }
}

run().catch((e) => { console.error(e); process.exit(1); });


