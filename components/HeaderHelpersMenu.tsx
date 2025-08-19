"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles, Camera, Wrench, Shield } from "lucide-react";
import Link from "next/link";

const HeaderHelpersMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const closeLater = React.useRef<number | null>(null);

  const onEnter = () => {
    if (closeLater.current) window.clearTimeout(closeLater.current);
    setOpen(true);
  };
  const onLeave = () => {
    if (closeLater.current) window.clearTimeout(closeLater.current);
    closeLater.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="hidden md:flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-label="Pomoc i skróty"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-brand-orange)]/30 bg-white text-gray-800 hover:text-white hover:bg-gradient-to-r hover:from-[var(--color-brand-orange)] hover:to-[var(--color-brand-red)] transition-colors"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-72 p-2 rounded-2xl border-gray-200 shadow-xl"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <div className="px-2 py-1.5 text-xs text-gray-500">Szybkie akcje</div>
          <div className="divide-y">
            <button type="button" onClick={() => { try { window.dispatchEvent(new Event('open-fit-check')); } catch {} setOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] text-white">
                <Camera className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">Wyślij zdjęcie (Fit Check)</div>
                <div className="text-xs text-gray-500 truncate">Potwierdzimy dopasowanie w 24h</div>
              </div>
            </button>
            <button type="button" onClick={() => { try { window.dispatchEvent(new Event('open-machine-finder')); } catch {} setOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-brand-orange)]/30 text-gray-800 bg-white">
                <Wrench className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">Dobierz do maszyny</div>
                <div className="text-xs text-gray-500 truncate">Szybki wybór marki i modeli</div>
              </div>
            </button>
            <button type="button" onClick={() => { try { window.dispatchEvent(new Event('open-a11y')); } catch {} setOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white">
                <Shield className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">Dostępność</div>
                <div className="text-xs text-gray-500 truncate">Kontrast, większy tekst i więcej</div>
              </div>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HeaderHelpersMenu;


