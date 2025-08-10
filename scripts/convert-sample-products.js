/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const SOURCE = path.resolve(__dirname, '..', 'sample_products.json');
const OUT_DIR = path.resolve(__dirname, '..', '.sanity-import');
const OUT_FILE = path.join(OUT_DIR, 'products.ndjson');

function parsePrice(text) {
  if (!text) return null;
  // e.g. "1 550 zł" → 1550
  const numeric = String(text).replace(/[^0-9,\.]/g, '').replace(/\s/g, '').replace(',', '.');
  const val = parseFloat(numeric);
  return Number.isFinite(val) ? val : null;
}

function toSlug(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // non-alnum to dash
    .replace(/^-+|-+$/g, '') // trim dashes
    .slice(0, 96);
}

function main() {
  const raw = fs.readFileSync(SOURCE, 'utf-8');
  const json = JSON.parse(raw);
  const products = json.products || [];
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const stream = fs.createWriteStream(OUT_FILE, { flags: 'w' });

  for (const p of products) {
    const doc = {
      _type: 'product',
      name: p.title,
      slug: { _type: 'slug', current: toSlug(p.title) },
      description: p.description || '',
      price: parsePrice(p.price) ?? 0,
      basePrice: parsePrice(p.price) ?? 0,
      discount: 0,
      stock: 5,
      status: 'active',
      dateUpdated: p.date_updated ? new Date(p.date_updated).toISOString() : new Date().toISOString(),
      externalId: String(p.id),
      specifications: {
        features: [],
        machineCompatibility: [],
      },
      images: [],
    };
    stream.write(JSON.stringify(doc) + '\n');
  }

  stream.end();
  console.log(`Wrote ${products.length} docs to ${OUT_FILE}`);
}

main();

