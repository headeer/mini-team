import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "next-sanity";

dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-20";

const client = createClient({ projectId, dataset, apiVersion, useCdn: false });

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "exports");
const OUT_FILE = path.join(OUT_DIR, "products.json");

function ensureOut() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log("Fetching products from Sanity...");
  const query = `*[_type == "product"]{
    _id,
    _createdAt,
    _updatedAt,
    name,
    "slug": slug.current,
    images[]{
      ..., 
      asset->{_id,url}
    },
    description,
    priceNet,
    priceGross,
    priceOlx,
    price,
    basePrice,
    priceText,
    toothCost,
    toothQty,
    priceTier,
    ripperTier,
    discount,
    categories[]->{ _id, title, "slug": slug.current },
    subcategory,
    weightRange,
    stock,
    brand->{ _id, title, "slug": slug.current },
    status,
    specifications,
    dateUpdated,
    phoneOrderOnly,
    externalId,
    location,
    viewsCount,
    featuredRank,
    isFeatured,
    technicalDrawing,
    technicalDrawings[]{
      title,
      code,
      externalUrl,
      image{asset->{_id,url}},
      file{asset->{_id,url}}
    },
    mountSystems[]{ code, title, price, drawingImage{asset->{_id,url}}, drawingFileAsset{asset->{_id,url}}, drawingFile, productRef->{_id, slug} },
    dimensions,
    teethEnabled,
    drillBits[]{ title, price, productRef->{_id, slug} },
    similarProducts[]->{ _id, name, "slug": slug.current },
    recommendationSettings
  } | order(name asc)`;

  const products = await client.fetch(query);
  ensureOut();
  fs.writeFileSync(OUT_FILE, JSON.stringify(products, null, 2));
  console.log(`Saved ${products.length} products → ${OUT_FILE}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


