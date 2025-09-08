import dotenv from 'dotenv';
import { createClient } from 'next-sanity';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20',
  useCdn: false,
});

async function run() {
  const q = `*[_type=='product' && (name match 'Łyżka*20cm*kopi*' || (subcategory=='lyzki-kopiace' && specifications.widthCm==20))]{
    _id,
    name,
    "slug": slug.current,
    priceNet,
    toothCost,
    toothQty,
    priceTier,
    subcategory
  } | order(name asc)`;
  const docs = await client.fetch(q);
  console.log(JSON.stringify(docs, null, 2));
}

run().catch((e) => { console.error(e); process.exit(1); });



