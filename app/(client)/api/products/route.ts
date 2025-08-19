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
        price,
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
    const withVirtual = (data || []).map((p: any) => {
      const categories = Array.isArray(p.categories) ? [...p.categories] : [];
      const hasSlug = (slug: string) => categories.some((c: any) => c?.slug === slug);
      const add = (slug: string, title: string) => {
        if (!hasSlug(slug)) categories.push({ _id: null, title, slug });
      };
      const name = String(p?.name || "").toLowerCase();
      const tier = String(p?.priceTier || "").toLowerCase();

      // Weight bucket mapping
      if (/1\s*-?\s*1\.5t/.test(tier) || /1\s*-?\s*2t/.test(name)) add("1-2t", "Łyżki 1–2t");
      if (/1\.5\s*-?\s*2\.3t/.test(tier) || /2\s*-?\s*3t/.test(tier) || /2\s*-?\s*3t/.test(name)) add("2-3t", "Łyżki 2–3t");
      if (/3\s*-?\s*5t/.test(tier) || /3\s*-?\s*4\.5t/.test(name)) add("3-4.5t", "Łyżki 3–4.5t");

      // Grabie
      if (/grabie/.test(name)) add("grabie", "Grabie");
      // Zrywaki korzeni
      if (/zrywak/.test(name)) add("zrywarki-korzeni", "Zrywaki korzeni");

      return { ...p, categories };
    });
    return NextResponse.json({ data: withVirtual });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

