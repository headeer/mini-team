"use client";
import React, { useEffect, useState } from "react";
import { Shield, BadgeCheck, Ruler, Tag, Gauge } from "lucide-react";

type Prefs = {
  highContrast: boolean;
  dyslexicFont: boolean;
  largerText: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
};

const defaultPrefs: Prefs = {
  highContrast: false,
  dyslexicFont: false,
  largerText: false,
  underlineLinks: false,
  reduceMotion: false,
};

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#a11y") {
      setOpen(true);
    }
    try {
      const stored = localStorage.getItem("a11y-prefs");
      if (stored) setPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const set = (name: string, on: boolean) => {
      if (on) root.setAttribute(name, "true");
      else root.setAttribute(name, "false");
    };
    set("data-a11y-contrast", prefs.highContrast);
    set("data-a11y-dyslexic", prefs.dyslexicFont);
    set("data-a11y-text-lg", prefs.largerText);
    set("data-a11y-underline", prefs.underlineLinks);
    set("data-a11y-reduce-motion", prefs.reduceMotion);
    try {
      localStorage.setItem("a11y-prefs", JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  function toggle<K extends keyof Prefs>(key: K) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div aria-live="polite" className="a11y-panel left hidden sm:block">
      <a href="#content" className="skip-link">Pomiń do treści</a>
      <button
        aria-label={open ? "Zamknij panel dostępności" : "Otwórz panel dostępności"}
        aria-expanded={open}
        className="a11y-toggle shadow-lg bg-gradient-to-br from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white"
        onClick={() => setOpen((v) => !v)}
      >
        <Shield className="w-4 h-4" aria-hidden />
      </button>
      {open && (
        <div role="dialog" aria-modal="false" aria-label="Ustawienia dostępności" className="a11y-sheet">
          <div className="mb-2 text-xs text-gray-600">Dopasuj widok do swoich potrzeb</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={prefs.highContrast}
              onClick={() => toggle("highContrast")}
              className={`flex items-center gap-2 p-2 rounded-md border text-left ${prefs.highContrast ? "bg-gray-900 text-white border-gray-800" : "bg-white hover:bg-gray-50"}`}
            >
              <Gauge className="w-4 h-4" />
              <div>
                <div className="text-xs font-semibold">Wysoki kontrast</div>
                <div className="text-[10px] opacity-75">Czytelniejsze kolory</div>
              </div>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={prefs.largerText}
              onClick={() => toggle("largerText")}
              className={`flex items-center gap-2 p-2 rounded-md border text-left ${prefs.largerText ? "bg-gray-900 text-white border-gray-800" : "bg-white hover:bg-gray-50"}`}
            >
              <Ruler className="w-4 h-4" />
              <div>
                <div className="text-xs font-semibold">Większy tekst</div>
                <div className="text-[10px] opacity-75">Zwiększa rozmiar czcionki</div>
              </div>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={prefs.underlineLinks}
              onClick={() => toggle("underlineLinks")}
              className={`flex items-center gap-2 p-2 rounded-md border text-left ${prefs.underlineLinks ? "bg-gray-900 text-white border-gray-800" : "bg-white hover:bg-gray-50"}`}
            >
              <Tag className="w-4 h-4" />
              <div>
                <div className="text-xs font-semibold">Podkreślaj linki</div>
                <div className="text-[10px] opacity-75">Lepsza widoczność odnośników</div>
              </div>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={prefs.reduceMotion}
              onClick={() => toggle("reduceMotion")}
              className={`flex items-center gap-2 p-2 rounded-md border text-left ${prefs.reduceMotion ? "bg-gray-900 text-white border-gray-800" : "bg-white hover:bg-gray-50"}`}
            >
              <Shield className="w-4 h-4" />
              <div>
                <div className="text-xs font-semibold">Ogranicz animacje</div>
                <div className="text-[10px] opacity-75">Mniej ruchu na stronie</div>
              </div>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={prefs.dyslexicFont}
              onClick={() => toggle("dyslexicFont")}
              className={`flex items-center gap-2 p-2 rounded-md border text-left col-span-2 ${prefs.dyslexicFont ? "bg-gray-900 text-white border-gray-800" : "bg-white hover:bg-gray-50"}`}
            >
              <BadgeCheck className="w-4 h-4" />
              <div>
                <div className="text-xs font-semibold">Czcionka przyjazna dysleksji</div>
                <div className="text-[10px] opacity-75">Łatwiejsza czytelność tekstu</div>
              </div>
            </button>
          </div>
          <div className="a11y-row mt-2 flex items-center gap-2">
            <button className="a11y-reset" onClick={() => setPrefs(defaultPrefs)} aria-label="Przywróć domyślne ustawienia">Przywróć domyślne</button>
            <button className="ml-auto px-3 py-1.5 text-xs rounded-md border bg-white hover:bg-gray-50" onClick={() => setOpen(false)}>Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
}

