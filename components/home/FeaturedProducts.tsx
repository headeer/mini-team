import React from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";

// no local placeholders
// const localImages: string[] = [];

async function getFeatured(limit = 8) {
  const query = `*[_type == "product"] | order(dateUpdated desc)[0...$limit]{
    _id,
    name,
    description,
    price,
    basePrice,
    discount,
    "cover": coalesce(images[0].asset->url, images[0].url),
    "slug": slug.current,
  }`;
  return client.fetch(query, { limit }, { next: { revalidate: 0 } });
}

const FeaturedProducts = async () => {
  const products: { _id: string; name: string; description?: string; price?: number; basePrice?: number; discount?: number; cover?: string | null; slug: string }[] = await getFeatured(8);
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Wybrane modele Hardox HB500</h2>
        <Link href="/shop" className="text-sm underline underline-offset-2">Zobacz wszystkie</Link>
      </div>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {products.map((p) => {
            const cover = p.cover || null;
            const price = typeof p.basePrice === "number" ? p.basePrice : p.price;
            return (
              <CarouselItem key={p._id} className="basis-1/2 md:basis-1/4">
                <div className="group rounded-xl border bg-white hover:shadow-lg transition overflow-hidden flex flex-col h-full">
                  <Link href={`/product/${p.slug}`} className="relative aspect-[4/3] block">
                    {cover ? (
                      <Image src={cover} alt={p.name} fill className="object-cover group-hover:scale-[1.03] transition-transform" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                    {p.discount ? (
                      <Badge className="absolute top-2 left-2 bg-red-600">-{p.discount}%</Badge>
                    ) : null}
                  </Link>
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <h3 className="text-sm font-semibold line-clamp-2 min-h-[36px]">{p.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="text-base font-bold text-gray-900">
                        {new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(price ?? 0)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/product/${p.slug}`} className="text-xs px-3 py-1.5 rounded-md border hover:bg-gray-50">Szczegóły</Link>
                        <FavoriteButton showProduct={false} product={{ _id: p._id, name: p.name } as any} />
                      </div>
                    </div>
                    <AddToCartButton product={{ _id: p._id, name: p.name, price: price } as any} className="w-full rounded-md" />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-3" />
        <CarouselNext className="-right-3" />
      </Carousel>
      <div className="mt-4 text-center">
        <Link href="/shop" className="inline-flex items-center px-5 py-2.5 rounded-md bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white font-semibold">
          Zobacz całą ofertę
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;

