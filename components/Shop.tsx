"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import { categoriesData } from "@/constants/data";
import Container from "./Container";
import CategoryList from "./shop/CategoryList";
import { useSearchParams } from "next/navigation";
// import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
// import { client } from "@/sanity/lib/client";
import { Filter } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Props {
  categories: Category[];
  brands?: BRANDS_QUERYResult;
}
const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const qParam = searchParams?.get("q") || "";
  const machineParam = searchParams?.get("machine") || "";
  // const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  // Removed brand filter from UI and logic
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [q, setQ] = useState(qParam);
  const [sort, setSort] = useState<
    "new" | "price-asc" | "price-desc" | "popular" | "featured"
  >("new");
  const [viewing, setViewing] = useState<number>(Math.floor(8 + Math.random() * 12));
  const [sidebarCategories, setSidebarCategories] = useState<Array<any>>(
    () => categoriesData.map((c) => ({ _id: `virtual-${c.href}`, title: c.title, slug: { current: c.href }, productCount: 0 }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setViewing((v) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = Math.min(40, Math.max(5, v + delta));
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Use server API then filter client-side to avoid client token/CORS issues
      const res = await fetch('/api/products', { cache: 'no-store' });
      const body = await res.json();
      type ApiProduct = { _id: string; name?: string; description?: string; price?: number | string; basePrice?: number | string; priceNet?: number | string; pricing?: { priceNet?: number | string }; priceTier?: string; categories?: { slug?: string }[]; brand?: { slug?: string; _ref?: string }; featuredRank?: number };
      const all: ApiProduct[] = Array.isArray(body?.data) ? body.data : [];
      const toNumber = (v: unknown): number => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') {
          const n = parseFloat(v.replace(/[^0-9.,-]/g, '').replace(',', '.'));
          return Number.isFinite(n) ? n : 0;
        }
        return 0;
      };
      const getNet = (p: ApiProduct): number => {
        return toNumber(p?.pricing?.priceNet) || toNumber(p?.priceNet) || toNumber(p?.basePrice) || toNumber(p?.price);
      };
      // Build a list for counters that ignores selectedCategory but respects other filters
      const [min, max] = selectedPrice ? selectedPrice.split('-').map((x) => Number(x)) : [undefined, undefined];
      let listForCounters: ApiProduct[] = [...all];
      if (typeof min === 'number' && !Number.isNaN(min)) listForCounters = listForCounters.filter((p) => getNet(p) >= min);
      if (typeof max === 'number' && !Number.isNaN(max)) listForCounters = listForCounters.filter((p) => getNet(p) <= max);
      if (q) {
        const needle = q.toLowerCase();
        listForCounters = listForCounters.filter((p) => String(p.name ?? '').toLowerCase().includes(needle) || String(p.description ?? '').toLowerCase().includes(needle) || String(p.priceTier ?? '').toLowerCase().includes(needle));
      }
      if (machineParam) {
        const mNeedle = machineParam.toLowerCase();
        listForCounters = listForCounters.filter((p: any) => Array.isArray(p?.specifications?.machineCompatibility) && p.specifications.machineCompatibility.some((m: string) => String(m).toLowerCase().includes(mNeedle)));
      }
      // Now derive the actual product list, applying selectedCategory on top of other filters
      let list: ApiProduct[] = [...listForCounters];
      if (selectedCategory) list = list.filter((p) => p?.categories?.some((c) => c?.slug === selectedCategory));
      // sort
      if (sort === 'price-asc') list.sort((a, b) => getNet(a) - getNet(b));
      if (sort === 'price-desc') list.sort((a, b) => getNet(b) - getNet(a));
      if (sort === 'featured') list.sort((a, b) => (Number(a.featuredRank) || 9999) - (Number(b.featuredRank) || 9999));
      setProducts(list as Product[]);
      try {
        const counts: Record<string, number> = {};
        for (const cat of categoriesData) counts[cat.href] = 0;
        for (const p of listForCounters as any[]) {
          const cats = Array.isArray(p?.categories) ? p.categories : [];
          for (const c of cats) {
            const slug = typeof c?.slug === 'string' ? c.slug : c?.slug?.current;
            if (slug && slug in counts) counts[slug] += 1;
          }
        }
        setSidebarCategories(categoriesData.map((c) => ({ _id: `virtual-${c.href}`, title: c.title, slug: { current: c.href }, productCount: counts[c.href] || 0 })));
      } catch {}
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedPrice, sort, q, machineParam]);

  useEffect(() => {
    setQ(qParam);
    // Trigger refetch when URL q changes
  }, [qParam]);
  return (
    <div className="border-t">
      <Container className="mt-5">
        {/* Page Header */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sklep z osprzętem</h1>
              <p className="text-sm text-gray-700">Hardox HB500 • Dostawa 48 h • Gwarancja 2 lata</p>
            </div>
            <span className="text-xs text-gray-500">{viewing} osób przegląda teraz</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {machineParam && (
              <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-gray-100 border text-gray-800">
                Dopasowane do: <strong className="font-semibold">{machineParam}</strong>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-gray-100 border text-gray-800">
                Kategoria: <strong className="font-semibold">{selectedCategory}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Search + modern sorting */}
        <div className="mb-4 space-y-4">
          {/* Search bar */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <Input 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                placeholder="Szukaj: np. łyżka 60 cm ms03" 
                className="flex-1"
              />
              <button 
                onClick={() => fetchProducts()} 
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Szukaj
              </button>
            </div>
          </div>

          {/* Modern sorting chips */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Sortuj:</span>
              <div className="flex gap-2 flex-wrap">
                {([
                  { label: "✨ Nowości", value: "new" },
                  { label: "💰 Cena ↑", value: "price-asc" },
                  { label: "💰 Cena ↓", value: "price-desc" },
                  { label: "⭐ Polecane", value: "featured" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      sort === opt.value 
                        ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] text-white shadow-md scale-105" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

          {/* Quick machine tier selection */}
          <div className="mb-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                🚜 Szybki wybór wg wagi maszyny
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "1–1.5 t", value: "1-1.5t" },
                  { label: "1.5–2.3 t", value: "1.5-2.3t" },
                  { label: "2.3–3 t", value: "2.3-3t" },
                  { label: "3–5 t", value: "3-5t" },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setQ(t.value);
                      fetchProducts();
                    }}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-[var(--color-brand-orange)] hover:to-[var(--color-brand-red)] hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        <Separator className="mb-4" />

        {/* Mobile: improved filters */}
        <div className="md:hidden mb-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="filters" className="border rounded-xl bg-white">
              <AccordionTrigger className="px-3 py-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10">
                      <Filter className="h-4 w-4 text-[var(--color-brand-orange)]" />
                    </div>
                    <span className="font-semibold text-gray-900">Filtry</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border border-[var(--color-brand-orange)]/30 text-[var(--color-brand-orange)] bg-white">
                    ✨ Dotknij, aby filtrować
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      📂 Kategorie
                    </h4>
                    <CategoryList
                      categories={sidebarCategories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      💰 Cena
                    </h4>
                    <PriceList
                      setSelectedPrice={setSelectedPrice}
                      selectedPrice={selectedPrice}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => fetchProducts()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex-1"
                    >
                      Zastosuj filtry
                    </button>
                    {(selectedCategory !== null || selectedPrice !== null) && (
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedPrice(null);
                        }}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all duration-200"
                      >
                        Wyczyść
                      </button>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="hidden md:block md:flex-none md:basis-1/3 lg:basis-1/4 xl:basis-1/5 md:min-w-[220px] md:max-w-[360px] md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto pb-3 md:border-r border-r-shop_btn_dark_green/50 nice-scrollbar space-y-3">
            {/* Filters Header */}
            <div className="bg-gradient-to-r from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[var(--color-brand-orange)]/20 to-[var(--color-brand-red)]/20">
                  <Filter className="h-5 w-5 text-[var(--color-brand-orange)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Filtry</h3>
                  <p className="text-xs text-gray-600">Znajdź idealny osprzęt</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => fetchProducts()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Zastosuj
                </button>
                {(selectedCategory !== null || selectedPrice !== null) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedPrice(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Wyczyść
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  📂 Kategorie
                </h4>
                <CategoryList
                  categories={sidebarCategories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  💰 Cena
                </h4>
                <PriceList
                  setSelectedPrice={setSelectedPrice}
                  selectedPrice={selectedPrice}
                />
              </div>
            </div>
          </div>
           <div className="flex-1 pt-5">
            <div className="mb-3 text-sm text-gray-600">Znaleziono: <span className="font-semibold">{products?.length || 0}</span> produktów</div>
            <div className="md:h-[calc(100vh-160px)] md:overflow-y-auto pr-2 nice-scrollbar">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-3xl border bg-white p-6 animate-pulse h-80 shadow-lg" />
                  ))}
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
                  {products?.map((product) => (
                    <div key={product?._id} className="h-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
