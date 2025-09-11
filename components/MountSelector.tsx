"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export type MountSelection = {
  hasQuickCoupler: boolean;
  code?: string; // e.g. CW05, HS02, ... or "INNE"
  other?: boolean; // true if "Inne (Nie wiem jakie posiadam)"
  dimensions?: { A?: number; B?: number; C?: number; D?: number; Center?: number };
  photoUrl?: string;
};

const MOUNT_OPTIONS: Array<{ code: string; label: string; pdf: string }> = [
  { code: "CW05", label: "Mocowanie CW05", pdf: "/mocowania/Mocowanie CW05.pdf" },
  { code: "HS02", label: "Mocowanie HS02", pdf: "/mocowania/Mocowanie HS02.pdf" },
  { code: "HS03", label: "Mocowanie HS03", pdf: "/mocowania/Mocowanie Hs03.pdf" },
  { code: "MS01", label: "Mocowanie MS01", pdf: "/mocowania/Mocowanie Ms01.pdf" },
  { code: "MS03", label: "Mocowanie MS03", pdf: "/mocowania/Mocowanie Ms03.pdf" },
  { code: "S30-150", label: "Mocowanie S30-150", pdf: "/mocowania/Mocowanie S30-150.pdf" },
  { code: "S30-180", label: "Mocowanie S30-180", pdf: "/mocowania/Mocowanie S30-180.pdf" },
  { code: "S40", label: "Mocowanie S40", pdf: "/mocowania/Mocowanie S40.pdf" },
];

export default function MountSelector({ onChange }: { onChange: (m: MountSelection) => void }) {
  const [hasQC, setHasQC] = React.useState<boolean>(true);
  const [selected, setSelected] = React.useState<string | "INNE" | undefined>(undefined);
  const [dims, setDims] = React.useState<{ A?: number; B?: number; C?: number; D?: number; Center?: number }>({});
  const [photoUrl, setPhotoUrl] = React.useState<string | undefined>(undefined);
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const payload: MountSelection = {
      hasQuickCoupler: hasQC,
      code: selected && selected !== "INNE" ? selected : undefined,
      other: selected === "INNE" ? true : undefined,
      dimensions: (!hasQC || selected === "INNE") ? dims : undefined,
      photoUrl,
    };
    onChange(payload);
    // do not include onChange in deps to avoid effect loops when parent recreates handler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQC, selected, dims, photoUrl]);

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-white">
      <div className="text-sm text-gray-700">Standardowe mocowania (pasujące pod szybkozłącze)</div>

      {/* Step 1: Has quick coupler */}
      <div className="flex items-center gap-4 text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="radio" name="hasQC" checked={hasQC} onChange={() => setHasQC(true)} />
          Tak, posiadam szybkozłącze
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="radio" name="hasQC" checked={!hasQC} onChange={() => setHasQC(false)} />
          Nie, nie posiadam szybkozłącza
        </label>
      </div>

      {/* Step 2A: Selection when has QC */}
      {hasQC ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {MOUNT_OPTIONS.map((m) => (
              <button
                key={m.code}
                type="button"
                onClick={() => setSelected(m.code)}
                onMouseEnter={() => setPdfUrl(m.pdf)}
                onMouseLeave={() => setPdfUrl(null)}
                className={`text-xs border rounded-md px-2 py-2 text-left hover:bg-gray-50 ${selected===m.code? 'border-[var(--color-brand-orange)]' : 'border-gray-200'}`}
                title="Kliknij, aby zobaczyć PDF"
              >
                <div className="font-medium">{m.label}</div>
                <div className="text-[11px] text-gray-500">pasujące pod szybkozłącze</div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelected("INNE")}
              className={`text-xs border rounded-md px-2 py-2 text-left hover:bg-gray-50 ${selected==="INNE"? 'border-[var(--color-brand-orange)]' : 'border-gray-200'}`}
            >
              <div className="font-medium">Inne (Nie wiem jakie posiadam)</div>
              <div className="text-[11px] text-gray-500">wprowadź wymiary i/lub zdjęcie</div>
            </button>
          </div>

          {/* Hover preview info */}
          {pdfUrl ? (
            <div className="text-[11px] text-gray-500">Podgląd dostępny – kliknij wybraną pozycję, aby otworzyć PDF.</div>
          ) : null}

          {/* PDF Modal on click (for selected known option) */}
          <Dialog open={Boolean(selected && selected !== "INNE")} onOpenChange={(o)=>{ if(!o) setSelected(undefined); }}>
            <DialogContent className="w-[96vw] max-w-5xl p-0">
              {selected && selected !== "INNE" ? (
                <iframe src={MOUNT_OPTIONS.find(x=>x.code===selected)?.pdf} className="w-full h-[80vh]" />
              ) : null}
            </DialogContent>
          </Dialog>
        </div>
      ) : null}

      {/* Step 2B or 2A.3: Dimensions + optional photo when no QC or INNE */}
      {(!hasQC || selected === "INNE") ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {([
              { key: 'A', label: 'Ramię A' },
              { key: 'B', label: 'Ramię B' },
              { key: 'C', label: 'Sworzeń A' },
              { key: 'D', label: 'Sworzeń B' },
              { key: 'Center', label: 'Center' },
            ] as const).map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <div className="text-xs font-medium text-gray-700">{label}</div>
                <input
                  inputMode="decimal"
                  placeholder="np. 12.5"
                  className="block w-full text-sm text-gray-900 border border-gray-200 rounded-md px-3 py-2"
                  value={typeof (dims as any)[key] === 'number' ? String((dims as any)[key]) : ''}
                  onChange={(e) => setDims(prev => ({ ...prev, [key]: Number((e.target.value || '').replace(',','.')) || undefined }))}
                />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-700">Zdjęcie mocowania (opcjonalne)</div>
            <input type="file" accept="image/*" onChange={(e)=>{
              const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); setPhotoUrl(url);
            }} />
            {photoUrl ? <img src={photoUrl} alt="Podgląd" className="w-24 h-24 object-cover rounded border" /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}


