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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {withProducts.map((category) => {
              const countText = pluralize((category as any)?.productCount as number);
              return (
                <Link key={category?._id} href={`/category/${category?.slug?.current}`} className="group relative overflow-hidden">
                  <div className="relative border border-gray-200/60 rounded-3xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50/30 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] p-4 flex items-center justify-between">
                    
                    {/* Floating shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    
                    {/* Animated border glow */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                         style={{
                           background: 'linear-gradient(45deg, transparent 30%, rgba(255,115,0,0.2) 50%, transparent 70%)',
                           mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                           maskComposite: 'xor',
                           padding: '2px'
                         }} />
                    
                    <div className="flex items-center gap-3 min-w-0 relative z-10">
                      <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 overflow-hidden border border-orange-200/30 shadow-inner">
                        {/* Premium background pattern */}
                        <div className="absolute inset-0 opacity-5" 
                             style={{
                               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
                               backgroundSize: '12px 12px'
                             }} />
                        
                        {(() => {
                          const categoryImage = getCategoryImage(category?.title);
                          const isRealImage = categoryImage !== excavatorIcon;
                          const isGrabie = category?.title?.toLowerCase().includes('grabie');
                          
                          return isRealImage ? (
                            <Image 
                              src={categoryImage} 
                              alt={`Zdjęcie ${category?.title}`} 
                              width={isGrabie ? 80 : 64} 
                              height={isGrabie ? 80 : 64} 
                              className={`${isGrabie ? 'object-contain' : 'object-cover'} w-full h-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1 ${isGrabie ? '' : 'rounded-xl'}`}
                            />
                          ) : (
                            <div className="w-10 h-10 transition-transform duration-500 group-hover:scale-110">
                              {getCategoryIcon(category?.title)}
                            </div>
                          );
                        })()}
                        
                        {/* Floating number badge */}
                        {countText && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border border-white transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                            {countText.replace(' produktów', '').replace(' produkty', '').replace(' produkt', '')}
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-base line-clamp-2 group-hover:text-[var(--color-brand-orange)] transition-all duration-300 leading-tight break-words mb-1"
                             style={{ 
                               wordBreak: 'keep-all',
                               overflowWrap: 'break-word',
                               hyphens: 'manual'
                             }}
                        >
                          {category?.title?.replace(/(\d+)([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ])/g, '$1 $2')}
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
                    
                    {/* Arrow indicator */}
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[var(--color-brand-orange)] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
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
