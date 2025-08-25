"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { getDrawingByName } from "@/images/rys_techniczne";

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
              const pdfSrcPrimary = `/images/techniczne/${it.file}#zoom=page-fit`;
              const pdfSrcFallback = `/images/rys_techniczne/${it.file}#zoom=page-fit`;
              const downloadHref = fallbackMap[i] ? pdfSrcFallback : pdfSrcPrimary;
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
                    data={downloadHref}
                    type="application/pdf"
                    className="w-full h-40"
                    onError={() => setFallbackMap((m) => ({ ...m, [i]: true }))}
                  >
                    <div className="h-40 flex items-center justify-center p-4 bg-gray-50">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-900 text-sm font-semibold">
                          <span>📄</span>
                          <span>PDF</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">Podgląd niedostępny</div>
                        <a href={downloadHref} download className="mt-3 inline-block px-3 py-1.5 rounded-md bg-[var(--color-brand-orange)] text-white text-xs font-semibold">
                          Pobierz
                        </a>
                      </div>
                    </div>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-3xl p-0 overflow-hidden no-default-close">
          <div className="border-b bg-white px-3 py-2 flex items-center justify-between">
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
              <object data={`${resolveSrc(index)}#page=1&zoom=page-fit`} type="application/pdf" className="w-full h-[65vh]">
                <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center bg-gray-50">
                  <div className="text-gray-700 mb-2">Nie można wyświetlić PDF</div>
                  <Button onClick={downloadCurrent}>
                    <Download className="w-4 h-4 mr-2" /> Pobierz plik PDF
                  </Button>
                </div>
              </object>
            ) : (
              <div className="w-full flex items-center justify-center p-4">
                <Image src={resolveSrc(index)} alt="Rysunek techniczny" width={2000} height={2000} className="max-w-full h-auto object-contain" style={{ maxHeight: '65vh' }} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


