import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { plPL } from "@clerk/localizations";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import TopBenefitsBar from "@/components/TopBenefitsBar";
import MobileCartBar from "@/components/MobileCartBar";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import ConsentAwareAnalytics from "@/components/ConsentAwareAnalytics";
import Script from "next/script";
import techMap from "@/public/images/techniczne/map.json";
import { RecaptchaProvider } from "@/components/RecaptchaProvider";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://www.miniteamproject.pl"
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    template: "%s – Mini Team Project",
    default: "Mini Team Project – Osprzęt do koparek, łyżki, zrywak",
  },
  description: "Mini Team Project – osprzęt do koparek: łyżki, zrywaki, szybkozłącza. Hardox HB500, dostawa 48h, polska produkcja.",
  applicationName: "Mini Team Project",
  authors: [{ name: "Mini Team Project" }],
  keywords: [
    "osprzęt do koparek",
    "łyżki kopiące",
    "łyżki skarpowe",
    "zrywak korzeni",
    "szybkozłącza",
    "Hardox HB500",
  ],
  // Do not set a global canonical to root; let pages define specific canonicals
  openGraph: {
    siteName: "Mini Team Project",
    type: "website",
    title: "Mini Team Project – Osprzęt do koparek, łyżki, zrywak",
    description: "Mini Team Project – osprzęt do koparek: łyżki, zrywaki, szybkozłącza. Hardox HB500, dostawa 48h, polska produkcja.",
    images: [{ url: "/images/main/excavator-2025-03-15-06-31-29-utc.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini Team Project",
    description: "Mini Team Project – osprzęt do koparek: łyżki, zrywak, szybkozłącza.",
    images: ["/images/main/excavator-2025-03-15-06-31-29-utc.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/assets/logo_mini_team_project.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={plPL}
      appearance={{
        elements: {
          formButtonPrimary: "bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-red)] text-white",
          card: "bg-white shadow-lg",
          headerTitle: "text-gray-900",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
          formFieldInput: "border border-gray-300 focus:border-[var(--color-brand-orange)]",
        }
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <RecaptchaProvider>
        <div className="flex flex-col min-h-screen">
        <AccessibilityPanel />
        <TopBenefitsBar />
        <Header />
        <main id="content" className="flex-1">{children}</main>
        <Footer />
        <MobileCartBar />
        <CookieConsentBanner />
        <ConsentAwareAnalytics />
        {/* Global SEO JSON-LD */}
        {(() => {
          const base = getBaseUrl()
          const org = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Mini Team Project',
            url: base,
            logo: `${base}/assets/logo_mini_team_project.png`,
            sameAs: [
              'https://www.facebook.com/',
              'https://www.instagram.com/',
            ],
          }
          const nav = {
            '@context': 'https://schema.org',
            '@type': 'SiteNavigationElement',
            name: ['Oferta', 'Blog', 'Kontakt'],
            url: [`${base}/shop`, `${base}/blog`, `${base}/kontakt`],
          }
          const website = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Mini Team Project',
            url: base,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${base}/shop?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }
          return (
            <>
              <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">{JSON.stringify(org)}</Script>
              <Script id="nav-jsonld" type="application/ld+json" strategy="afterInteractive">{JSON.stringify(nav)}</Script>
              <Script id="website-jsonld" type="application/ld+json" strategy="afterInteractive">{JSON.stringify(website)}</Script>
            </>
          )
        })()}
        {/* GA, Hotjar, Vercel Analytics ładowane tylko po wyrażeniu zgody – ConsentAwareAnalytics */}
        {/* Technical drawing map (client) */}
        <Script id="tech-map" strategy="beforeInteractive">
          {`window.__TECH_MAP__ = ${JSON.stringify(techMap)};`}
        </Script>
        </div>
      </RecaptchaProvider>
    </ClerkProvider>
  );
}
