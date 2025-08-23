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

function detectWeightRange(nameOrTier) {
  const n = String(nameOrTier || "").toLowerCase();
  if (/\b1\s*-?\s*1\.5\s*t\b/.test(n)) return "1-1.5t";
  if (/\b1\.5\s*-?\s*2\.3\s*t\b/.test(n)) return "1.5-2.3t";
  if (/\b2\.3\s*-?\s*3\s*t\b/.test(n)) return "2.3-3t";
  if (/\b3\s*-?\s*5\s*t\b/.test(n)) return "3-5t";
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
  // New category set
  const catW1 = await ensureCategory("Łyżki kat. 1-1.5 Tony");
  const catW2 = await ensureCategory("Łyżki kat. 1.5-2.3 Tony");
  const catW3 = await ensureCategory("Łyżki kat. 2.3-3 Tony");
  const catW4 = await ensureCategory("Łyżki kat. 3-5 Tony");
  const catKablowe = await ensureCategory("Łyżki kablowe");
  const catPrzesiewowe = await ensureCategory("Łyżki przesiewowe");
  const catSkandynawskie = await ensureCategory("Łyżki skandynawskie");
  const catGrabie = await ensureCategory("Grabie");
  const catRippery = await ensureCategory("Rippery");
  const catWiertnice = await ensureCategory("Wiertnice");
  const catNiwelatory = await ensureCategory("Niwelatory");
  const catSzybkozlacza = await ensureCategory("Szybkozłącza");

  // Hide old buckets/types
  const oldCats = await client.fetch(`*[_type=='category' && (title match 'Łyżki *kop*' || title match 'Łyżki *skar*' || title match 'Łyżki 1–2t' || title match 'Łyżki 2–3t' || title match 'Łyżki 3–4.5t')][]{_id}`);
  for (const c of oldCats) {
    if (DRY_RUN) console.log(`[dry-run] Would hide old category ${c._id}`);
    else await client.patch(c._id).set({ visible: false }).commit();
  }

  const products = await client.fetch(`*[_type=='product']{_id,name,slug,categories[]-> { _id, title }, weightRange, subcategory, priceTier}`);
  for (const p of products) {
    const updates = {};
    const wr = p.weightRange || detectWeightRange(p.name || p.priceTier || "");
    const sub = p.subcategory || detectSubcategory(p.name || "");
    if (wr && wr !== p.weightRange) updates.weightRange = wr;
    if (sub && sub !== p.subcategory) updates.subcategory = sub;

    const nameLower = String(p.name || "").toLowerCase();
    const desiredIds = new Set();

    // Type-based mapping
    if (/grabie/.test(nameLower) && catGrabie) desiredIds.add(catGrabie);
    if (/(zrywak|ripper)/.test(nameLower) && catRippery) desiredIds.add(catRippery);
    if (/wiertnic/.test(nameLower) && catWiertnice) desiredIds.add(catWiertnice);
    if (/niwelator/.test(nameLower) && catNiwelatory) desiredIds.add(catNiwelatory);
    if (/szybkozł\u0105cz|szybkozlacz|szybkoz\u0142\u0105cz/.test(nameLower) && catSzybkozlacza) desiredIds.add(catSzybkozlacza);
    if (/kablow/.test(nameLower) && catKablowe) desiredIds.add(catKablowe);
    if (/przesiew/.test(nameLower) && catPrzesiewowe) desiredIds.add(catPrzesiewowe);
    if (/skandyn/.test(nameLower) && catSkandynawskie) desiredIds.add(catSkandynawskie);

    // Weight buckets
    if (wr) {
      if (wr === "1-1.5t" && catW1) desiredIds.add(catW1);
      if (wr === "1.5-2.3t" && catW2) desiredIds.add(catW2);
      if (wr === "2.3-3t" && catW3) desiredIds.add(catW3);
      if (wr === "3-5t" && catW4) desiredIds.add(catW4);
    }

    if (desiredIds.size > 0) {
      updates.categories = Array.from(desiredIds).map((id) => ({ _type: "reference", _ref: id }));
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


