/*
  Usage:
  SANITY_TOKEN=your_token npx ts-node scripts/create-zrywaki-products.ts

  This script will:
  - Upload product images from images/zrywaki and technical PNGs from images/techniczne/zrywaki
  - Create or update 4 zrywak products in Sanity
  - Set technicalDrawing.url to the public PDF under /images/techniczne
*/

import fs from "fs";
import path from "path";
import { backendClient } from "../sanity/lib/backendClient";

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ZrywakSpec = {
  name: string;
  ripperTier: "1-1.5t" | "2-4t" | "4-8t";
  mainImage: string; // relative to repo root
  techPng: string;   // relative to repo root
  techPdf: string;   // file name under public/images/techniczne
};

const repoRoot = path.resolve(__dirname, "..");

const products: ZrywakSpec[] = [
  {
    name: "Zrywak pojedynczy 2–4T",
    ripperTier: "2-4t",
    mainImage: "images/zrywaki/zrywak_pojedynczy_2-4_tony.png",
    techPng: "images/techniczne/zrywaki/rysunek_techniczny_zrywak_pojedynczy_2-4_tony.png",
    techPdf: "rysunek_techniczny_zrywak_pojedynczy2-4tony.pdf",
  },
  {
    name: "Zrywak podwójny 2–4T",
    ripperTier: "2-4t",
    mainImage: "images/zrywaki/ripper_podwojny_2-4_tony.png",
    techPng: "images/techniczne/zrywaki/rysunek_techniczniczny_zrywak_podwojny_2-4_tony.png",
    techPdf: "rysunek_techniczniczny_zrywak_podwojny_2-4_tony.pdf",
  },
  {
    name: "Zrywak pojedynczy 4–8T",
    ripperTier: "4-8t",
    mainImage: "images/zrywaki/zrywak_pojedynczy_4-8_tony.png",
    techPng: "images/techniczne/zrywaki/rysunek_techniczny_zrywak_pojedynczy_4-8_tony.png",
    techPdf: "rysunek_techniczny_zrywak_pojedynczy_4-8_tony.pdf",
  },
  {
    name: "Zrywak podwójny 4–8T",
    ripperTier: "4-8t",
    mainImage: "images/zrywaki/zdjecie_zrywak_podowjny_4-8_tony.png",
    techPng: "images/techniczne/zrywaki/rysunek_techniczny_zrywak_podwojny_4-8_tony.png",
    techPdf: "rysunek_techniczny_zrywak_podwojny_4-8_tony.pdf",
  },
];

async function uploadImage(absPath: string, filename: string) {
  const stream = fs.createReadStream(absPath);
  const asset = await backendClient.assets.upload("image", stream, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function createOrUpdateProduct(p: ZrywakSpec) {
  const slug = toSlug(p.name);
  const mainPath = path.join(repoRoot, p.mainImage);
  const techPngPath = path.join(repoRoot, p.techPng);

  if (!fs.existsSync(mainPath)) throw new Error(`Missing main image: ${mainPath}`);
  if (!fs.existsSync(techPngPath)) throw new Error(`Missing tech PNG: ${techPngPath}`);

  const mainImg = await uploadImage(mainPath, path.basename(mainPath));
  const techImg = await uploadImage(techPngPath, path.basename(techPngPath));

  const technicalDrawingUrl = `/images/techniczne/${p.techPdf}`;

  const doc = {
    _type: "product",
    name: p.name,
    slug: { _type: "slug", current: slug },
    images: [mainImg, techImg],
    description: "Zrywak do koparki – stal HARDOX HB500.",
    price: 0,
    basePrice: 0,
    priceText: "Na zapytanie",
    phoneOrderOnly: true,
    stock: 10,
    ripperTier: p.ripperTier,
    discount: 0,
    specifications: {
      _type: "product.specifications",
      toothThickness: undefined,
      features: [],
    },
    technicalDrawing: {
      url: technicalDrawingUrl,
      title: "Rysunek techniczny",
      type: "pdf",
    },
  } as any;

  const existing = await backendClient.fetch(
    `*[_type=="product" && slug.current==$slug][0]{_id}`,
    { slug }
  );
  if (existing?._id) {
    await backendClient
      .patch(existing._id)
      .set(doc)
      .commit();
    console.log(`Updated: ${p.name}`);
  } else {
    await backendClient.create(doc);
    console.log(`Created: ${p.name}`);
  }
}

(async () => {
  try {
    for (const p of products) {
      await createOrUpdateProduct(p);
    }
    console.log("Done.");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();



