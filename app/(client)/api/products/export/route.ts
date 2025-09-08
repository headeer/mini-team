import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const query = `*[_type == "product"]{
      _id,
      _createdAt,
      _updatedAt,
      name,
      "slug": slug.current,
      images[]{..., asset->{_id,url}},
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
    return NextResponse.json(products, {
      headers: {
        "Content-Disposition": "attachment; filename=products.json",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}


