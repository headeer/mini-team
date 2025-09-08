"use client";

import React from "react";
import { Product } from "@/sanity.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AddToCartButton from "./AddToCartButton";
import ABCDGuide from "./ABCDGuide";

type WithTeeth = Product & { 
  toothCost?: number; 
  teethEnabled?: boolean;
  addTeeth?: boolean;
  onTeethChange?: (enabled: boolean) => void;
};

export default function BucketConfigurator({ product }: { product: WithTeeth }) {
  const [dims, setDims] = React.useState<{ A?: number; B?: number; C?: number; D?: number }>({});
  const [hasQuickCouplerChoice, setHasQuickCouplerChoice] = React.useState<'yes'|'no'>('yes');
  const [fixedPins, setFixedPins] = React.useState<boolean>(false);
  // Usuwamy pola kinetyka/ramię/sworzeń (A/B/C/D zastępują te wielkości)
  const [addTeeth, setAddTeeth] = React.useState<boolean>(product.addTeeth || false);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [photoAssetId, setPhotoAssetId] = React.useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  // Sync with parent teeth state
  React.useEffect(() => {
    if (product.addTeeth !== undefined && product.addTeeth !== addTeeth) {
      setAddTeeth(product.addTeeth);
    }
  }, [product.addTeeth, addTeeth]);

  // Notify parent of teeth state changes
  React.useEffect(() => {
    if (product.onTeethChange) {
      product.onTeethChange(addTeeth);
    }
  }, [addTeeth, product.onTeethChange]);

  const totalExtras = React.useMemo(() => (addTeeth ? (product?.toothCost || 0) : 0), [addTeeth, product?.toothCost]);
  const standardCouplerCodes = React.useMemo(() => {
    const codes = Array.isArray((product as any)?.mountSystems)
      ? ((product as any).mountSystems.map((m: any) => (m?.code || '') as string).filter(Boolean))
      : [];
    const unique = Array.from(new Set(codes.map((c: string) => c.toUpperCase())));
    return unique.length > 0 ? unique : ['MS01', 'MS03', 'CW05', 'CW10'];
  }, [product]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;
    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('file', photoFile);
      const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
      const json = await res.json();
      if (json?.ok && json?.assetId) {
        setPhotoAssetId(json.assetId as string);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-3 bg-white">
      <div className="text-sm text-gray-700">Wypełnij dane, abyśmy dobrali właściwe mocowanie.</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label>Posiadasz szybkozłącze?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-gray-500 underline cursor-help">i</span>
                </TooltipTrigger>
                <TooltipContent>Jeśli tak, wybierz mocowanie pod szybkozłącze. Gdy nie – rozważ sworznie na stałe, by ograniczyć koszt sworzni.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup value={hasQuickCouplerChoice} onValueChange={(v) => setHasQuickCouplerChoice((v as any) || 'yes')} className="flex items-center gap-4 text-sm">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="yes" id="qc-yes" className="w-6 h-6 sm:w-5 sm:h-5" />
              Tak
            </label>
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="no" id="qc-no" className="w-6 h-6 sm:w-5 sm:h-5" />
              Nie
            </label>
          </RadioGroup>
          {hasQuickCouplerChoice === 'yes' ? (
            <div className="mt-2 text-sm">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <Checkbox 
                  checked={fixedPins} 
                  onCheckedChange={(v) => setFixedPins(Boolean(v))} 
                  className="w-6 h-6 sm:w-5 sm:h-5"
                />
                Zastosuj sworznie na stałe (opcjonalnie)
              </label>
            </div>
          ) : null}
        </div>
        <div className="p-3 border rounded-lg bg-gray-50 space-y-2">
          <div className="text-xs font-medium text-gray-700">Standardowe mocowania (szybkozłącze)</div>
          <div className="flex flex-wrap items-center gap-2">
            {standardCouplerCodes.map((code) => (
              <span key={code} className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-white text-gray-900">
                {code}
              </span>
            ))}
          </div>
          <div className="text-[11px] text-gray-500">Pasujące pod szybkozłącze. W razie wątpliwości wyślij zdjęcie uchwytu.</div>
        </div>
      </div>

      {/* Usunięto pola kinetyka/ramię/sworzeń – użytkownik poda A/B/C/D poniżej */}

      <div className="space-y-2">
        <div className="text-xs uppercase text-gray-500">Wymiary mocowania (A/B/C/D)</div>
        <ABCDGuide onChange={(d) => setDims(d)} />
      </div>

      <div className="p-3 border rounded-lg bg-gray-50 space-y-2">
        <div className="text-xs font-medium text-gray-700">Zdjęcie uchwytu (opcjonalne)</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
          <div className="sm:col-span-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-gray-700 border border-gray-200 rounded-md"
            />
            <div className="text-[11px] text-gray-500 mt-1">Dodaj zdjęcie uchwytu szybkozłącza, jeśli nie jesteś pewien kodu.</div>
          </div>
          <div>
            {photoPreview ? (
              <img src={photoPreview} alt="Podgląd" className="w-full h-24 object-cover rounded-md border" />
            ) : (
              <div className="w-full h-24 rounded-md border bg-white text-[11px] flex items-center justify-center text-gray-400">Brak zdjęcia</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={uploadPhoto}
            disabled={!photoFile || isUploading}
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)] text-white text-sm font-semibold px-4 py-2 disabled:opacity-50"
          >
            {isUploading ? 'Wysyłam...' : (photoAssetId ? 'Wysłano ✅' : 'Wyślij do nas')}
          </button>
          {photoAssetId ? <span className="text-xs text-green-700">Zapisano w systemie</span> : null}
        </div>
      </div>

      {product?.teethEnabled ? (
        <label className="inline-flex items-center gap-2 text-sm">
          <Checkbox checked={addTeeth} onCheckedChange={(v) => setAddTeeth(Boolean(v))} />
          Doposażenie w zęby {typeof product.toothCost === 'number' ? `(+${product.toothCost} zł netto)` : ''}
        </label>
      ) : null}

      <div className="pt-2">
        <AddToCartButton 
          product={product}
          extraConfiguration={{ dimensions: dims, photoAssetId, teeth: addTeeth ? { enabled: true, price: product?.toothCost } : undefined }}
          className="w-full"
          disabled={!dims.A || !dims.B || !dims.C || !dims.D}
        />
        {totalExtras > 0 && (
          <div className="text-xs text-gray-600 mt-1">Cena + dopłaty: +{totalExtras} zł netto (zęby)</div>
        )}
      </div>
    </div>
  );
}


