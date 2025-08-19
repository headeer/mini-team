/**
 * Usage:
 *  npx ts-node scripts/update-categories-weight-and-subcats.ts
 *
 * Creates/ensures visible categories: "Łyżki 1–2t", "Łyżki 2–3t", "Łyżki 3–4.5t" (visible: true)
 * Hides old category variants (e.g., "Łyżki kopiace", "Łyżki skarpowe") by setting visible=false
 * Sets product.weightRange and product.subcategory based on name/title heuristics
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2024-05-01",
  useCdn: false,
});

async function ensureCategory(title: string) {
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[,–]/g, "-");
  const existing = await client.fetch(`*[_type=='category' && slug.current==$slug][0]{_id,visible}`, { slug });
  if (existing?._id) {
    if (existing.visible === false) {
      await client.patch(existing._id).set({ visible: true, title }).commit();
    }
    return existing._id;
  }
  const created = await client.create({ _type: "category", title, slug: { _type: "slug", current: slug }, visible: true });
  return created._id;
}

function detectWeightRange(name: string): "1-2t" | "2-3t" | "3-4.5t" | undefined {
  const n = name.toLowerCase();
  if (/\b1[.,-]?\s*[-–]?\s*2\s*t/.test(n) || /\b1\s*t\b/.test(n)) return "1-2t";
  if (/\b2[.,-]?\s*[-–]?\s*3\s*t/.test(n) || /\b2\s*t\b/.test(n)) return "2-3t";
  if (/\b3[.,-]?\s*[-–]?\s*4(\.5)?\s*t/.test(n) || /\b4\.?5\s*t\b/.test(n)) return "3-4.5t";
  return undefined;
}

function detectSubcategory(name: string): string | undefined {
  const n = name.toLowerCase();
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

async function run() {
  const cat12 = await ensureCategory("Łyżki 1–2t");
  const cat23 = await ensureCategory("Łyżki 2–3t");
  const cat345 = await ensureCategory("Łyżki 3–4.5t");

  // Hide old top-level categories that split by type rather than weight
  const oldCats = await client.fetch(`*[_type=='category' && (title match 'Łyżki *kop*' || title match 'Łyżki *skar*')][]{_id}`);
  for (const c of oldCats) {
    await client.patch(c._id).set({ visible: false }).commit();
  }

  // Ensure single Grabie category visible
  const grabieId = await ensureCategory("Grabie");

  // Load products
  const products: any[] = await client.fetch(`*[_type=='product']{_id,name,slug,categories[]-> { _id, title }, weightRange, subcategory}`);
  for (const p of products) {
    const updates: any = {};
    const wr = p.weightRange || detectWeightRange(p.name || "");
    const sub = p.subcategory || detectSubcategory(p.name || "");
    if (wr && wr !== p.weightRange) updates.weightRange = wr;
    if (sub && sub !== p.subcategory) updates.subcategory = sub;

    const catRefs: string[] = (p.categories || []).map((c: any) => c?._id).filter(Boolean);
    let desiredTop: string | undefined;
    if (wr === "1-2t") desiredTop = cat12;
    if (wr === "2-3t") desiredTop = cat23;
    if (wr === "3-4.5t") desiredTop = cat345;

    // For grabie, keep only Grabie visible category
    const isGrabie = /grabie/i.test(p.name || "");
    if (isGrabie) {
      if (!catRefs.includes(grabieId)) catRefs.push(grabieId);
      // remove other bucket categories
      const filtered = catRefs.filter((id) => id === grabieId);
      updates.categories = filtered.map((id) => ({ _type: "reference", _ref: id }));
    } else if (desiredTop) {
      if (!catRefs.includes(desiredTop)) catRefs.push(desiredTop);
      // remove old bucket categories if present
      const filtered = catRefs.filter((id) => [cat12, cat23, cat345].includes(id));
      updates.categories = filtered.map((id) => ({ _type: "reference", _ref: id }));
    }

    if (Object.keys(updates).length > 0) {
      await client.patch(p._id).set(updates).commit();
    }
  }

  console.log("Done updating categories, weight ranges, and subcategories.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


