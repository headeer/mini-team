import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const data = await client.fetch(
      `*[_type == "product" && status != 'hidden'] | order(dateUpdated desc){
        _id,
        name,
        "slug": slug.current,
        images,
        "imageUrls": images[]{ "url": coalesce(asset->url, url) },
        "cover": coalesce(images[0].asset->url, images[0].url),
        description,
        priceNet,
        priceGross,
        priceOlx,
        discount,
        basePrice,
        toothCost,
        toothQty,
        priceTier,
        specifications,
        // flatten URL-only images if present
        "imageUrls": images[]{
          "url": coalesce(asset->url, url)
        },
        stock,
        status,
        dateUpdated,
        externalId,
        "categories": categories[]-> { _id, title, "slug": slug.current }
      }`
    );
    // Inject virtual categories so we can filter without Sanity writes
    const vatRate = 0.23; // PL VAT 23%
    const withVirtual = (data || []).map((p: any) => {
      const categories = Array.isArray(p.categories) ? [...p.categories] : [];
      const hasSlug = (slug: string) => categories.some((c: any) => c?.slug === slug);
      const add = (slug: string, title: string) => {
        if (!hasSlug(slug)) categories.push({ _id: null, title, slug });
      };
      const name = String(p?.name || "").toLowerCase();
      const tier = String(p?.priceTier || "").toLowerCase();

      // Weight bucket mapping (new slugs)
      if (/\b1\s*-?\s*1\.5\s*t\b/.test(tier) || /\b1\s*-?\s*1\.5\s*t\b/.test(name)) add("lyzki-1-1.5t", "Łyżki kat. 1-1.5 Tony");
      if (/\b1\.5\s*-?\s*2\.3\s*t\b/.test(tier) || /\b1\.5\s*-?\s*2\.3\s*t\b/.test(name)) add("lyzki-1.5-2.3t", "Łyżki kat. 1.5-2.3 Tony");
      if (/\b2\.3\s*-?\s*3\s*t\b/.test(tier) || /\b2\.3\s*-?\s*3\s*t\b/.test(name)) add("lyzki-2.3-3t", "Łyżki kat. 2.3-3 Tony");
      if (/\b3\s*-?\s*5\s*t\b/.test(tier) || /\b3\s*-?\s*5\s*t\b/.test(name)) add("lyzki-3-5t", "Łyżki kat. 3-5 Tony");

      // Product types
      if (/grabie/.test(name)) add("grabie", "Grabie");
      if (/zrywak|ripper/.test(name)) add("rippery", "Rippery");
      if (/wiertnic/.test(name)) add("wiertnice", "Wiertnice");
      if (/niwelator/.test(name)) add("niwelatory", "Niwelatory");
      if (/szybkoz\u0142\u0105cz|szybkozlacz|szybkoz\u0142\u0105cz/.test(name)) add("szybkozlacza", "Szybkozłącza");
      if (/kablow/.test(name)) add("lyzki-kablowe", "Łyżki kablowe");
      if (/przesiew/.test(name)) add("lyzki-przesiewowe", "Łyżki przesiewowe");
      if (/skandyn/.test(name)) add("lyzki-skandynawskie", "Łyżki skandynawskie");

      // Pricing – provide BE-calculated values
      const priceNet = typeof p.priceNet === 'number' ? p.priceNet : (typeof p.price === 'number' ? p.price : undefined);
      const priceGross = typeof p.priceGross === 'number'
        ? p.priceGross
        : (typeof priceNet === 'number' ? Math.round(priceNet * (1 + vatRate) * 100) / 100 : undefined);
      const priceOlxNum = typeof p.priceOlx === 'number' ? p.priceOlx : (typeof p.priceOlx === 'string' ? Number(String(p.priceOlx).replace(/[^0-9.,]/g, '').replace(',', '.')) : undefined);

      return { 
        ...p, 
        categories,
        pricing: {
          vatRate,
          priceNet,
          priceGross,
          priceOlx: priceOlxNum,
        }
      };
    });
    return NextResponse.json({ data: withVirtual });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

