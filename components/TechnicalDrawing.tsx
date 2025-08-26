"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { getDrawingByName } from "@/images/rys_techniczne";
// using iframe for robust cross-device PDF display
import { getPreviewByPdfName } from "@/images/techniczne/png";

interface TechnicalDrawingProps {
  files: string[]; // exact file names with extension located under /images/rys_techniczne/
}

export default function TechnicalDrawing({ files }: TechnicalDrawingProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [fallbackMap, setFallbackMap] = useState<Record<number, boolean>>({}); // true => use rys_techniczne, false/undefined => use techniczne

  const items = useMemo(() => files.map((file) => ({ file })), [files]);

  const current = items[index];

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
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
      {!files.length ? (
        <div className="text-sm text-gray-600 p-4 border rounded-md bg-gray-50">
          Brak zdefiniowanych rysunków technicznych dla tej kategorii.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it, i) => {
            const isPdf = it.file.toLowerCase().endsWith(".pdf");
            if (isPdf) {
              const mapped = getPreviewByPdfName(it.file);
              const fallbackComputed = `/images/techniczne/png/${it.file.replace(/\.pdf$/i, "")}-1.png`;
              const previewPng = mapped || fallbackComputed;
              return (
                <button
                  key={it.file}
                  type="button"
                  onClick={() => openAt(i)}
                  className="border rounded-lg overflow-hidden bg-white text-left hover:shadow-md transition"
                >
                  <div className="relative w-full h-64 bg-white">
                    <Image
                      src={previewPng}
                      alt="Podgląd PDF"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="px-3 py-2 text-xs text-gray-600 truncate">{it.file}</div>
                </button>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:w-auto sm:max-w-3xl p-0 no-default-close technical-drawing-content">
          <DialogTitle className="sr-only">{current?.file || "Rysunek techniczny"}</DialogTitle>
          <div className="border-b bg-white px-3 py-2 flex items-center justify-between technical-drawing-toolbar">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {current?.file || 'Rysunek techniczny'}
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
            {current && (current.file.toLowerCase().endsWith('.pdf') ? (
              isSmallScreen ? (
                <div className="w-full flex items-center justify-center p-4">
                  {(() => {
                    const mapped = getPreviewByPdfName(current.file);
                    const fb = `/images/techniczne/png/${current.file.replace(/\.pdf$/i, "")}-1.png`;
                    const previewSrc = mapped || fb;
                    return (
                      <Image src={previewSrc} alt="Rysunek techniczny" width={2000} height={2000} className="max-w-full h-auto object-contain" style={{ maxHeight: '80vh' }} />
                    );
                  })()}
                </div>
              ) : (
                pdfOk ? (
                  <iframe
                    src={`${String(resolveSrc(index)).replace(/#.*$/, '')}#page=1&zoom=page-fit`}
                    title="Podgląd PDF"
                    className="w-full h-[80vh] border-0"
                    onLoad={() => { iframeAttemptedRef.current = true; setPdfOk(true); }}
                    onError={() => { iframeAttemptedRef.current = true; setPdfOk(false); }}
                  />
                ) : (
                  <div className="w-full flex items-center justify-center p-4">
                    {(() => {
                      const mapped = getPreviewByPdfName(current.file);
                      const fb = `/images/techniczne/png/${current.file.replace(/\.pdf$/i, "")}-1.png`;
                      const previewSrc = mapped || fb;
                      return (
                        <Image src={previewSrc} alt="Rysunek techniczny" width={2000} height={2000} className="max-w-full h-auto object-contain" style={{ maxHeight: '80vh' }} />
                      );
                    })()}
                  </div>
                )
              )
            ) : (
              <div className="w-full flex items-center justify-center p-4">
                <Image src={resolveSrc(index)} alt="Rysunek techniczny" width={2000} height={2000} className="max-w-full h-auto object-contain" style={{ maxHeight: '80vh' }} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


