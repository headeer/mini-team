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
  const ids: string[] = await client.fetch(`*[_type=='product' && (defined(discount) == false || discount != 0)]._id`);
  let updated = 0;
  for (const id of ids) {
    await client.patch(id).set({ discount: 0 }).commit();
    updated += 1;
  }
  // eslint-disable-next-line no-console
  console.log(`Set discount=0 on ${updated} products.`);
}

run().catch((e) => { console.error(e); process.exit(1); });


