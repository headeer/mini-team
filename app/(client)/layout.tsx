import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import TopBenefitsBar from "@/components/TopBenefitsBar";
import FloatingMachineSelector from "@/components/FloatingMachineSelector";
import AIWidgetStub from "@/components/home/AIWidgetStub";
import Script from "next/script";
import techMap from "@/public/images/techniczne/map.json";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
  alternates: {
    canonical: "/",
  },
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
    icon: "/favicon.ico",
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-X20Y10HXVL'
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
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
    >
      <div className="flex flex-col min-h-screen">
        <AccessibilityPanel />
        <TopBenefitsBar />
        <Header />
        <main id="content" className="flex-1">{children}</main>
        <Footer />
        {/* Machine selector mounted globally so header shortcut works everywhere */}
        <FloatingMachineSelector />
        {/* Fit Check modal mounted globally to open from header */}
        <AIWidgetStub />
        {/* Global SEO JSON-LD */}
        {(() => {
          const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          const org = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Mini Team Project',
            url: base,
            logo: `${base}/favicon.ico`,
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
        {/* Hotjar Tracking Code */}
        <Script id="hotjar" strategy="beforeInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:6522239,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
        {/* Google Analytics */}
        {gaId ? (
          <>
            <Script
              id="ga-loader"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="ga-config" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        ) : null}
        {/* Technical drawing map (client) */}
        <Script id="tech-map" strategy="beforeInteractive">
          {`window.__TECH_MAP__ = ${JSON.stringify(techMap)};`}
        </Script>
        {/* Tawk.to chat - simplified to avoid null references; position adjusted on load */}
        <Script id="tawk-chat" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6899b3aa3df3eb1928b7d199/1j2c6bkn1';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </div>
    </ClerkProvider>
  );
}
