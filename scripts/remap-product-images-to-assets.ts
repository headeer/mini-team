import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "next-sanity";

dotenv.config({ path: ".env.local" });

const backendClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-20",
  useCdn: false,
  token:
    process.env.SANITY_TOKEN ||
    process.env.SANITY_WRITE_TOKEN ||
    process.env.SANITY_API_TOKEN ||
    process.env.SANITY_API_WRITE_TOKEN,
});

function parseWidthCm(name: string): number | undefined {
  const m = name.match(/(\d{2,3})\s*cm/i);
  return m ? Number(m[1]) : undefined;
}

function isSkarpowa(name: string): boolean {
  return /skarpo/i.test(name);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Project root (scripts folder is at repo/scripts)
const repoRoot = path.resolve(__dirname, "..");
// Source images are under repo/images/lyzki (not public/)
const sourceDir = path.join(repoRoot, "images", "lyzki");

// Map available files based on the provided inventory
const fileMapKopiace: Record<number, string> = {
  18: "lyzka_18cm.jpg",
  20: "lyzka_20cm.jpg",
  23: "lyzka_23cm.jpg",
  25: "lyzka_25cm.png",
  27: "lyzka_27cm.jpg",
  30: "lyzka_30cm.png",
  40: "lyzka_40cm.png",
  45: "lyzka_45cm.png",
  50: "lyzka_50cm.png",
  60: "lyzka_60cm.png",
  80: "lyzka_80cm.png",
};

const fileMapSkarpowe: Partial<Record<number, string>> = {
  70: "lyzka_skarpowa_70cm.jpg", // note: filename has "skarpowa" here
  80: "lyzka_skaropowa_80cm.jpg", // note: file is spelled skaropowa in inventory
  90: "lyzka_skaropowa_90cm.jpg",
};

function resolveImagePath(name: string): string | null {
  const w = parseWidthCm(name);
  if (!w) return null;
  if (isSkarpowa(name)) {
    // Try exact, then nearest fallback (70 as generic skarpowa)
    const candidate = fileMapSkarpowe[w] || fileMapSkarpowe[70];
    if (!candidate) return null;
    return path.join(sourceDir, candidate);
  }
  // Kopiące: try exact, then nearest lower, then nearest available
  if (fileMapKopiace[w]) return path.join(sourceDir, fileMapKopiace[w]);
  const available = Object.keys(fileMapKopiace).map(Number).sort((a, b) => a - b);
  // pick closest by absolute difference
  let best = available[0];
  let bestDiff = Math.abs(w - best);
  for (const val of available) {
    const d = Math.abs(w - val);
    if (d < bestDiff) { best = val; bestDiff = d; }
  }
  return path.join(sourceDir, fileMapKopiace[best]);
}

async function uploadImage(absPath: string) {
  const filename = path.basename(absPath);
  const stream = fs.createReadStream(absPath);
  const asset = await backendClient.assets.upload("image", stream, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } } as const;
}

async function main() {
  const products: Array<{ _id: string; name: string }> = await backendClient.fetch(
    `*[_type=='product' && name match 'Łyżka *cm*']{ _id, name }`
  );

  let updated = 0;
  for (const p of products) {
    const imgPath = resolveImagePath(p.name);
    if (!imgPath) continue;
    if (!fs.existsSync(imgPath)) {
      console.warn(`Missing file for ${p.name}: ${imgPath}`);
      continue;
    }
    const assetImage = await uploadImage(imgPath);
    await backendClient.patch(p._id).set({ images: [assetImage] }).commit();
    updated += 1;
    console.log(`✓ ${p.name} → ${path.basename(imgPath)} (uploaded asset)`);
  }
  console.log(`Done. Updated ${updated} products with Sanity image assets.`);
}

main().catch((e) => { console.error(e); process.exit(1); });


