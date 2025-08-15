"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ALL_BRANDS = [
  "JCB",
  "CAT",
  "Yanmar",
  "Volvo",
  "Bobcat",
  "Hitachi",
  "Atlas",
  "Hyundai",
  "Case",
  "John Deere",
  "Mecalac",
  "Kubota",
  "Liebherr",
  "Taeuchi",
];

const FloatingMachineSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lastBrand, setLastBrand] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const hideQuickTimer = useRef<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Don't show mobile sticky bar on product pages (they have their own sticky CTA)
  const isProductPage = pathname?.startsWith('/product/');

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => {
      if (window.location.hash === "#machine-finder") setOpen(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const m = url.searchParams.get("machine");
    const stored = window.localStorage.getItem("lastMachineBrand") || undefined;
    setLastBrand(m || stored || null);
    const t = window.setTimeout(() => setIsCollapsed(true), 5000);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_BRANDS;
    return ALL_BRANDS.filter((b) => b.toLowerCase().includes(q));
  }, [query]);

  const selectBrand = (brand: string) => {
    setOpen(false);
    // navigate to shop with machine filter
    const params = new URLSearchParams(window.location.search);
    params.set("machine", brand);
    router.push(`/shop?${params.toString()}`);
    try {
      window.localStorage.setItem("lastMachineBrand", brand);
      setLastBrand(brand);
    } catch {}
  };

  return (
    <>
      {/* Mobile: Sticky bottom bar - only show on non-product pages */}
      {!isProductPage && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] shadow-2xl border-t border-white/20">
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="px-4 py-3">
            <DialogTrigger asChild>
              <button
                aria-label="Dobierz do maszyny"
                className="w-full flex items-center justify-center gap-3 bg-white/95 hover:bg-white text-gray-900 font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Wrench className="h-5 w-5 text-[var(--color-brand-orange)]" />
                <span>Dobierz do swojej maszyny</span>
                <div className="ml-auto bg-[var(--color-brand-orange)] text-white text-xs font-bold px-2 py-1 rounded-full">
                  SZYBKO
                </div>
              </button>
            </DialogTrigger>
          </div>
        </Dialog>
        </div>
      )}

      {/* Desktop: Floating side button */}
      <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <div
            className="relative"
            onMouseEnter={() => {
              if (hideQuickTimer.current) window.clearTimeout(hideQuickTimer.current);
              setShowQuick(true);
            }}
            onMouseLeave={() => {
              if (hideQuickTimer.current) window.clearTimeout(hideQuickTimer.current);
              hideQuickTimer.current = window.setTimeout(() => setShowQuick(false), 240);
            }}
          >
            <DialogTrigger asChild>
              <div>
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <button
                        aria-label="Dobierz do maszyny"
                        onClick={() => setIsCollapsed(false)}
                        className={`group relative overflow-hidden inline-flex items-center justify-center border-2 border-[var(--color-brand-orange)]/30 shadow-xl backdrop-blur-sm transition-all duration-500 text-gray-900 ${
                          isCollapsed
                            ? "h-14 w-14 rounded-2xl bg-gradient-to-r from-white to-gray-50 hover:from-[var(--color-brand-orange)] hover:to-[var(--color-brand-red)] hover:text-white hover:scale-110"
                            : "h-16 w-20 rounded-2xl bg-gradient-to-r from-white to-gray-50 hover:from-[var(--color-brand-orange)] hover:to-[var(--color-brand-red)] hover:text-white hover:scale-105"
                        }`}
                      >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Icon */}
                        <Wrench className="relative z-10 h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        
                        {/* Floating badge */}
                        <div className="absolute -top-1 -right-1 bg-[var(--color-brand-red)] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                          NEW
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-900 border-0">
                      🔧 Dobierz do maszyny
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </DialogTrigger>
            {/* Quick brands popout on desktop; controlled to allow clicks */}
            <div
              className={`hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-2 ${
                showQuick ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              } transition-all duration-300`}
            >
              <div className="relative rounded-2xl border border-gray-200/50 bg-white shadow-2xl p-4 w-80">
                {/* Arrow */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white drop-shadow" />
                
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-4 w-4 text-[var(--color-brand-orange)]" />
                  <div className="text-sm font-bold text-gray-800">Szybki wybór marki</div>
                </div>
                
                <p className="text-xs text-gray-600 mb-4">Kliknij markę aby zobaczyć kompatybilne produkty w sklepie</p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["JCB", "CAT", "Volvo", "Kubota", "Bobcat", "Hitachi"].map((b) => (
                    <button
                      key={b}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectBrand(b);
                      }}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium bg-gradient-to-r from-gray-50 to-white hover:from-[var(--color-brand-orange)]/10 hover:to-[var(--color-brand-red)]/10 hover:border-[var(--color-brand-orange)]/30 transition-all duration-300 hover:shadow-md"
                    >
                      {b}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {lastBrand ? (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); selectBrand(lastBrand); }}
                      className="text-xs underline text-gray-600 hover:text-[var(--color-brand-orange)] transition-colors"
                    >
                      Ostatnio: {lastBrand}
                    </button>
                  ) : <span />}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); setShowQuick(false); }}
                    className="text-xs font-semibold text-[var(--color-brand-orange)] hover:underline transition-colors"
                  >
                    Zobacz wszystkie marki →
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Wybierz markę swojej maszyny</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Szukaj marki (np. JCB, CAT)" value={query} onChange={(e) => setQuery(e.target.value)} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-auto">
                {filtered.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => selectBrand(brand)}
                    className="w-full text-left px-3 py-2 rounded-md border bg-white hover:bg-gray-50 text-gray-800"
                  >
                    {brand}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="border-gray-300" onClick={() => setOpen(false)}>Anuluj</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default FloatingMachineSelector;


