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
        description,
        price,
        discount,
        basePrice,
        toothCost,
        toothQty,
        priceTier,
        specifications,
        stock,
        status,
        dateUpdated,
        externalId,
        "categories": categories[]-> { _id, title, "slug": slug.current }
      }`
    );
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

