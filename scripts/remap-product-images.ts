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

function isSkarpowa(name: string): boolean { return /skarpo/i.test(name); }

function imagePath(name: string): string | null {
  const w = parseWidth(name);
  if (!w) return null;
  if (isSkarpowa(name)) {
    if (w === 80) return '/images/lyzki/lyzka_skaropowa_80cm.jpg';
    if (w === 90) return '/images/lyzki/lyzka_skaropowa_90cm.jpg';
    if (w === 100) return '/images/lyzki/lyzka_skarpowa_70cm.jpg'; // closest available
    if (w === 120) return '/images/lyzki/lyzka_skarpowa_70cm.jpg';
    if (w === 130) return '/images/lyzki/lyzka_skarpowa_70cm.jpg';
    if (w === 150) return '/images/lyzki/lyzka_skarpowa_70cm.jpg';
    return '/images/lyzki/lyzka_skarpowa_70cm.jpg';
  }
  // kopiące
  const map: Record<number, string> = {
    18: '/images/lyzki/lyzka_18cm.jpg',
    20: '/images/lyzki/lyzka_20cm.jpg',
    23: '/images/lyzki/lyzka_23cm.jpg',
    25: '/images/lyzki/lyzka_25cm.png',
    27: '/images/lyzki/lyzka_27cm.jpg',
    30: '/images/lyzki/lyzka_30cm.png',
    40: '/images/lyzki/lyzka_40cm.png',
    45: '/images/lyzki/lyzka_45cm.png',
    50: '/images/lyzki/lyzka_50cm.png',
    60: '/images/lyzki/lyzka_60cm.png',
    80: '/images/lyzki/lyzka_80cm.png',
    90: '/images/lyzki/lyzka_90cm.png',
    100: '/images/lyzki/lyzka_100cm.png',
  };
  return map[w] || null;
}

async function run() {
  const prods: Array<{ _id: string; name: string }> = await client.fetch(`*[_type=='product' && name match 'Łyżka *cm*']{ _id, name }`);
  let updated = 0;
  for (const p of prods) {
    const url = imagePath(p.name);
    if (!url) continue;
    // Replace images with a single external image
    await client.patch(p._id).set({ images: [{ _type: 'externalImage', _key: 'main', url }] }).commit();
    updated += 1;
    // eslint-disable-next-line no-console
    console.log(`✓ ${p.name} → ${url}`);
  }
  // eslint-disable-next-line no-console
  console.log(`Done. Remapped images on ${updated} products.`);
}

run().catch((e) => { console.error(e); process.exit(1); });


