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

const VAT_RATE = 0.23; // 23%
const OLX_MARKUP = 0.08; // +8%

type PriceUpdate = {
  slug: string;
  priceNet: number;
};

// Provided net prices (zł)
const INPUT: PriceUpdate[] = [
  { slug: 'zrywak-korzeni-1-2t', priceNet: 900 },
  { slug: 'zrywak-pojedynczy-2-4t', priceNet: 1400 },
  { slug: 'zrywak-pojedynczy-4-8t', priceNet: 1800 },
  { slug: 'zrywak-podwojny-2-4t', priceNet: 1760 },
  { slug: 'zrywak-podwojny-4-8t', priceNet: 2200 },
  { slug: 'grabie-100cm-15mm', priceNet: 1780 },
  { slug: 'grabie-120cm-12mm', priceNet: 1700 },
  { slug: 'grabie-120cm-15mm', priceNet: 1940 },
];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

async function updateOne(slug: string, priceNet: number) {
  const docs: Array<{ _id: string; name?: string; slug?: { current?: string } | string }> = await client.fetch(
    `*[_type=='product' && slug.current==$slug][0]{ _id, name, slug }`,
    { slug }
  );

  const doc = docs as unknown as { _id: string; name?: string } | null;
  if (!doc || !(doc as any)._id) {
    // eslint-disable-next-line no-console
    console.warn(`! Not found: ${slug}`);
    return { updated: false };
  }

  const priceGross = round2(priceNet * (1 + VAT_RATE));
  const priceOlx = Math.ceil(priceNet * (1 + OLX_MARKUP));

  await client.patch((doc as any)._id).set({ priceNet, priceGross, priceOlx }).commit();
  // eslint-disable-next-line no-console
  console.log(`✓ ${slug} (${(doc as any).name || ''}) → net: ${priceNet} | gross: ${priceGross} | olx: ${priceOlx}`);
  return { updated: true };
}

async function run() {
  let ok = 0;
  for (const item of INPUT) {
    const res = await updateOne(item.slug, item.priceNet);
    if ((res as any).updated) ok += 1;
  }
  // eslint-disable-next-line no-console
  console.log(`Done. Updated ${ok}/${INPUT.length} products.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


