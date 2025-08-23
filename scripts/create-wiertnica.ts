import { backendClient } from "../sanity/lib/backendClient";

async function upsertWiertnica() {
  const slug = "wiertnica-glebowa";

  const existing = await backendClient.fetch(
    `*[_type=="product" && slug.current==$slug][0]{_id}`,
    { slug }
  );

  const doc = {
    _type: "product" as const,
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
    categories: [],
    stock: 5,
    discount: 0,
    mountSystems: [
      {
        title: "Wahacz gięty",
        price: 290,
        drawingFile: "rysunek_techniczny_wahacza_gietego.pdf",
      },
      {
        title: "Wahacz kostka",
        price: 490,
        drawingFile: "rysunek_techniczny_wahacz_kostka.pdf",
      },
      {
        title: "Premium",
        price: 1090,
        drawingFile: "rysunek_techniczny_premium.pdf",
      },
    ],
    drillBits: [
      { title: "Fi 250", price: 950 },
      { title: "Fi 300", price: 1050 },
      { title: "Fi 400", price: 1400 },
    ],
  };

  if (existing?._id) {
    const updated = await backendClient.patch(existing._id)
      .set({
        name: doc.name,
        description: doc.description,
        basePrice: doc.basePrice,
        price: doc.price,
        images: doc.images,
        stock: doc.stock,
        discount: doc.discount,
        mountSystems: doc.mountSystems,
        drillBits: doc.drillBits,
      })
      .commit();
    console.log("✅ Updated product:", updated._id);
  } else {
    const created = await backendClient.create(doc as any);
    console.log("✅ Created product:", created._id);
  }
}

upsertWiertnica().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});


