import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import { categoryIconFor } from "./CustomIcons";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
// Removed carousel for a denser grid layout
import excavatorIcon from "@/images/excavator.svg";
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
    <section className="my-6 md:my-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="uppercase tracking-widest text-[var(--color-brand-orange)] text-xs font-semibold mb-1">Hardox HB500</p>
          <Title className="!mb-0 text-2xl md:text-3xl">Popularne kategorie</Title>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-shop_dark_green hover:underline underline-offset-4">Zobacz wszystkie</Link>
      </div>
      {(() => {
        const withProducts = (categories || []).filter((c) => Number((c as any)?.productCount) > 0).slice(0, 12);
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {withProducts.map((category) => {
              const countText = pluralize((category as any)?.productCount as number);
              return (
                <Link key={category?._id} href={`/category/${category?.slug?.current}`} className="group block">
                  <div className="rounded-2xl border bg-white hover:shadow-lg hover:border-[var(--color-brand-orange)]/30 transition p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--color-brand-orange)]/10">
                        <Image src={excavatorIcon.src} alt="Ikona koparki" width={22} height={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm line-clamp-1 group-hover:text-[var(--color-brand-orange)] transition-colors">{category?.title}</div>
                        {countText ? (
                          <div className="text-gray-600 text-[11px]">{countText}</div>
                        ) : null}
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center size-7 rounded-full bg-gray-100 text-gray-900 group-hover:bg-[var(--color-brand-orange)] group-hover:text-white transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })()}
    </section>
  );
};

export default HomeCategories;
