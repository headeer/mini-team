"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStoredConsent,
  setStoredConsent,
  CONSENT_ALL,
  CONSENT_NECESSARY,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<CookieConsentValue>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
    setMounted(true);
  }, []);

  const acceptAll = () => {
    setStoredConsent(CONSENT_ALL);
    setConsent(CONSENT_ALL);
  };

  const acceptNecessaryOnly = () => {
    setStoredConsent(CONSENT_NECESSARY);
    setConsent(CONSENT_NECESSARY);
  };

  if (!mounted || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Informacja o plikach cookies"
      className="fixed inset-x-0 bottom-0 z-[10000] border-t border-gray-200 bg-white/98 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700 leading-relaxed min-w-0">
            Używamy plików cookies, aby strona działała poprawnie, oraz do analizy ruchu (Google Analytics, Hotjar).
            Klikając &quot;Akceptuję wszystkie&quot;, wyrażasz zgodę na ich użycie.{" "}
            <Link
              href="/polityka-prywatnosci"
              className="font-medium text-[var(--color-brand-orange)] hover:underline underline-offset-2 inline"
            >
              Polityka prywatności
            </Link>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-shrink-0 sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={acceptNecessaryOnly}
              className="min-h-[44px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors sm:w-auto sm:py-2.5"
            >
              Tylko niezbędne
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="min-h-[44px] w-full rounded-lg bg-[var(--color-brand-orange)] px-4 py-3 text-sm font-medium text-white hover:opacity-95 active:opacity-90 transition-opacity sm:w-auto sm:py-2.5"
            >
              Akceptuję wszystkie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
