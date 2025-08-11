"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
    <div className="fixed left-3 md:left-4 bottom-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50">
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
                      className={`inline-flex items-center justify-center border shadow-lg backdrop-blur-sm transition text-gray-900 ${
                        isCollapsed
                          ? "h-11 w-11 rounded-full bg-white/95 hover:bg-white"
                          : "h-12 w-14 md:w-auto md:px-4 md:py-3 rounded-full md:rounded-md bg-white/95 hover:bg-white"
                      }`}
                    >
                      <Wrench className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    Dobierz do maszyny
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogTrigger>
          {/* Quick brands popout on desktop; controlled to allow clicks */}
          <div
            className={`hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-2 ${
              showQuick ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            } transition`}
          >
            <div className="relative rounded-xl border bg-white shadow-2xl p-3 w-72">
              {/* Arrow */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white drop-shadow" />
              <div className="text-xs font-semibold text-gray-700 mb-1">Szybki wybór marki</div>
              <p className="text-[11px] text-gray-600 mb-2">Kliknij markę – sklep pokaże kompatybilne produkty.</p>
              <div className="grid grid-cols-3 gap-2">
                {["JCB", "CAT", "Volvo", "Kubota", "Bobcat", "Hitachi"].map((b) => (
                  <button
                    key={b}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectBrand(b);
                    }}
                    className="px-2.5 py-1.5 rounded-md border text-xs bg-gray-50 hover:bg-gray-100 hover:ring-1 hover:ring-gray-300"
                  >
                    {b}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                {lastBrand ? (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); selectBrand(lastBrand); }}
                    className="text-[11px] underline text-gray-700 hover:text-gray-900"
                  >
                    Ostatnio: {lastBrand}
                  </button>
                ) : <span />}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); setShowQuick(false); }}
                  className="text-[11px] font-medium text-[var(--color-brand-orange)] hover:underline"
                >
                  Pokaż wszystkie
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
  );
};

export default FloatingMachineSelector;


