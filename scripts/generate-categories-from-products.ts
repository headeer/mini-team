import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "data/products.json");
const OUT_DIR = path.join(ROOT, ".sanity-import");
const CATS_OUT = path.join(OUT_DIR, "categories.ndjson");

function ensureOut() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

type Product = { categories?: Array<{ _ref?: string } | null> | null };

const TITLE_MAP: Record<string, string> = {
  "category-1-2t-kopiace": "Łyżki kopiące 1-2 t",
  "category-1-2t-skarpowe": "Łyżki skarpowe 1-2 t",
  "category-2-3t-kopiace": "Łyżki kopiące 2-3 t",
  "category-3-4-5t-kopiace": "Łyżki kopiące 3-4.5 t",
  "category-grabie": "Grabie",
  "category-grabie-100cm-12mm": "Grabie 100cm • 12mm zęby",
  "category-grabie-100cm-15mm": "Grabie 100cm • 15mm zęby",
  "category-grabie-120cm-12mm": "Grabie 120cm • 12mm zęby",
  "category-grabie-120cm-15mm": "Grabie 120cm • 15mm zęby",
  "category-zrywarki": "Zrywaki korzeni",
};

function slugify(text: string): string {
  return text
    .replace(/[łŁ]/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function main() {
  ensureOut();
  const raw = fs.readFileSync(INPUT, "utf8");
  const arr = JSON.parse(raw) as Product[];
  const ids = new Set<string>();
  for (const p of arr) {
    for (const c of p.categories || []) {
      if (c?._ref) ids.add(c._ref);
    }
  }
  const docs = Array.from(ids).map((id) => {
    const title = TITLE_MAP[id] || id;
    return {
      _id: id,
      _type: "category",
      title,
      slug: { _type: "slug", current: slugify(title) },
    };
  });
  fs.writeFileSync(CATS_OUT, docs.map((d) => JSON.stringify(d)).join("\n"));
  // eslint-disable-next-line no-console
  console.log(`Categories: ${docs.length} → ${CATS_OUT}`);
}

main();

