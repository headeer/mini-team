// CommonJS migration script to avoid ESM/ts-node loader issues
// Usage: npm run migrate:categories

const { createClient } = require("@sanity/client");
require("dotenv").config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-05-01",
  useCdn: false,
});

const allowCreate = String(process.env.ALLOW_CREATE || "true").toLowerCase() !== "false";

async function ensureCategory(title) {
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[,–]/g, "-");
  const existing = await client.fetch(`*[_type=='category' && slug.current==$slug][0]{_id,visible}`, { slug });
  if (existing && existing._id) {
    if (existing.visible === false) {
      await client.patch(existing._id).set({ visible: true, title }).commit();
    }
    return existing._id;
  }
  if (!allowCreate) {
    console.warn(`[no-create] Missing category "${title}" (slug: ${slug}). Skipping creation due to ALLOW_CREATE=false.`);
    return null;
  }
  const created = await client.create({ _type: "category", title, slug: { _type: "slug", current: slug }, visible: true });
  return created._id;
}

function detectWeightRange(name) {
  const n = String(name || "").toLowerCase();
  if (/\b1[.,-]?\s*[-–]?\s*2\s*t/.test(n) || /\b1\s*t\b/.test(n)) return "1-2t";
  if (/\b2[.,-]?\s*[-–]?\s*3\s*t/.test(n) || /\b2\s*t\b/.test(n)) return "2-3t";
  if (/\b3[.,-]?\s*[-–]?\s*4(\.5)?\s*t/.test(n) || /\b4\.?5\s*t\b/.test(n)) return "3-4.5t";
  return undefined;
}

function detectSubcategory(name) {
  const n = String(name || "").toLowerCase();
  if (/skarp/.test(n)) return "lyzki-skarpowe";
  if (/łyżk|lyzk|kopi/.test(n)) return "lyzki-kopiace";
  if (/grabie/.test(n)) {
    if (/100.*12/.test(n)) return "grabie-100-12";
    if (/100.*15/.test(n)) return "grabie-100-15";
    if (/120.*12/.test(n)) return "grabie-120-12";
    if (/120.*15/.test(n)) return "grabie-120-15";
  }
  return undefined;
}

const DRY_RUN = String(process.env.DRY_RUN || "false").toLowerCase() === "true";

async function run() {
  const cat12 = await ensureCategory("Łyżki 1–2t");
  const cat23 = await ensureCategory("Łyżki 2–3t");
  const cat345 = await ensureCategory("Łyżki 3–4.5t");

  const oldCats = await client.fetch(`*[_type=='category' && (title match 'Łyżki *kop*' || title match 'Łyżki *skar*')][]{_id}`);
  for (const c of oldCats) {
    if (DRY_RUN) console.log(`[dry-run] Would hide old category ${c._id}`);
    else await client.patch(c._id).set({ visible: false }).commit();
  }

  const grabieId = await ensureCategory("Grabie");

  const products = await client.fetch(`*[_type=='product']{_id,name,slug,categories[]-> { _id, title }, weightRange, subcategory}`);
  for (const p of products) {
    const updates = {};
    const wr = p.weightRange || detectWeightRange(p.name || "");
    const sub = p.subcategory || detectSubcategory(p.name || "");
    if (wr && wr !== p.weightRange) updates.weightRange = wr;
    if (sub && sub !== p.subcategory) updates.subcategory = sub;

    const catRefs = (p.categories || []).map((c) => c && c._id).filter(Boolean);
    let desiredTop;
    if (wr === "1-2t") desiredTop = cat12;
    if (wr === "2-3t") desiredTop = cat23;
    if (wr === "3-4.5t") desiredTop = cat345;

    const isGrabie = /grabie/i.test(String(p.name || ""));
    if (isGrabie) {
      if (grabieId) {
        if (!catRefs.includes(grabieId)) catRefs.push(grabieId);
        const filtered = catRefs.filter((id) => id === grabieId);
        updates.categories = filtered.map((id) => ({ _type: "reference", _ref: id }));
      } else if (!allowCreate) {
        console.warn(`[no-create] Skipping Grabie mapping for ${p._id} – missing Grabie category`);
      }
    } else if (desiredTop) {
      if (!catRefs.includes(desiredTop)) catRefs.push(desiredTop);
      const filtered = catRefs.filter((id) => [cat12, cat23, cat345].includes(id));
      updates.categories = filtered.map((id) => ({ _type: "reference", _ref: id }));
    } else if (!allowCreate) {
      // No detected weight or missing bucket categories in no-create mode
      // Leave categories as-is
    }

    if (Object.keys(updates).length > 0) {
      if (DRY_RUN) console.log(`[dry-run] Would update ${p._id}`, updates);
      else await client.patch(p._id).set(updates).commit();
    }
  }

  console.log("Done updating categories, weight ranges, and subcategories.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


