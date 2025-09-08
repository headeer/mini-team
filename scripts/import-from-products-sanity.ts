import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

dotenv.config({ path: '.env.local' });

type TierKey = '1-1.5t' | '1.5-2.3t' | '2.3-3t' | '3-5t';

interface InputImage { url?: string }
interface InputTech { url?: string; title?: string; type?: string }
interface InputProduct {
  name: string;
  slug: string;
  images?: InputImage[];
  description?: string;
  price: number; // net
  priceOlx?: number;
  basePrice?: number;
  toothCost?: number;
  toothQty?: number;
  priceTier: TierKey;
  discount?: number;
  stock?: number;
  status?: string;
  specifications?: { widthCm?: number; [k: string]: unknown };
  technicalDrawing?: InputTech;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const ROOT = process.cwd();
const INPUT = path.join(ROOT, 'data/products_sanity.json');

function isSkarpowa(name: string): boolean {
  return /skarpo/i.test(name);
}

function catSlugByTier(t: TierKey) {
  return t === '1-1.5t' ? 'lyzki-1-1.5t' : t === '1.5-2.3t' ? 'lyzki-1.5-2.3t' : t === '2.3-3t' ? 'lyzki-2.3-3t' : 'lyzki-3-5t';
}

async function ensureWeightCategoryId(tier: TierKey): Promise<string | undefined> {
  const slug = catSlugByTier(tier);
  return client.fetch(`*[_type=='category' && slug.current==$s][0]._id`, { s: slug });
}

async function ensureBrandId(): Promise<string | undefined> {
  return client.fetch(`*[_type=='brand' && (title match 'MiniTeamProject' || slug.current match 'mtt' || slug.current match 'miniteam*')][0]._id`);
}

function toExternalImages(images?: InputImage[]) {
  return (images || []).filter(Boolean).map((img, idx) => ({ _type: 'externalImage', _key: `${idx}`, url: img?.url }));
}

async function upsert(p: InputProduct, brandId?: string, weightCatId?: string) {
  const exists = await client.fetch(`*[_type=='product' && slug.current==$slug][0]{_id}`, { slug: p.slug });
  const priceNet = p.price;
  const priceGross = Math.round(priceNet * 1.23 * 100) / 100;
  const subcategory = isSkarpowa(p.name) ? 'lyzki-skarpowe' : 'lyzki-kopiace';
  const images = toExternalImages(p.images);
  const setDoc: any = {
    name: p.name,
    slug: { _type: 'slug', current: p.slug },
    images,
    description: p.description ?? '',
    priceNet,
    priceGross,
    priceOlx: p.priceOlx,
    basePrice: p.basePrice ?? p.price,
    toothCost: p.toothCost,
    toothQty: p.toothQty,
    priceTier: p.priceTier,
    discount: 0,
    subcategory,
    categories: weightCatId ? [{ _type: 'reference', _ref: weightCatId }] : undefined,
    stock: typeof p.stock === 'number' ? p.stock : 0,
    brand: brandId ? { _type: 'reference', _ref: brandId } : undefined,
    status: p.status || 'new',
    specifications: { ...(p.specifications || {}), widthCm: p.specifications?.widthCm },
    technicalDrawing: p.technicalDrawing ? { url: p.technicalDrawing.url, title: p.technicalDrawing.title, type: p.technicalDrawing.type || 'png' } : undefined,
    dateUpdated: new Date().toISOString(),
  };
  if (exists?._id) {
    await client.patch(exists._id).set(setDoc).commit();
    // eslint-disable-next-line no-console
    console.log(`✓ Updated ${p.name}`);
  } else {
    await client.create({ _type: 'product', ...setDoc });
    // eslint-disable-next-line no-console
    console.log(`➕ Created ${p.name}`);
  }
}

async function run() {
  const raw = fs.readFileSync(INPUT, 'utf8');
  const arr: InputProduct[] = JSON.parse(raw);
  const brandId = await ensureBrandId();
  const byTierId: Record<TierKey, string | undefined> = {
    '1-1.5t': await ensureWeightCategoryId('1-1.5t'),
    '1.5-2.3t': await ensureWeightCategoryId('1.5-2.3t'),
    '2.3-3t': await ensureWeightCategoryId('2.3-3t'),
    '3-5t': await ensureWeightCategoryId('3-5t'),
  };
  for (const p of arr) {
    try {
      await upsert(p, brandId, byTierId[p.priceTier]);
    } catch (e) {
      console.log(`! Failed ${p.name}: ${String(e)}`);
    }
  }
  console.log('Done.');
}

run().catch((e) => { console.error(e); process.exit(1); });


