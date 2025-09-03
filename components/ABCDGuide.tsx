"use client";

import Image from "next/image";
import React from "react";
import { Input } from "@/components/ui/input";
import useStore from "@/store";
import { Product } from "@/sanity.types";
import AddToCartButton from "./AddToCartButton";
import abcd_guide from "@/images/abcdGuide.jpeg";
import { Dialog, DialogContent } from "@/components/ui/dialog";
export default function ABCDGuide({ product, onChange }: { product?: Product; onChange?: (d: { A?: number; B?: number; C?: number; D?: number }) => void }) {
  const [fallback, setFallback] = React.useState(false);
  const [dims, setDims] = React.useState<{ A?: number; B?: number; C?: number; D?: number }>({});
  const { addConfiguredItem } = useStore();

  const update = (key: 'A'|'B'|'C'|'D', value: string) => {
    const num = value ? Number(value.replace(',', '.')) : undefined;
    const next = { ...dims, [key]: isNaN(Number(num)) ? undefined : num };
    setDims(next);
    onChange?.(next);
  };

  const [open, setOpen] = React.useState(false);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      <button type="button" onClick={() => setOpen(true)} className="relative w-full aspect-[3/2] sm:aspect-[4/3] bg-white border rounded-2xl overflow-hidden group cursor-zoom-in shadow-sm">
        {!fallback ? (
          <>
            <Image
              src={abcd_guide}
              alt="Jak zmierzyć mocowanie: A/B/C/D"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-3"
              onError={() => setFallback(true)}
            />
            <div className="absolute bottom-2 right-2 text-[11px] sm:text-xs bg-black/50 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">Powiększ</div>
          </>
        ) : (
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#f5f5f5" />
                <stop offset="100%" stopColor="#eaeaea" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="400" height="300" fill="url(#g)" />
          </svg>
        )}
      </button>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 content-start">
        {(['A','B','C','D'] as const).map((k) => (
          <div key={k} className="space-y-1">
            <div className="text-xs sm:text-sm font-medium text-gray-700">{k} (cm)</div>
            <Input inputMode="decimal" placeholder="np. 12.5" value={typeof dims[k] === 'number' ? String(dims[k]) : ''} onChange={(e) => update(k, e.target.value)} className="h-10 rounded-xl text-sm" />
          </div>
        ))}
        <div className="col-span-2 text-[11px] sm:text-xs text-gray-600">Podaj wymiary wg grafiki. Zapiszemy je przy pozycji w koszyku.</div>
        {product ? (
          <div className="col-span-2">
            <AddToCartButton product={product} extraConfiguration={{ dimensions: dims }} className="w-full" disabled={!dims.A || !dims.B || !dims.C || !dims.D} />
          </div>
        ) : null}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[96vw] max-w-5xl p-0">
          <div className="relative w-full h-[80vh] bg-white">
            <Image src={abcd_guide} alt="Jak zmierzyć mocowanie: A/B/C/D" fill sizes="100vw" className="object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


