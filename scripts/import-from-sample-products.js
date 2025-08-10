/*
  Converts sample_products.json into two NDJSON files for Sanity import:
  - ./.sanity-import/categories.ndjson
  - ./.sanity-import/products.ndjson

  Categories are detected from product titles using simple keyword rules and created
  with stable _id, so products may reference them by _id immediately.
*/
const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "../sample_products.json");
const OUT_DIR = path.join(__dirname, "../.sanity-import");
const CATS_OUT = path.join(OUT_DIR, "categories.ndjson");
const PRODS_OUT = path.join(OUT_DIR, "products.ndjson");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const load = () => JSON.parse(fs.readFileSync(INPUT, "utf8"));

const slugify = (text) =>
  (text || "")
    .toString()
    .replace(/[łŁ]/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parsePrice = (str) => {
  if (!str) return 0;
  const digits = String(str).replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
};

const detectWidthCm = (title) => {
  const m = String(title || "").match(/(\d{2,3})\s*cm/i);
  return m ? parseInt(m[1], 10) : undefined;
};

const detectQuickCoupler = (text) => {
  const m = String(text || "").match(/\b(MS01|MS03|MS08|S30|S40|CW05|HS02|Q-?Fit)\b/i);
  return m ? m[1].toUpperCase().replace("QFIT", "Q-FIT") : undefined;
};

// Heuristic category detection
const CATEGORY_DEFS = [
  { id: "category-lyzki-kopiace", title: "Łyżki kopiące", keywords: [/\bł(y|y)żka\b/i], negative: [/skarpowa/i] },
  { id: "category-lyzki-skarpowe", title: "Łyżki skarpowe", keywords: [/skarpow/i] },
  { id: "category-grabie", title: "Grabie", keywords: [/\bgrab/i] },
  { id: "category-zrywaki", title: "Zrywaki korzeni", keywords: [/\bzrywak|ripper/i] },
  { id: "category-wiertnice", title: "Wiertnice", keywords: [/\bwiertnic/i] },
  { id: "category-szybkozlacza", title: "Szybkozłącza", keywords: [/\bszybkoz[łl]ącz|\bCW0?5|\bMS0[138]|\bS3[0|5|8|9]|\bQ-?fit/i] },
  { id: "category-akcesoria", title: "Akcesoria", keywords: [/lemiesz|kciuk|karczownik|karetka|nożyc|młotek|przystawk|niwelator|równiark|przesiewacz/i] },
];

const pickCategory = (title) => {
  const t = String(title || "");
  for (const def of CATEGORY_DEFS) {
    if (def.negative && def.negative.some((rx) => rx.test(t))) continue;
    if (def.keywords.some((rx) => rx.test(t))) return def;
  }
  return CATEGORY_DEFS[0]; // default to kopiące
};

// priceTier heuristics
const detectTier = (title, desc) => {
  const s = `${title} ${desc}`.toLowerCase();
  if (/\b1[^0-9]?-[^0-9]?1\.5\s*t|\b1-1\.5t|\b8014|\b8018|\bms01\b/.test(s)) return "1-1.5t";
  if (/\b1\.5[^0-9]?-[^0-9]?2\.3\s*t|\b1\.5-2\.3t|\bms03\b/.test(s)) return "1.5-2.3t";
  if (/\b2\.3[^0-9]?-[^0-9]?3\s*t|\b2\.3-3t|\bs40\b|\bcw05\b/.test(s)) return "2.3-3t";
  if (/\b3[^0-9]?-[^0-9]?5\s*t|\b3-5t|\b3cx\b|\b4cx\b/.test(s)) return "3-5t";
  return undefined;
};

const main = () => {
  const json = load();
  const products = json.products || [];

  // Prepare category docs
  const categoryDocs = CATEGORY_DEFS.map((c) => ({
    _id: c.id,
    _type: "category",
    title: c.title,
    slug: { _type: "slug", current: slugify(c.title) },
  }));

  // Prepare product docs
  const prodDocs = products.map((p) => {
    const title = p.title?.trim();
    const basePrice = parsePrice(p.price);
    const toothCost = 0;
    const toothQty = 0;
    const widthCm = detectWidthCm(title);
    const quickCoupler = detectQuickCoupler(`${p.title} ${p.description}`);
    const tier = detectTier(p.title, p.description);
    const cat = pickCategory(title);
    const slug = slugify(`${title}-${p.id}`);

    return {
      _id: `product-${slug}`,
      _type: "product",
      // match schema: primary title field is "name"
      name: title,
      slug: { _type: "slug", current: slug },
      // match schema: categories is an array of references
      categories: [{ _type: "reference", _ref: cat.id }],
      basePrice,
      // keep legacy price for compatibility
      price: basePrice,
      toothCost,
      toothQty,
      priceTier: tier,
      description: p.description || "",
      images: [],
      status: "active",
      dateUpdated: new Date(p.date_updated || Date.now()).toISOString(),
      externalId: String(p.id),
      location: p.location || undefined,
      specifications: {
        widthCm,
        quickCoupler,
      },
      viewsCount: Math.floor(Math.random() * 150) + 20,
      featuredRank: Math.floor(Math.random() * 20) + 1,
    };
  });

  fs.writeFileSync(CATS_OUT, categoryDocs.map((d) => JSON.stringify(d)).join("\n"));
  fs.writeFileSync(PRODS_OUT, prodDocs.map((d) => JSON.stringify(d)).join("\n"));
  console.log(`Categories: ${categoryDocs.length} → ${CATS_OUT}`);
  console.log(`Products:   ${prodDocs.length} → ${PRODS_OUT}`);
};

main();

