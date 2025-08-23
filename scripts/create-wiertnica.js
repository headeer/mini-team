const { createClient } = require("next-sanity");

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-20";
  const token = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

  if (!projectId || !dataset || !token) {
    throw new Error("Missing SANITY env vars (projectId/dataset/token)");
  }

  const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token });

  const slug = "wiertnica-glebowa";
  const existing = await client.fetch(`*[_type=="product" && slug.current==$slug][0]{_id}`, { slug });

  const doc = {
    _type: "product",
    name: "Wiertnica glebowa – napęd",
    slug: { _type: "slug", current: slug },
    description:
      "Napęd wiertnicy + możliwość doboru systemu mocowania (Wahacz gięty, Wahacz kostka, Premium) oraz wiertła (Fi 250 / 300 / 400).",
    basePrice: 2460,
    price: 2460,
    images: [
      { _type: "externalImage", url: "/images/main/weirtnica_glebowa.png" },
      { _type: "externalImage", url: "/images/main/wiertla.jpg" },
    ],
    stock: 5,
    discount: 0,
    mountSystems: [
      { title: "Wahacz gięty", price: 290, drawingFile: "rysunek_techniczny_wahacza_gietego.pdf" },
      { title: "Wahacz kostka", price: 490, drawingFile: "rysunek_techniczny_wahacz_kostka.pdf" },
      { title: "Premium", price: 1090, drawingFile: "rysunek_techniczny_premium.pdf" },
    ],
    drillBits: [
      { title: "Fi 250", price: 950 },
      { title: "Fi 300", price: 1050 },
      { title: "Fi 400", price: 1400 },
    ],
  };

  if (existing && existing._id) {
    const updated = await client.patch(existing._id).set(doc).commit();
    console.log("✅ Updated product:", updated._id);
  } else {
    const created = await client.create(doc);
    console.log("✅ Created product:", created._id);
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});


