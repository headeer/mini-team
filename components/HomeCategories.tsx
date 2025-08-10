import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { categoryIconFor } from "./CustomIcons";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  const pluralize = (n?: number) => {
    if (!n || n <= 0) return null;
    if (n === 1) return "1 produkt";
    const last = n % 10;
    const lastTwo = n % 100;
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return `${n} produkty`;
    return `${n} produktów`;
  };

  return (
    <section className="my-8 md:my-12">
      <div className="flex items-center justify-between mb-4">
        <Title className="!mb-0">Popularne kategorie</Title>
        <Link href="/shop" className="text-sm text-[var(--color-brand-orange)] hover:underline underline-offset-2">Zobacz wszystkie</Link>
      </div>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {categories?.slice(0, 12).map((category) => {
            const Icon = categoryIconFor(category?.title);
            const countText = pluralize(category?.productCount as number);
            return (
              <CarouselItem key={category?._id} className="basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link href={`/category/${category?.slug?.current}`} className="group block">
                  <div className="relative h-44 md:h-56 rounded-2xl overflow-hidden border bg-white hover:shadow-lg transition">
                    {category?.image ? (
                      <Image
                        src={urlFor(category?.image).url()}
                        alt={category?.title || "Kategoria"}
                        fill
                        sizes="(max-width:768px) 70vw, (max-width:1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <Icon className="w-10 h-10 text-[var(--color-brand-orange)]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="bg-white/85 backdrop-blur px-2 py-1 rounded-md text-[11px] font-medium text-gray-900 inline-flex items-center gap-1">
                        <Icon className="w-3.5 h-3.5 text-[var(--color-brand-orange)]" />
                        <span className="line-clamp-1">{category?.title}</span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      {countText ? (
                        <span className="bg-white/85 backdrop-blur px-2 py-1 rounded-md text-[11px] font-medium text-gray-900">{countText}</span>
                      ) : null}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="text-white drop-shadow-sm">
                        <div className="font-semibold text-base line-clamp-1">{category?.title}</div>
                        {countText ? (
                          <div className="text-white/80 text-xs">{countText}</div>
                        ) : (
                          <div className="text-white/80 text-xs">Sprawdź produkty</div>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/90 text-gray-900 group-hover:bg-white">
                        Przejdź <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-3" />
        <CarouselNext className="-right-3" />
      </Carousel>
    </section>
  );
};

export default HomeCategories;
