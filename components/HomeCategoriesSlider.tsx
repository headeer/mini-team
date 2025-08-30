"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Title from "./Title";

type CategoryLike = {
  _id?: string;
  title?: string;
  slug?: { current?: string } | string;
  productCount?: number;
};

function categoryHref(cat: CategoryLike): string {
  if (!cat) return "/shop";
  if (typeof cat.slug === "string") return cat.slug || "/shop";
  if (cat.slug?.current) return `/category/${cat.slug.current}`;
  return "/shop";
}

export default function HomeCategoriesSlider({ categories }: { categories: CategoryLike[] }) {
  const sorted = React.useMemo(() => {
    return [...(categories || [])].sort((a, b) => (b?.productCount || 0) - (a?.productCount || 0));
  }, [categories]);

  const pluralize = (n?: number) => {
    if (!n || n <= 0) return null;
    if (n === 1) return "1 produkt";
    if (n < 5) return `${n} produkty`;
    return `${n} produktów`;
  };

  return (
    <section className="my-6 md:my-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="uppercase tracking-widest text-[var(--color-brand-orange)] text-xs font-semibold mb-1">Polecane kategorie</p>
          <Title className="!mb-0 text-2xl md:text-3xl">Najbogatsze kategorie</Title>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-shop_dark_green hover:underline underline-offset-4">Zobacz wszystkie</Link>
      </div>
      <div className="relative">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {sorted.map((cat) => {
              const href = categoryHref(cat);
              const countText = pluralize(cat?.productCount);
              return (
                <CarouselItem key={cat?._id || href} className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Link href={href} className="block group">
                    <div className="h-full p-4 rounded-2xl border bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-base line-clamp-2 group-hover:text-[var(--color-brand-orange)] transition-all duration-300 leading-tight break-words mb-1">
                            {String(cat?.title || "").replace(/(\d+)([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ])/g, "$1 $2")}
                          </div>
                          {countText ? (
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                              <span className="bg-gray-100 px-2 py-0.5 rounded-lg font-medium">{countText}</span>
                              <span className="text-green-600 font-medium">📦 Dostępne</span>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-xs">Sprawdź dostępność</div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end">
                        <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[var(--color-brand-orange)] group-hover:text-white transition-all duration-300">
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}



