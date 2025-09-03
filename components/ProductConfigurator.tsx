"use client";

import { useMemo, useState } from "react";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type WithMounts = Product & {
  mountSystems?: Array<{
    code?: string;
    title?: string;
    price?: number;
    drawingFile?: string; // legacy string
    drawingImageUrl?: string; // from GROQ
    drawingFileUrl?: string;  // from GROQ
    productRef?: Product | null;
  }>;
  drillBits?: Array<{
    title?: string;
    price?: number;
    productRef?: Product | null;
  }>;
};

export default function ProductConfigurator({ product }: { product: WithMounts }) {
  const { addItem, addConfiguredItem } = useStore();
  const [mountIndex, setMountIndex] = useState<number | null>(null);
  const [drillIndex, setDrillIndex] = useState<number | null>(null);

  const basePrice = useMemo(() => {
    const base = (product as any)?.basePrice;
    if (typeof base === "number" && base > 0) return base;
    return typeof product.price === "number" ? product.price : 0;
  }, [product]);

  const selectedMount = mountIndex != null ? product?.mountSystems?.[mountIndex] : undefined;
  const selectedDrill = drillIndex != null ? product?.drillBits?.[drillIndex] : undefined;

  const total = useMemo(() => {
    return (
      (basePrice || 0) +
      (selectedMount?.price || 0) +
      (selectedDrill?.price || 0)
    );
  }, [basePrice, selectedMount, selectedDrill]);

  const addConfiguredToCart = () => {
    addConfiguredItem(product, {
      mount: selectedMount ? { title: selectedMount.title, price: selectedMount.price } : undefined,
      drill: selectedDrill ? { title: selectedDrill.title, price: selectedDrill.price } : undefined,
    });
    toast.success("Dodano do koszyka (z konfiguracją)");
  };

  if (!product?.mountSystems?.length && !product?.drillBits?.length) return null;

  return (
    <div id="konfigurator" className="mt-6 space-y-5 border rounded-lg p-4 bg-white">
      <div>
        <div className="font-semibold mb-2">Dostępne systemy mocowania</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(product.mountSystems || []).map((m, idx) => (
            <button
              key={(m.title || "") + idx}
              type="button"
              onClick={() => setMountIndex(idx)}
              className={`text-left border rounded-md p-3 hover:border-[var(--color-brand-orange)] ${mountIndex === idx ? "border-[var(--color-brand-orange)] bg-orange-50" : "border-gray-200"}`}
            >
              <div className="font-medium">{m.code ? `[${m.code}] ` : ''}{m.title}</div>
              <div className="text-sm text-gray-600">{typeof m.price === "number" ? `${m.price} zł netto` : ""}</div>
              {(m.drawingImageUrl || m.drawingFileUrl || m.drawingFile) ? (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    <span>📄</span>
                    <span>PDF</span>
                  </span>
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">Dostępne wiertła</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(product.drillBits || []).map((d, idx) => (
            <button
              key={(d.title || "") + idx}
              type="button"
              onClick={() => setDrillIndex(idx)}
              className={`text-left border rounded-md p-3 hover:border-[var(--color-brand-orange)] ${drillIndex === idx ? "border-[var(--color-brand-orange)] bg-orange-50" : "border-gray-200"}`}
            >
              <div className="font-medium">{d.title}</div>
              <div className="text-sm text-gray-600">{typeof d.price === "number" ? `${d.price} zł netto` : ""}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">Suma konfiguracji</div>
        <div className="text-lg font-bold">{total} zł netto</div>
      </div>

      <Button onClick={addConfiguredToCart} className="w-full">Dodaj do koszyka z wybranymi opcjami</Button>
    </div>
  );
}


