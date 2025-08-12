"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import CategoryList from "./shop/CategoryList";
import { useSearchParams } from "next/navigation";
// import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
// import { client } from "@/sanity/lib/client";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      type ApiProduct = { _id: string; name?: string; description?: string; price?: number | string; basePrice?: number; priceTier?: string; categories?: { slug?: string }[]; brand?: { slug?: string; _ref?: string } };
      let list: ApiProduct[] = Array.isArray(body?.data) ? body.data : [];
      // filter
      const [min, max] = selectedPrice ? selectedPrice.split('-').map(Number) : [undefined, undefined];
      if (selectedCategory) list = list.filter((p) => p?.categories?.some((c) => c?.slug === selectedCategory));
      // brand filter removed
      const numeric = (v: unknown) => (typeof v === 'number' ? v : 0);
      if (typeof min === 'number') list = list.filter((p) => (p.basePrice ?? numeric(p.price)) >= min);
      if (typeof max === 'number') list = list.filter((p) => (p.basePrice ?? numeric(p.price)) <= max);
      if (q) {
        const needle = q.toLowerCase();
        list = list.filter((p) => String(p.name ?? '').toLowerCase().includes(needle) || String(p.description ?? '').toLowerCase().includes(needle) || String(p.priceTier ?? '').toLowerCase().includes(needle));
      }
      if (machineParam) {
        const mNeedle = machineParam.toLowerCase();
        list = list.filter((p: any) => Array.isArray(p?.specifications?.machineCompatibility) && p.specifications.machineCompatibility.some((m: string) => String(m).toLowerCase().includes(mNeedle)));
      }
      // sort
      const toNum = (v: unknown): number => (typeof v === 'number' ? v : 0);
      if (sort === 'price-asc') list.sort((a, b) => toNum(a.basePrice ?? a.price) - toNum(b.basePrice ?? b.price));
      if (sort === 'price-desc') list.sort((a, b) => toNum(b.basePrice ?? b.price) - toNum(a.basePrice ?? a.price));
      if (sort === 'featured') list.sort((a, b) => (a.featuredRank ?? 9999) - (b.featuredRank ?? 9999));
      setProducts(list as Product[]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        {/* Search + sort + quick tiers */}
        <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-white p-3 rounded-lg border">
          <div className="flex items-center gap-2 w-full md:max-w-md">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Szukaj: np. łyżka 60 cm ms03" />
            <button onClick={() => fetchProducts()} className="px-3 py-2 rounded-md bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white text-sm font-medium">Szukaj</button>
          </div>
           <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sortuj:</span>
            <div className="inline-flex rounded-md border overflow-hidden">
              {([
                { label: "Nowości", value: "new" },
                { label: "Cena ↑", value: "price-asc" },
                { label: "Cena ↓", value: "price-desc" },
                { label: "Polecane", value: "featured" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 text-sm ${sort === opt.value ? "bg-[var(--color-brand-orange)] text-white" : "bg-white hover:bg-gray-50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

          <div className="mb-4 flex flex-wrap gap-2">
          {[
            { label: "1–1.5 t", value: "1-1.5t" },
            { label: "1.5–2.3 t", value: "1.5-2.3t" },
            { label: "2.3–3 t", value: "2.3-3t" },
            { label: "3–5 t", value: "3-5t" },
          ].map((t) => (
            <Badge
              key={t.value}
              onClick={() => {
                // reuse category filter via search by priceTier in query text
                setQ(t.value);
                fetchProducts();
              }}
              className="hover:cursor-pointer bg-gray-100 text-gray-800 border hover:bg-gray-200"
            >
              {t.label}
            </Badge>
          ))}
        </div>
        <Separator className="mb-4" />

        {/* Mobile: collapsible filters (closed by default) */}
        <div className="md:hidden mb-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="filters" className="border rounded-md bg-white">
              <AccordionTrigger className="px-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[var(--color-brand-orange)]" />
                  <span className="font-semibold text-gray-900">Filtry produktów</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3">
                <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                  <div className="p-3">
                    <CategoryList
                      categories={categories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  </div>
                </div>
                <div className="rounded-md border bg-white shadow-sm overflow-hidden mt-3">
                  <div className="p-3">
                    <PriceList
                      setSelectedPrice={setSelectedPrice}
                      selectedPrice={selectedPrice}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => fetchProducts()}
                    className="px-3 py-1.5 rounded-md bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white text-sm font-medium w-full"
                  >
                    Zastosuj
                  </button>
                  {(selectedCategory !== null || selectedPrice !== null) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedPrice(null);
                      }}
                      className="px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-gray-50 w-full"
                    >
                      Wyczyść
                    </button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="hidden md:block md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-72 pb-3 md:border-r border-r-shop_btn_dark_green/50 nice-scrollbar space-y-3">
            {/* Filters Header */}
            <div className="bg-gradient-to-r from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 border rounded-md p-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[var(--color-brand-orange)]" />
                <h3 className="font-semibold text-gray-900">Filtry produktów</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">Znajdź idealny osprzęt dla swojej koparki</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => fetchProducts()}
                  className="px-3 py-1.5 rounded-md bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white text-sm font-medium"
                >
                  Zastosuj filtry
                </button>
                {(selectedCategory !== null || selectedPrice !== null) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedPrice(null);
                    }}
                    className="px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-gray-50"
                  >
                    Wyczyść
                  </button>
                )}
              </div>
            </div>
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
              <div className="p-3">
                <CategoryList
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            </div>
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
              <div className="p-3">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl border bg-white p-3 animate-pulse h-64" />
                  ))}
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products?.map((product) => (
                    <div key={product?._id} className="h-full">
                      <ProductCard product={product} activeMachine={machineParam || undefined} />
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
