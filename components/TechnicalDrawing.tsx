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
        <DialogContent className="max-w-[98vw] w-[98vw] h-[95vh] p-0 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-2xl">
          <div className="flex flex-col h-full">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] text-white px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Rysunek techniczny</h2>
                    <p className="text-white/80 text-sm truncate max-w-[300px]">{current?.file?.replace(/\.(pdf|png|jpg|jpeg)$/i, '') || 'Dokument techniczny'}</p>
                  </div>
                </div>
                
                {/* Zoom indicator */}
                <div className="hidden md:flex items-center gap-2 text-white/90 text-sm">
                  <span className="bg-white/20 px-2 py-1 rounded-md">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Toolbar with improved styling */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                {/* File info */}
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono">
                    {current?.file?.split('.').pop()?.toUpperCase()}
                  </span>
                  <span className="text-sm">•</span>
                  <span className="text-sm">{index + 1} z {items.length}</span>
                </div>
                
                {/* Control buttons with better styling */}
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-gray-200" 
                            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
                          >
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Pomniejsz (Ctrl + -)</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-gray-200" 
                            onClick={() => setZoom(1)}
                          >
                            <Minimize2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Dopasuj (Ctrl + 0)</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-gray-200" 
                            onClick={() => setZoom((z) => Math.min(4, z + 0.2))}
                          >
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Powiększ (Ctrl + +)</TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-3 bg-[var(--color-brand-orange)] text-white hover:bg-[var(--color-brand-orange)]/90 border-[var(--color-brand-orange)]" 
                            onClick={downloadCurrent}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Pobierz
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Pobierz plik PDF</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 hover:text-red-600" 
                            onClick={() => setOpen(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zamknij (Esc)</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Main content area with improved styling */}
            <div className="relative flex-1 bg-white m-4 rounded-lg shadow-inner border border-gray-200 overflow-hidden">
              {/* Navigation arrows with better styling */}
              {items.length > 1 && (
                <>
                  <button 
                    type="button" 
                    onClick={prev} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button 
                    type="button" 
                    onClick={next} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              
              {/* Document viewer */}
              <div 
                ref={containerRef} 
                onWheel={onWheel} 
                className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing bg-gradient-to-br from-gray-50 to-white"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f9fafb' }}
              >
                <div 
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }} 
                  className="w-full h-full flex items-center justify-center p-6 transition-transform duration-200"
                >
                  {current && (current.file.toLowerCase().endsWith(".pdf") ? (
                    <div className="max-w-4xl max-h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                      <object
                        data={resolveSrc(index)}
                        type="application/pdf"
                        className="w-full h-full max-w-4xl"
                        style={{ minHeight: '600px', maxHeight: '80vh' }}
                      >
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nie można wyświetlić PDF</h3>
                          <p className="text-gray-600 mb-4">Twoja przeglądarka nie obsługuje wyświetlania PDF</p>
                          <Button 
                            onClick={downloadCurrent}
                            className="bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange)]/90"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Pobierz plik PDF
                          </Button>
                        </div>
                      </object>
                    </div>
                  ) : (
                    <div className="max-w-4xl max-h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                      <Image
                        src={resolveSrc(index)}
                        alt="Rysunek techniczny"
                        width={2000}
                        height={2000}
                        className="max-w-full h-auto object-contain"
                        style={{ maxHeight: '80vh' }}
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


