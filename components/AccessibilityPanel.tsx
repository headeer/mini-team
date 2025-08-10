"use client";
import React, { useEffect, useState } from "react";

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
    <div aria-live="polite" className="a11y-panel left">
      <a href="#content" className="skip-link">Pomiń do treści</a>
      <button
        aria-label={open ? "Zamknij panel dostępności" : "Otwórz panel dostępności"}
        aria-expanded={open}
        className="a11y-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden>♿</span>
      </button>
      {open && (
        <div role="dialog" aria-modal="false" aria-label="Ustawienia dostępności" className="a11y-sheet">
          <div className="a11y-row">
            <label><input type="checkbox" checked={prefs.highContrast} onChange={() => toggle("highContrast")} /> Wysoki kontrast</label>
          </div>
          <div className="a11y-row">
            <label><input type="checkbox" checked={prefs.largerText} onChange={() => toggle("largerText")} /> Większy tekst</label>
          </div>
          <div className="a11y-row">
            <label><input type="checkbox" checked={prefs.underlineLinks} onChange={() => toggle("underlineLinks")} /> Podkreślaj linki</label>
          </div>
          <div className="a11y-row">
            <label><input type="checkbox" checked={prefs.reduceMotion} onChange={() => toggle("reduceMotion")} /> Ogranicz animacje</label>
          </div>
          <div className="a11y-row">
            <label><input type="checkbox" checked={prefs.dyslexicFont} onChange={() => toggle("dyslexicFont")} /> Czcionka przyjazna dysleksji</label>
          </div>
          <div className="a11y-row">
            <button className="a11y-reset" onClick={() => setPrefs(defaultPrefs)} aria-label="Przywróć domyślne ustawienia">Przywróć domyślne</button>
          </div>
        </div>
      )}
    </div>
  );
}

