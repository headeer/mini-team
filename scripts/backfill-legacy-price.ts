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

async function run() {
  const prods: Array<{ _id: string; name?: string; price?: number | string; basePrice?: number; priceNet?: number }>= await client.fetch(
    `*[_type=='product']{ _id, name, price, basePrice, priceNet }`
  );
  let updated = 0;
  for (const p of prods) {
    const net = typeof p.priceNet === 'number' ? p.priceNet : undefined;
    if (typeof net !== 'number') continue;
    const priceIsText = typeof p.price === 'string';
    const baseOk = typeof p.basePrice === 'number' && isFinite(p.basePrice) && p.basePrice > 0;
    const set: Record<string, unknown> = {};
    if (!priceIsText) set.price = net;
    if (!baseOk) set.basePrice = net;
    if (Object.keys(set).length) {
      await client.patch(p._id).set(set).commit();
      updated += 1;
    }
  }
  // eslint-disable-next-line no-console
  console.log(`Backfilled legacy price/basePrice from priceNet on ${updated} products.`);
}

run().catch((e) => { console.error(e); process.exit(1); });



