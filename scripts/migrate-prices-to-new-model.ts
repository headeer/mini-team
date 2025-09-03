import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!,
  apiVersion: '2024-01-01',
});

async function migratePrices() {
  const vat = 0.23; // 23% VAT
  console.log('🔧 Migrating prices to new model (priceNet/priceGross/priceOlx)...\n');

  const products: any[] = await client.fetch(`*[_type=='product']{ _id, name, price, basePrice, priceNet, priceGross, priceOlx } | order(name asc)`);

  let updated = 0;
  for (const p of products) {
    // Determine net
    const existingNet: number | undefined = typeof p.priceNet === 'number' ? p.priceNet : undefined;
    const legacyPrice: number | undefined = typeof p.price === 'number' ? p.price : undefined;
    const legacyBase: number | undefined = typeof p.basePrice === 'number' ? p.basePrice : undefined;
    const net = typeof existingNet === 'number' ? existingNet : (legacyPrice ?? legacyBase);

    // Determine gross
    let gross: number | undefined = typeof p.priceGross === 'number' ? p.priceGross : undefined;
    if (gross == null && typeof net === 'number') gross = Math.round(net * (1 + vat) * 100) / 100;

    // Normalize OLX
    let olx: number | undefined = undefined;
    if (typeof p.priceOlx === 'number') olx = p.priceOlx;
    else if (typeof p.priceOlx === 'string') {
      const n = Number(String(p.priceOlx).replace(/[^0-9.,]/g, '').replace(',', '.'));
      olx = Number.isFinite(n) ? n : undefined;
    }

    const needsUpdate = (existingNet !== net && typeof net === 'number') || (p.priceGross !== gross && typeof gross === 'number') || (p.priceOlx !== olx && typeof olx === 'number');
    if (!needsUpdate) continue;

    await client.patch(p._id)
      .set({
        ...(typeof net === 'number' ? { priceNet: net } : {}),
        ...(typeof gross === 'number' ? { priceGross: gross } : {}),
        ...(typeof olx === 'number' ? { priceOlx: olx } : {}),
      })
      .commit();
    updated++;
    console.log(`✅ ${p.name} – net:${net ?? '-'} gross:${gross ?? '-'} olx:${olx ?? '-'}`);
  }

  console.log(`\n🎉 Migration done. Updated: ${updated}/${products.length}`);
}

migratePrices().catch((e) => { console.error('❌ Error:', e); process.exit(1); });


