/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";
import path from "path";
import sanityClient from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_TOKEN!;
if (!projectId || !dataset || !token) throw new Error("Set SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN");

const client = sanityClient({ projectId, dataset, token, apiVersion: "2025-03-20", useCdn: false });

const map = [
  { slug: "jak-dobrac-idealna-lyzke-do-minikoparki", file: "jak_dobrac_lyzke.png", alt: "Jak dobrać idealną łyżkę – MTT" },
  { slug: "hardox-hb500-w-praktyce", file: "hb500_w_praktyce.png", alt: "Hardox HB500 w praktyce – MTT" },
  { slug: "zrywak-korzeni-czy-warto", file: "zrywak.png", alt: "Zrywak korzeni – MTT" },
];

async function uploadImage(absPath: string) {
  const stream = fs.createReadStream(absPath);
  const asset = await client.assets.upload("image", stream, { filename: path.basename(absPath) });
  return asset._id as string;
}

async function run() {
  for (const m of map) {
    const doc = await client.fetch(`*[_type=="blog" && slug.current==$slug][0]{_id}`, { slug: m.slug });
    if (!doc?._id) { console.warn("Blog not found:", m.slug); continue; }

    const abs = path.resolve(process.cwd(), "images", m.file);
    if (!fs.existsSync(abs)) { console.warn("Missing image:", abs); continue; }

    const assetId = await uploadImage(abs);
    await client.patch(doc._id)
      .set({ mainImage: { _type: "image", asset: { _type: "reference", _ref: assetId }, alt: m.alt } })
      .commit();

    console.log("Updated mainImage for /blog/" + m.slug);
  }
}
run().catch(err => { console.error(err); process.exit(1); });