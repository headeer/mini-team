import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
import { categoryIconFor } from "./CustomIcons";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
// Import real product images for categories
import excavatorIcon from "@/images/excavator.svg";
import grabie100cm from "@/images/grabie/grabie_100cm_grubosc_zeba-removebg-preview.png";
import grabie120cm from "@/images/grabie/grabie_120cm-removebg-preview.png";
import lyzkaKopiaca from "@/images/lyzki_kopiace/lyzka-kopiaca-30cm-01.webp";
import lyzkaSkarpowa from "@/images/lyzki_kopiace/lyzka-skarpowa-80cm-01.webp";
const HomeCategories = ({ categories }: { categories: Category[] }) => {
  const pluralize = (n?: number) => {
    if (!n || n <= 0) return null;
    if (n === 1) return "1 produkt";
    const last = n % 10;
    const lastTwo = n % 100;
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return `${n} produkty`;
    return `${n} produktów`;
  };

  const getCategoryImage = (title?: string) => {
    const t = (title || "").toLowerCase();
    // Specific Grabie variants
    if (/grabie.*100cm.*12mm/.test(t)) return grabie100cm;
    if (/grabie.*100cm.*15mm/.test(t)) return grabie100cm;
    if (/grabie.*120cm.*12mm/.test(t)) return grabie120cm;
    if (/grabie.*120cm.*15mm/.test(t)) return grabie120cm;
    // General Grabie categories
    if (/grabie.*100cm/.test(t)) return grabie100cm;
    if (/grabie.*120cm/.test(t) || /grabie/.test(t)) return grabie120cm;
    // Other categories
    if (/skarpow/.test(t)) return lyzkaSkarpowa;
    if (/łyżk|lyzk|kopi/.test(t)) return lyzkaKopiaca;
    return excavatorIcon;
  };

  const getCategoryIcon = (title?: string) => {
    const IconComponent = categoryIconFor(title);
    return <IconComponent className="w-5 h-5 text-[var(--color-brand-orange)]" />;
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
                      <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-[var(--color-brand-orange)]/10 overflow-hidden">
                        {(() => {
                          const categoryImage = getCategoryImage(category?.title);
                          const isRealImage = categoryImage !== excavatorIcon;
                          const isGrabie = category?.title?.toLowerCase().includes('grabie');
                          
                          return isRealImage ? (
                            <Image 
                              src={categoryImage} 
                              alt={`Zdjęcie ${category?.title}`} 
                              width={isGrabie ? 64 : 56} 
                              height={isGrabie ? 64 : 56} 
                              className={`${isGrabie ? 'object-contain' : 'object-cover'} w-full h-full ${isGrabie ? '' : 'rounded-lg'}`}
                            />
                          ) : (
                            <div className="w-8 h-8">{getCategoryIcon(category?.title)}</div>
                          );
                        })()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm line-clamp-2 group-hover:text-[var(--color-brand-orange)] transition-colors leading-tight break-words"
                             style={{ 
                               wordBreak: 'keep-all',
                               overflowWrap: 'break-word',
                               hyphens: 'manual'
                             }}
                        >
                          {category?.title?.replace(/(\d+)([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ])/g, '$1 $2')}
                        </div>
                        {countText ? (
                          <div className="text-gray-600 text-[11px] mt-1">{countText}</div>
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
