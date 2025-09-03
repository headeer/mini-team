"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
// Component now expects direct URLs from Sanity (image/pdf). No local fallback.

interface TechnicalDrawingItem { imageUrl?: string | null; fileUrl?: string | null; title?: string | null; code?: string | null; externalUrl?: string | null }
interface TechnicalDrawingProps { files: Array<TechnicalDrawingItem> | string[] }

export default function TechnicalDrawing({ files }: TechnicalDrawingProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Normalize input: allow old string[] or new array of objects
  const items = useMemo(() => {
    if (!Array.isArray(files)) return [] as Array<{ imageUrl?: string | null; fileUrl?: string | null; title?: string | null }>;
    if (typeof files[0] === "string") {
      // Legacy: map strings to fileUrl
      return (files as string[]).map((f) => ({ fileUrl: f })) as Array<TechnicalDrawingItem>;
    }
    // Resolve codes → paths (client-side map)
    try {
      const map = (window as any).__TECH_MAP__ as Record<string, { png?: string; pdf?: string }> | undefined;
      return (files as Array<TechnicalDrawingItem>).map((it) => {
        if (it?.code && map && map[it.code]) {
          const m = map[it.code];
          return { ...it, imageUrl: it.imageUrl || m.png || undefined, fileUrl: it.fileUrl || m.pdf || undefined };
        }
        if (it?.externalUrl) {
          const isPdf = /\.pdf$/i.test(it.externalUrl);
          return { ...it, [isPdf ? 'fileUrl' : 'imageUrl']: it.externalUrl } as any;
        }
        return it;
      });
    } catch { return files as Array<TechnicalDrawingItem>; }
  }, [files]);

  const current = items[index];

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  
  const downloadCurrent = () => {
    const href = current?.fileUrl || current?.imageUrl || "";
    const link = document.createElement("a");
    link.href = href;
    link.download = (current?.title || "rysunek_techniczny").replace(/\s+/g, "_");
    link.click();
  };

  const resolveSrc = (i: number) => items[i]?.imageUrl || "";

  const iframeAttemptedRef = useRef(false);
  const [pdfOk, setPdfOk] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const update = () => setIsSmallScreen(typeof window !== 'undefined' && window.innerWidth < 640);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  useEffect(() => {
    iframeAttemptedRef.current = false;
    setPdfOk(true);
    const timeout = setTimeout(() => {
      if (!iframeAttemptedRef.current) setPdfOk(false);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [index, open]);

  // no-op

  return (
    <>
      {!items.length ? (
        <div className="text-sm text-gray-600 p-4 border rounded-md bg-gray-50">
          Brak zdefiniowanych rysunków technicznych dla tej kategorii.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-hidden">
          {items.map((it, i) => {
            const isPdf = Boolean(it.fileUrl && it.fileUrl.toLowerCase().endsWith(".pdf"));
            if (isPdf) {
              const previewPng = it.imageUrl || "";
              return (
                <button
                  key={(it.title || "pdf") + i}
                  type="button"
                  onClick={() => openAt(i)}
                  className="border rounded-lg overflow-hidden bg-white text-left hover:shadow-md transition"
                >
                  <div className="relative w-full h-64 bg-white">
                    {previewPng ? (
                      <Image
                        src={previewPng}
                        alt="Podgląd PDF"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">PDF</div>
                    )}
                  </div>
                  <div className="px-3 py-2 text-xs text-gray-600 truncate">{it.title || "Rysunek techniczny"}</div>
                </button>
              );
            }
            return (
              <button
                key={(it.title || it.imageUrl || "image") + i}
                type="button"
                onClick={() => openAt(i)}
                className="border rounded-lg overflow-hidden bg-white text-left hover:shadow-md transition"
              >
                <div className="relative w-full h-64 bg-white">
                  {it.imageUrl ? (
                    <Image
                      src={it.imageUrl}
                      alt="Rysunek techniczny"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Brak obrazu</div>
                  )}
                </div>
                <div className="px-3 py-2 text-xs text-gray-600 truncate">{it.title || "Rysunek techniczny"}</div>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[98vw] sm:w-[96vw] lg:w-[95vw] max-w-none sm:max-w-none lg:max-w-[98vw] p-0 sm:p-0 no-default-close technical-drawing-content">
          <DialogTitle className="sr-only">{current?.title || "Rysunek techniczny"}</DialogTitle>
          <div className="border-b bg-white px-3 py-2 flex items-center justify-between technical-drawing-toolbar">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {current?.title || 'Rysunek techniczny'}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={downloadCurrent}>
                <Download className="w-4 h-4 mr-1" /> Pobierz
              </Button>
              <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="bg-white">
            {current && (Boolean(current.fileUrl && current.fileUrl.toLowerCase().endsWith('.pdf')) ? (
              isSmallScreen ? (
                <div className="w-full flex items-center justify-center p-4">
                  {current.imageUrl ? (
                    <Image src={current.imageUrl} alt="Rysunek techniczny" width={2000} height={2000} className="max-w-full h-auto object-contain" style={{ maxHeight: '88vh' }} />
                  ) : null}
                </div>
              ) : (
                pdfOk ? (
                  <iframe
                    src={`${String(current.fileUrl).replace(/#.*$/, '')}#page=1&zoom=page-fit`}
                    title="Podgląd PDF"
                    className="w-full h-[88vh] border-0"
                    onLoad={() => { iframeAttemptedRef.current = true; setPdfOk(true); }}
                    onError={() => { iframeAttemptedRef.current = true; setPdfOk(false); }}
                  />
                ) : (
                  <div className="w-full flex items-center justify-center p-4">
                    {current.imageUrl ? (
                      <Image src={current.imageUrl} alt="Rysunek techniczny" width={2000} height={2000} className="max-w-full h-auto object-contain" style={{ maxHeight: '88vh' }} />
                    ) : null}
                  </div>
                )
              )
            ) : (
              <div className="w-full flex items-center justify-center p-4">
                {resolveSrc(index) ? (
                  <Image src={resolveSrc(index)} alt="Rysunek techniczny" width={2000} height={2000} className="max-w-full h-auto object-contain" style={{ maxHeight: '88vh' }} />
                ) : null}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


