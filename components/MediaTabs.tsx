"use client";

import React, { useState } from "react";
import TechnicalDrawing from "./TechnicalDrawing";

interface MediaTabsProps {
  slug: string;
  gallery: React.ReactNode;
  files?: string[]; // explicit file list under /images/rys_techniczne
  defaultTab?: "gallery" | "tech";
}

export default function MediaTabs({ slug, gallery, files, defaultTab = "gallery" }: MediaTabsProps) {
  const [tab, setTab] = useState<"gallery" | "tech">(defaultTab);
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 border-b">
        <button
          type="button"
          className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${tab === "gallery" ? "border-[var(--color-brand-orange)] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"}`}
          onClick={() => setTab("gallery")}
        >
          Galeria
        </button>
        <button
          type="button"
          className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${tab === "tech" ? "border-[var(--color-brand-orange)] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"}`}
          onClick={() => setTab("tech")}
        >
          Rysunek techniczny
        </button>
      </div>
      <div className="pt-4">
        {tab === "gallery" ? gallery : (
          <TechnicalDrawing files={files || []} />
        )}
      </div>
    </div>
  );
}


