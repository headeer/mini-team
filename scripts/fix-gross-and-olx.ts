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

const VAT = 0.23;
const OLX_MARKUP = 0.08; // 8% higher than site net price

function round2(n: number) { return Math.round(n * 100) / 100; }

async function run() {
  const products: Array<{ _id: string; name?: string; priceNet?: number; priceGross?: number; priceOlx?: number | string }>= await client.fetch(
    `*[_type=='product' && defined(priceNet)]{ _id, name, priceNet, priceGross, priceOlx }`
  );
  let fixedGross = 0;
  let fixedOlx = 0;

  for (const p of products) {
    const net = typeof p.priceNet === 'number' ? p.priceNet : undefined;
    if (typeof net !== 'number') continue;
    const expectedGross = round2(net * (1 + VAT));
    const currGross = typeof p.priceGross === 'number' ? p.priceGross : undefined;
    const currOlxNum = typeof p.priceOlx === 'number' ? p.priceOlx : undefined;
    const targetOlx = Math.ceil(net * (1 + OLX_MARKUP)); // integer PLN, strictly > net

    const set: Record<string, unknown> = {};
    if (currGross !== expectedGross) {
      set.priceGross = expectedGross;
      fixedGross += 1;
    }
    if (typeof currOlxNum !== 'number' || currOlxNum <= net) {
      set.priceOlx = targetOlx;
      fixedOlx += 1;
    }

    if (Object.keys(set).length) {
      await client.patch(p._id).set(set).commit();
      // eslint-disable-next-line no-console
      console.log(`✓ ${p.name} →`, set);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Done. Updated priceGross on ${fixedGross}, priceOlx on ${fixedOlx}.`);
}

run().catch((e) => { console.error(e); process.exit(1); });



