import React from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import AppHeading from "@/components/ui/AppHeading";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";

async function getBest(limit = 4) {
  const query = `*[_type == "product" && (isFeatured == true || defined(featuredRank)) && coalesce(hidden, false) != true && coalesce(phoneOrderOnly, false) != true] | order(featuredRank asc)[0...$limit]{
    _id,
    name,
    price,
    basePrice,
    discount,
    phoneOrderOnly,
    "cover": coalesce(images[0].asset->url, images[0].url),
    "slug": slug.current
  }`;
  return client.fetch(query, { limit }, { next: { revalidate: 0 } });
}

const BestSellers = async () => {
  const products: { _id: string; name: string; price?: number; basePrice?: number; discount?: number; cover?: string | null; slug: string; featuredRank?: number }[] = await getBest(4);
  return (
    <section className="py-12">
      <AppHeading eyebrow="Najczęściej wybierane" title="Top modele Hardox – kup taniej niż na OLX" align="left" />
      <div className="mt-4">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
        {products.map((p) => {
          const cover = p.cover || null;
          const price = typeof p.basePrice === "number" ? p.basePrice : p.price;
          return (
            <CarouselItem key={p._id} className="basis-full xs:basis-1/2 md:basis-1/4">
              <div className="rounded-xl border bg-white hover:shadow-lg transition overflow-hidden flex flex-col h-full">
              <Link href={`/product/${p.slug}`} className="relative aspect-[4/3] block">
                {cover ? (
                  <Image src={cover} alt={p.name} fill className="object-cover group-hover:scale-[1.03] transition-transform" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                {typeof p.discount === 'number' && p.discount > 0 ? (
                  <Badge className="absolute top-2 left-2 bg-red-600">-{p.discount}%</Badge>
                ) : null}
              </Link>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[36px]">{p.name}</h3>
                <div className="text-xs text-gray-600 line-clamp-2">Wytrzymała łyżka Hardox HB500 – zgodność z popularnymi szybkozłączami.</div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="text-base font-bold text-gray-900">
                    {new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(price ?? 0)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/product/${p.slug}`} className="hidden sm:inline-block text-xs px-3 py-1.5 rounded-lg border-2 border-[var(--color-brand-orange)] bg-white hover:bg-[var(--color-brand-orange)] text-[var(--color-brand-orange)] hover:text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md">Szczegóły</Link>
                    <FavoriteButton showProduct={false} product={{ _id: p._id, name: p.name } as any} />
                  </div>
                </div>
                <Link href={`/product/${p.slug}`} className="w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white font-semibold">Dodaj do koszyka</Link>
              </div>
              </div>
            </CarouselItem>
          );
        })}
          </CarouselContent>
          <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" />
        </Carousel>
      </div>
    </section>
  );
};

export default BestSellers;

