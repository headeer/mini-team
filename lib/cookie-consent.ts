/** Klucz w localStorage – używany przez banner i ConsentAwareAnalytics */
export const COOKIE_CONSENT_KEY = "cookie-consent";

/** Wartość: użytkownik zaakceptował wszystkie pliki cookie (analityka, marketing itd.) */
export const CONSENT_ALL = "all";

/** Wartość: tylko niezbędne pliki cookie (bez GA, Hotjar, Vercel Analytics) */
export const CONSENT_NECESSARY = "necessary";

export type CookieConsentValue = typeof CONSENT_ALL | typeof CONSENT_NECESSARY | null;

export function getStoredConsent(): CookieConsentValue {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (v === CONSENT_ALL || v === CONSENT_NECESSARY) return v;
  return null;
}

export function setStoredConsent(value: CookieConsentValue): void {
  if (typeof window === "undefined") return;
  if (value === null) {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  } else {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  }
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: value }));
}
