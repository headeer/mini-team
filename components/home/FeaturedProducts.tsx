import React from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeaturedProductActions from "./FeaturedProductActions";

// no local placeholders
// const localImages: string[] = [];

async function getFeatured(limit = 8) {
  const query = `*[_type == "product" && coalesce(hidden, false) != true] | order(dateUpdated desc)[0...$limit]{
    _id,
    name,
    description,
    price,
    basePrice,
    pricing,
    "priceNet": coalesce(pricing.priceNet, priceNet, basePrice, price),
    discount,
    phoneOrderOnly,
    "cover": coalesce(images[0].asset->url, images[0].url),
    "slug": slug.current,
  }`;
  return client.fetch(query, { limit }, { next: { revalidate: 0 } });
}

const FeaturedProducts = async () => {
  const products: { _id: string; name: string; description?: string; price?: number; basePrice?: number; pricing?: { priceNet?: number | string }; priceNet?: number | string; discount?: number; cover?: string | null; slug: string; phoneOrderOnly?: boolean }[] = await getFeatured(8);
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="uppercase tracking-widest text-[var(--color-brand-orange)] text-xs font-semibold mb-1">Hardox HB500</p>
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Wybrane modele Hardox</h2>
        </div>
        <Link href="/shop" className="hidden sm:inline text-sm font-semibold text-shop_dark_green hover:underline underline-offset-4">Zobacz wszystkie</Link>
      </div>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {products.map((p) => {
            const cover = p.cover || null;
            const candidate = (typeof p.priceNet === 'number' ? p.priceNet : (typeof p.priceNet === 'string' ? parseFloat(p.priceNet) : undefined))
              ?? (typeof p.basePrice === 'number' ? p.basePrice : undefined)
              ?? (typeof p.price === 'number' ? p.price : 0);
            const price = Number.isFinite(candidate as number) ? (candidate as number) : 0;
            return (
              <CarouselItem key={p._id} className="basis-full xs:basis-1/2 md:basis-1/4">
                <div className="group rounded-2xl border bg-white hover:shadow-xl hover:border-[var(--color-brand-orange)]/30 transition overflow-hidden flex flex-col h-full">
                  <Link href={`/product/${p.slug}`} className="relative aspect-[4/3] block rounded-t-2xl overflow-hidden">
                    {cover ? (
                      <Image src={cover} alt={p.name} fill className="object-contain bg-white" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                    {p.discount ? (
                      <Badge className="absolute top-2 left-2 bg-red-600 shadow">-{p.discount}%</Badge>
                    ) : null}
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-[15px] font-semibold line-clamp-2 group-hover:text-[var(--color-brand-orange)] transition-colors">
                      <Link href={`/product/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
                    <FeaturedProductActions productId={p._id} name={p.name} price={price} slug={p.slug} phoneOrderOnly={p.phoneOrderOnly} />
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

