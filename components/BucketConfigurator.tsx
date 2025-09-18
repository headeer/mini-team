"use client";

import React from "react";
import { Product } from "@/sanity.types";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import ABCDGuide from "./ABCDGuide";

// Static thumbnails (PNG) from src/images
import Mini_CW05 from "@/images/mocowania/Miniaturka_CW05-1.png";
import Mini_HS02 from "@/images/mocowania/Miniaturka_HS02-1.png";
import Mini_HS03 from "@/images/mocowania/Miniaturka_HS03-1.png";
import Mini_Ms01 from "@/images/mocowania/Miniaturka_Ms01-1.png";
import Mini_Ms03 from "@/images/mocowania/Miniaturka_Ms03-1.png";
import Mini_S30150 from "@/images/mocowania/Miniaturka_S30-150-1.png";
import Mini_S30180 from "@/images/mocowania/Miniaturka_S30-180-1.png";
import Mini_S40 from "@/images/mocowania/Miniaturka_S40-1.png";

// Static detail PNGs from src/images
import Det_CW05 from "@/images/mocowania/png/Mocowanie_CW05-1.png";
import Det_HS02 from "@/images/mocowania/png/Mocowanie_HS02-1.png";
import Det_HS03 from "@/images/mocowania/png/Mocowanie_Hs03-1.png";
import Det_Ms01 from "@/images/mocowania/png/Mocowanie_Ms01-1.png";
import Det_Ms03 from "@/images/mocowania/png/Mocowanie_Ms03-1.png";
import Det_S30150 from "@/images/mocowania/png/Mocowanie_S30-150-1.png";
import Det_S30180 from "@/images/mocowania/png/Mocowanie_S30-180-1.png";
import Det_S40 from "@/images/mocowania/png/Mocowanie_S40-1.png";

 type WithTeeth = Product & { 
  toothCost?: number; 
  teethEnabled?: boolean;
  addTeeth?: boolean;
  onTeethChange?: (enabled: boolean) => void;
};

export default function BucketConfigurator({ product }: { product: WithTeeth }) {
  const [dims, setDims] = React.useState<{ A?: number; B?: number; C?: number; D?: number }>({});
  const [brandModel, setBrandModel] = React.useState<string>("");
  const [machineWeight, setMachineWeight] = React.useState<string>("");
  const [hasQuickCouplerChoice, setHasQuickCouplerChoice] = React.useState<'yes'|'no'>('yes');
  const [fixedPins, setFixedPins] = React.useState<boolean>(false);
  // Usuwamy pola kinetyka/ramię/sworzeń (A/B/C/D zastępują te wielkości)
  const [addTeeth, setAddTeeth] = React.useState<boolean>(product.addTeeth || false);
  const [selectedMount, setSelectedMount] = React.useState<string | 'INNE' | undefined>(undefined);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [photoAssetId, setPhotoAssetId] = React.useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const hasQC = hasQuickCouplerChoice === 'yes';
  const [previewCode, setPreviewCode] = React.useState<string | null>(null);

  // Prefill machine weight (t) from product name like "3-5t" or "5 t"
  React.useEffect(() => {
    if (machineWeight) return;
    const name: string = String((product as any)?.name || "");
    const rangeMatch = name.match(/(\d+[\.,]?\d*)\s*[-–]\s*(\d+[\.,]?\d*)\s*t/i);
    const singleMatch = name.match(/(\d+[\.,]?\d*)\s*t/i);
    if (rangeMatch) {
      const val = `${rangeMatch[1].replace(',', '.')}–${rangeMatch[2].replace(',', '.')}`;
      setMachineWeight(val);
      return;
    }
    if (singleMatch) {
      const val = singleMatch[1].replace(',', '.');
      setMachineWeight(val);
    }
  }, [product, machineWeight]);

  // Exact filename tokens provided by user for thumbnails and PNG details
  const TOKENS: Record<string, { thumb: any; detailToken: string; detailStatic?: any }> = React.useMemo(() => ({
    CW05: { thumb: Mini_CW05, detailToken: "CW05", detailStatic: Det_CW05 },
    HS02: { thumb: Mini_HS02, detailToken: "HS02", detailStatic: Det_HS02 },
    HS03: { thumb: Mini_HS03, detailToken: "Hs03", detailStatic: Det_HS03 },
    MS01: { thumb: Mini_Ms01, detailToken: "Ms01", detailStatic: Det_Ms01 },
    MS03: { thumb: Mini_Ms03, detailToken: "Ms03", detailStatic: Det_Ms03 },
    "S30-150": { thumb: Mini_S30150, detailToken: "S30-150", detailStatic: Det_S30150 },
    "S30-180": { thumb: Mini_S30180, detailToken: "S30-180", detailStatic: Det_S30180 },
    S40: { thumb: Mini_S40, detailToken: "S40", detailStatic: Det_S40 },
  }), []);

  const MountThumb: React.FC<{ code: string }> = ({ code }) => {
    const entry = TOKENS[code];
    if (!entry) {
      return <span className="text-xs text-gray-500">{code}</span>;
    }
    return (
      <Image src={entry.thumb} alt={`Mocowanie ${code}`} className="h-full w-full object-contain p-2" />
    );
  };

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
        {/* Machine brand/model & weight (product page) */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">Marka maszyny – Model</div>
          <input
            type="text"
            className="block w-full text-sm text-gray-900 border border-gray-200 rounded-md px-3 py-2"
            placeholder="np. JCB 3CX / Kubota KX057"
            value={brandModel}
            onChange={(e) => setBrandModel(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">Waga maszyny (t)</div>
          <input
            type="text"
            className="block w-full text-sm text-gray-900 border border-gray-200 rounded-md px-3 py-2"
            placeholder="np. 3–5"
            value={machineWeight}
            onChange={(e) => setMachineWeight(e.target.value)}
          />
        </div>
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
        {hasQC ? (
          <div className="sm:col-span-2 p-3 border rounded-lg bg-gray-50 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-gray-700">Standardowe mocowania – pasujące do szybkozłączy</div>
                <div className="text-[11px] text-gray-500">Nazwy systemów szybkozłączy (np. CW, HS, MS, S) użyte wyłącznie w celach identyfikacyjnych. Wybierz kod mocowania; w razie wątpliwości kliknij „Inne” i podaj wymiary.</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {["CW05","HS02","HS03","MS01","MS03","S30-150","S30-180","S40"].map((code) => (
                <div
                  key={code}
                  className={`group relative border rounded-lg bg-white overflow-hidden hover:shadow-md transition ${selectedMount===code? 'ring-2 ring-[var(--color-brand-orange)]' : 'border-gray-200'}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedMount(code)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedMount(code); } }}
                  title="Wybierz mocowanie"
                >
                  <div className="aspect-video bg-gray-50 flex items-center justify-center">
                    <MountThumb code={code} />
                  </div>
                  <div className="px-3 py-2">
                    <div className="font-medium text-sm">Mocowanie {code}</div>
                    <a
                      href="#"
                      className="text-[11px] text-gray-500 underline underline-offset-2 hover:text-gray-700"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewCode(code); }}
                    >
                      Zobacz rysunek
                    </a>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSelectedMount('INNE')}
                className={`border rounded-lg bg-white px-3 py-3 text-left hover:shadow-md transition ${selectedMount==='INNE'? 'ring-2 ring-[var(--color-brand-orange)]' : 'border-gray-200'}`}
              >
                <div className="font-medium text-sm">Inne (Nie wiem jakie posiadam)</div>
                <div className="text-[11px] text-gray-500">Wprowadź wymiary i/lub dodaj zdjęcie uchwytu</div>
              </button>
            </div>

            <Dialog open={Boolean(previewCode)} onOpenChange={(o)=>{ if (!o) setPreviewCode(null); }}>
              <DialogContent className="w-[96vw] max-w-3xl p-0">
                <DialogTitle>Rysunek mocowania {previewCode || ''}</DialogTitle>
                <DialogDescription>Podgląd obrazka mocowania. Możesz pobrać obraz PNG lub plik PDF.</DialogDescription>
                {previewCode ? (
                  (() => {
                    const token = TOKENS[previewCode]?.detailToken || (previewCode as string);
                    const staticImg = TOKENS[previewCode]?.detailStatic as any | undefined;
                    const primary = `/mocowania/png/Mocowanie_${token}-1.png`;
                    const secondary = `/mocowania/Mocowanie_${token}-1.png`;
                    const tertiary = `/mocowania/Miniaturka_${token}-1.png`;
                    const pngHref = (staticImg && (staticImg as any).src) || primary;
                    const pdfHref = `/mocowania/Mocowanie_${token}.pdf`;
                    return (
                      <div className="w-full">
                        {staticImg ? (
                          <Image src={staticImg} alt={`Mocowanie ${previewCode}`} className="w-full h-auto" />
                        ) : (
                          <img
                            src={primary}
                            alt={`Mocowanie ${previewCode}`}
                            className="w-full h-auto"
                            data-attempt="0"
                            onError={(e) => {
                              const el = e.currentTarget as HTMLImageElement & { dataset: { attempt?: string } };
                              const attempt = Number(el.dataset.attempt || '0');
                              if (attempt === 0) {
                                el.dataset.attempt = '1';
                                el.src = secondary;
                              } else if (attempt === 1) {
                                el.dataset.attempt = '2';
                                el.src = tertiary;
                              } else {
                                el.replaceWith(Object.assign(document.createElement('div'), {
                                  className: 'p-6 text-sm text-gray-600',
                                  innerText: 'Nie udało się załadować obrazka. Użyj przycisku poniżej, aby pobrać PDF.',
                                }));
                              }
                            }}
                          />
                        )}
                        <div className="p-3 flex items-center justify-end gap-3">
                          <a
                            href={pngHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold px-3 py-2"
                          >
                            Pobierz PNG
                          </a>
                          <a
                            href={pdfHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center rounded-md bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)] text-white text-xs font-semibold px-3 py-2"
                          >
                            Pobierz PDF
                          </a>
                        </div>
                      </div>
                    );
                  })()
                ) : null}
              </DialogContent>
            </Dialog>
          </div>
        ) : null}
      </div>

      {/* Usunięto pola kinetyka/ramię/sworzeń – użytkownik poda A/B/C/D poniżej */}

      {(!hasQC || selectedMount === 'INNE') ? (
        <div className="space-y-2">
          <div className="text-xs uppercase text-gray-500">Wymiary mocowania (A/B/C/D)</div>
          <ABCDGuide onChange={(d) => setDims(d)} />
        </div>
      ) : null}

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
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="flex-shrink-0 mt-0.5">
              <Checkbox 
                checked={addTeeth} 
                onCheckedChange={(v) => setAddTeeth(Boolean(v))}
                className="w-5 h-5 border-2 border-orange-400 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  Doposażenie w zęby
                </span>
                {typeof product.toothCost === 'number' && (
                  <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-2 py-1 rounded-full">
                    +{product.toothCost} zł netto
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dodaj wytrzymałe zęby do łyżki dla lepszej wydajności kopania i dłuższej żywotności.
              </p>
              {addTeeth && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Zęby zostaną dodane do zamówienia</span>
                </div>
              )}
            </div>
          </label>
        </div>
      ) : null}

      <div className="pt-2">
        <AddToCartButton 
          product={product}
          extraConfiguration={{
            dimensions: dims,
            photoAssetId,
            teeth: addTeeth ? { enabled: true, price: product?.toothCost } : undefined,
            mount: selectedMount ? {
              title: (product as any)?.mountSystems?.find((m: any) => m.code === selectedMount)?.title || selectedMount,
              price: (product as any)?.mountSystems?.find((m: any) => m.code === selectedMount)?.price || 0
            } : undefined,
            // save machine info alongside configuration
            machine: {
              brandModel: brandModel || undefined,
              weight: machineWeight ? Number(machineWeight) : undefined,
            },
            requireMountValidation: true,
            hasQuickCoupler: hasQC,
          }}
          className="w-full"
        />
        {product?.toothCost && addTeeth ? (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="font-medium">Dodano zęby: +{product.toothCost} zł netto</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


