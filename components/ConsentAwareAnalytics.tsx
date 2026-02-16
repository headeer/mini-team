"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";
import { getStoredConsent, CONSENT_ALL, type CookieConsentValue } from "@/lib/cookie-consent";

const VercelAnalytics = dynamic(
  () => import("@vercel/analytics/react").then((m) => ({ default: m.Analytics })),
  { ssr: false }
);

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-X20Y10HXVL";

export default function ConsentAwareAnalytics() {
  const [consent, setConsent] = useState<CookieConsentValue>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(getStoredConsent());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onChange = (e: CustomEvent<CookieConsentValue>) => {
      setConsent(e.detail);
    };
    window.addEventListener("cookie-consent-change", onChange as EventListener);
    return () => window.removeEventListener("cookie-consent-change", onChange as EventListener);
  }, [mounted]);

  if (consent !== CONSENT_ALL) return null;

  return (
    <>
      {/* Google Analytics */}
      {GA_ID ? (
        <>
          <Script
            id="ga-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      ) : null}

      {/* Hotjar */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments);};
            h._hjSettings={hjid:6527223,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>

      {/* Vercel Analytics */}
      <VercelAnalytics />
    </>
  );
}
