// scripts/import-products-from-json.ts
import fs from "fs";
import path from "path";

type InputImage = { url?: string };

interface InputProduct {
  name: string;
  slug: string;
  images?: InputImage[];
  description?: string;
  price?: number | string;
  priceOlx?: number | string;
  basePrice?: number;
  toothCost?: number;
  toothQty?: number;
  priceTier?: string;
  ripperTier?: string;
  discount?: number;
  categories?: Array<{ _ref?: string }>;
  stock?: number;
  brand?: { _ref?: string };
  status?: string;
  specifications?: Record<string, unknown>;
  dateUpdated?: string;
  externalId?: string;
  location?: string;
  viewsCount?: number;
  featuredRank?: number;
  isFeatured?: boolean;
}

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "data/products.json");
const OUT_DIR = path.join(ROOT, ".sanity-import");
const PRODUCTS_OUT = path.join(OUT_DIR, "products.ndjson");

function ensureOut() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

function readInput(): InputProduct[] {
  const raw = fs.readFileSync(INPUT, "utf8");
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error("data/products.json must be an array");
  return arr as InputProduct[];
}

function mapProduct(p: InputProduct) {
  const images = (p.images || []).map((img, idx) => ({
    _type: "externalImage",
    _key: `${p.slug}-${idx}`,
    url: img?.url,
  }));

  return {
    _type: "product",
    _id: `product-${p.slug}`,
    name: p.name,
    slug: { _type: "slug", current: p.slug },
    images,
    description: p.description ?? "",
    price: typeof p.price === "number" ? p.price : undefined,
    priceText: typeof p.price === "string" ? p.price : undefined,
    priceOlx: typeof p.priceOlx === "string" ? p.priceOlx : String(p.priceOlx ?? ""),
    basePrice: p.basePrice ?? (typeof p.price === "number" ? p.price : 0),
    toothCost: p.toothCost ?? 0,
    toothQty: p.toothQty ?? 0,
    priceTier: p.priceTier,
    ripperTier: p.ripperTier,
    discount: p.discount ?? 0,
    categories: (p.categories || []).map((c) => ({ _type: "reference", _ref: c._ref })),
    stock: p.stock ?? 0,
    brand: p.brand?._ref ? { _type: "reference", _ref: p.brand._ref } : undefined,
    status: p.status ?? "new",
    specifications: p.specifications || {},
    dateUpdated: p.dateUpdated || new Date().toISOString(),
    externalId: p.externalId || p.slug,
    location: p.location,
    viewsCount: p.viewsCount ?? 0,
    featuredRank: p.featuredRank ?? 0,
    isFeatured: p.isFeatured ?? false,
  };
}

function main() {
  ensureOut();
  const input = readInput();
  const docs = input.map(mapProduct);
  fs.writeFileSync(PRODUCTS_OUT, docs.map((d) => JSON.stringify(d)).join("\n"));
  // eslint-disable-next-line no-console
  console.log(`Products: ${docs.length} → ${PRODUCTS_OUT}`);
}

main();
