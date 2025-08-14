"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Download, X, ZoomIn, ZoomOut, Minimize2 } from "lucide-react";
import { getDrawingByName } from "@/images/rys_techniczne";

interface TechnicalDrawingProps {
  files: string[]; // exact file names with extension located under /images/rys_techniczne/
}

export default function TechnicalDrawing({ files }: TechnicalDrawingProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fallbackMap, setFallbackMap] = useState<Record<number, boolean>>({}); // true => use rys_techniczne, false/undefined => use techniczne

  const items = useMemo(() => files.map((file) => ({ file })), [files]);

  const current = items[index];

  const openAt = (i: number) => {
    setIndex(i);
    setZoom(1);
    setOpen(true);
  };

  const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(4, z + 0.2));
      if (e.key === "-" || e.key === "_") setZoom((z) => Math.max(0.5, z - 0.2));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!open) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.5, Math.min(4, z + delta)));
  };

  const downloadCurrent = () => {
    const isPdf = current?.file?.toLowerCase().endsWith(".pdf");
    const href = isPdf
      ? (fallbackMap[index] ? `/images/rys_techniczne/${current.file}` : `/images/techniczne/${current.file}`)
      : (() => {
          const imported = getDrawingByName(current.file);
          if (imported) return imported;
          return fallbackMap[index]
            ? `/images/rys_techniczne/${current.file}`
            : `/images/techniczne/${current.file}`;
        })();
    const link = document.createElement("a");
    link.href = typeof href === "string" ? href : (href?.src || "");
    link.download = current.file;
    link.click();
  };

  const resolveSrc = (i: number) => {
    const file = items[i]?.file || "";
    const isPdf = file.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      return fallbackMap[i] ? `/images/rys_techniczne/${file}` : `/images/techniczne/${file}`;
    }
    const imported = getDrawingByName(file);
    if (imported) return imported;
    return fallbackMap[i] ? `/images/rys_techniczne/${file}` : `/images/techniczne/${file}`;
  };

  return (
    <>
      {!files.length ? (
        <div className="text-sm text-gray-600 p-4 border rounded-md bg-gray-50">
          Brak zdefiniowanych rysunków technicznych dla tej kategorii.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it, i) => {
            const isPdf = it.file.toLowerCase().endsWith(".pdf");
            if (isPdf) {
              const pdfSrcPrimary = `/images/techniczne/${it.file}`;
              const pdfSrcFallback = `/images/rys_techniczne/${it.file}`;
              return (
                <div key={it.file} className="border rounded-lg overflow-hidden bg-white">
                  <div className="p-3 text-xs text-gray-700 flex items-center justify-between">
                    <span className="truncate">{it.file}</span>
                    <button
                      type="button"
                      onClick={() => openAt(i)}
                      className="text-[var(--color-brand-orange)] underline underline-offset-2"
                    >
                      Podgląd
                    </button>
                  </div>
                  <object
                    data={fallbackMap[i] ? pdfSrcFallback : pdfSrcPrimary}
                    type="application/pdf"
                    className="w-full h-64"
                    onError={() => setFallbackMap((m) => ({ ...m, [i]: true }))}
                  >
                    <div className="p-3 text-xs text-gray-600">Nie można wyświetlić PDF. Pobierz, aby zobaczyć.</div>
                  </object>
                </div>
              );
            }
            const primary = `/images/techniczne/${it.file}`;
            const fallback = `/images/rys_techniczne/${it.file}`;
            return (
              <button
                key={it.file}
                type="button"
                onClick={() => openAt(i)}
                className="border rounded-lg overflow-hidden bg-white text-left hover:shadow-md transition"
              >
                <div className="relative w-full h-64 bg-white">
                  <Image
                    src={fallbackMap[i] ? fallback : primary}
                    alt="Rysunek techniczny"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                    onError={() => setFallbackMap((m) => ({ ...m, [i]: true }))}
                  />
                </div>
                <div className="px-3 py-2 text-xs text-gray-600 truncate">{it.file}</div>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setZoom(1); }}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-2">
          <DialogHeader>
            <DialogTitle className="text-sm">Rysunek techniczny</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between gap-2 px-2 pb-2">
            <div className="text-xs text-gray-600 truncate">{current?.file}</div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}><ZoomOut className="w-4 h-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Pomniejsz</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" onClick={() => setZoom((z) => Math.min(4, z + 0.2))}><ZoomIn className="w-4 h-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Powiększ</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" onClick={() => setZoom(1)}><Minimize2 className="w-4 h-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>100%</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" onClick={downloadCurrent}><Download className="w-4 h-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Pobierz</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" onClick={() => setOpen(false)}><X className="w-4 h-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Zamknij</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="relative flex-1 bg-white border rounded-md overflow-hidden">
            <button type="button" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white p-2 shadow"><ChevronLeft className="w-5 h-5" /></button>
            <button type="button" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white p-2 shadow"><ChevronRight className="w-5 h-5" /></button>
            <div ref={containerRef} onWheel={onWheel} className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing">
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }} className="w-full h-full flex items-center justify-center p-4">
                {current && (current.file.toLowerCase().endsWith(".pdf") ? (
                  <object
                    data={resolveSrc(index)}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <div className="p-3 text-sm text-gray-600">Nie można wyświetlić PDF w przeglądarce. Pobierz plik.</div>
                  </object>
                ) : (
                  <Image
                    src={resolveSrc(index)}
                    alt="Rysunek techniczny"
                    width={2000}
                    height={2000}
                    className="max-w-none h-auto"
                    priority
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


