"use client";

import { COOKIE_CONSENT_KEY } from "@/lib/cookie-consent";

/** Link w stopce – po kliknięciu czyści zapisaną zgodę i przeładowuje stronę, żeby pokazać banner ponownie */
export default function CookieSettingsLink() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(COOKIE_CONSENT_KEY);
      window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: null }));
      window.location.reload();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="min-h-[44px] -my-2 inline-flex items-center py-2 text-left text-sm text-gray-700 hover:text-shop_light_green hoverEffect sm:min-h-0 sm:py-0"
    >
      Ustawienia cookies
    </button>
  );
}
