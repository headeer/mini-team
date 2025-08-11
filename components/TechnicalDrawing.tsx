"use client";

import React, { useEffect, useMemo, useState } from "react";

interface TechnicalDrawingProps {
  slug: string;
  hints?: string[];
}

const exts = ["webp", "jpg", "png"] as const;

function buildCandidates(slug: string, hints?: string[]): string[] {
  const candidates: string[] = [];
  for (const ext of exts) {
    // direct single file e.g. /images/rys_techniczne/slug.webp
    candidates.push(`/images/rys_techniczne/${slug}.${ext}`);
    // numbered variants e.g. slug-1.webp ... slug-6.webp
    for (let i = 1; i <= 6; i += 1) {
      candidates.push(`/images/rys_techniczne/${slug}-${i}.${ext}`);
    }
  }
  if (hints && hints.length) {
    for (const key of hints) {
      const normalized = key.replace(/\.(webp|jpg|png)$/i, "");
      for (const ext of exts) {
        candidates.push(`/images/rys_techniczne/${normalized}.${ext}`);
        for (let i = 1; i <= 6; i += 1) {
          candidates.push(`/images/rys_techniczne/${normalized}-${i}.${ext}`);
          candidates.push(`/images/rys_techniczne/${normalized}_${i}.${ext}`);
        }
      }
    }
  }
  return Array.from(new Set(candidates));
}

export default function TechnicalDrawing({ slug, hints }: TechnicalDrawingProps) {
  const [validUrls, setValidUrls] = useState<string[]>([]);
  const candidates = useMemo(() => buildCandidates(slug, hints), [slug, hints]);

  useEffect(() => {
    let isActive = true;
    const found: string[] = [];
    const controllers: Array<{ img: HTMLImageElement }> = [];

    candidates.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        if (!isActive) return;
        found.push(url);
        // sort stable and update incrementally
        setValidUrls((prev) => {
          if (prev.includes(url)) return prev;
          const next = [...prev, url];
          next.sort();
          return next;
        });
      };
      img.onerror = () => {};
      img.src = url;
      controllers.push({ img });
    });

    return () => {
      isActive = false;
      controllers.forEach(({ img }) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [candidates]);

  if (validUrls.length === 0) {
    return (
      <div className="text-sm text-gray-600 p-4 border rounded-md bg-gray-50">
        Brak rysunków technicznych dla tego produktu. Umieść pliki w
        <span className="font-semibold"> /public/images/rys_techniczne/{slug}-*.webp</span>
        , aby włączyć tę sekcję.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {validUrls.map((src) => (
        <div key={src} className="border rounded-lg overflow-hidden bg-white">
          {/* Using native img to avoid Next Image static import constraints for unknown files */}
          <img src={src} alt={`Rysunek techniczny ${slug}`} className="w-full h-64 object-contain bg-white" />
          <div className="px-3 py-2 text-xs text-gray-600 truncate">{src.split("/").pop()}</div>
        </div>
      ))}
    </div>
  );
}


