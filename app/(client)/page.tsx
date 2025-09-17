import Container from "@/components/Container";
import AppSection from "@/components/ui/AppSection";
import AppHeading from "@/components/ui/AppHeading";
import HomeHero from "@/components/home/HomeHero";
import type { Metadata } from "next";
import WhyHardox from "@/components/home/WhyHardox";
import LatestBlog from "@/components/LatestBlog";
import SevenReasons from "@/components/home/SevenReasons";
// import RealizacjeCarousel from "@/components/home/RealizacjeCarousel";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import HomeShowcase from "@/components/home/HomeShowcase";
import AllCategories from "@/components/home/AllCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellers from "@/components/home/BestSellers";
import BrandStory from "@/components/home/BrandStory";
import FloatingMachineSelector from "@/components/FloatingMachineSelector";

import React from "react";

export const metadata: Metadata = {
  title: "Osprzęt do koparek – Łyżki Hardox HB500, zrywak | Mini Team Project",
  description:
    "Osprzęt do koparek: łyżki Hardox HB500, łyżki skarpowe, zrywaki, szybkozłącza. Polska produkcja, dostawa 24–48 h, 2 lata gwarancji, doradztwo.",
  keywords: [
    "osprzęt do koparek",
    "łyżki do koparek",
    "łyżki Hardox HB500",
    "łyżka skarpowa",
    "zrywak",
    "szybkozłącze",
    "montaż mocowania",
    "MTT Mini Team Project",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Mini Team Project",
    title: "Osprzęt do koparek – Łyżki Hardox HB500, zrywak | Mini Team Project",
    description:
      "Osprzęt do koparek: łyżki Hardox HB500, łyżki skarpowe, zrywaki, szybkozłącza. Polska produkcja, dostawa 24–48 h, 2 lata gwarancji, doradztwo.",
    url: "/",
    images: [
      {
        url: "/images/main/excavator-2025-03-15-06-31-29-utc.webp",
        width: 1200,
        height: 630,
        alt: "Osprzęt do koparek – Mini Team Project",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Osprzęt do koparek – Łyżki Hardox HB500, zrywak | Mini Team Project",
    description:
      "Osprzęt do koparek: łyżki Hardox HB500, łyżki skarpowe, zrywaki, szybkozłącza. Polska produkcja, dostawa 24–48 h, 2 lata gwarancji, doradztwo.",
    images: ["/images/main/excavator-2025-03-15-06-31-29-utc.webp"],
  },
};

const Home = async () => {
  

  return (
    <div className="bg-white">
      {/* SEO via metadata API + JSON-LD */}
      {(() => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const org = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Mini Team Project",
          url: base,
          logo: `${base}/favicon.ico`,
          sameAs: [
            "https://www.facebook.com/",
            "https://www.instagram.com/",
          ],
        };
        const website = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Mini Team Project",
          url: base,
          potentialAction: {
            "@type": "SearchAction",
            target: `${base}/shop?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        };
        const faq = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Jak dobrać łyżkę do maszyn 2–3 t?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Wybierz kategorię „Łyżki kopiące” → zakres 2.3–3 t → preferowany rozmiar.",
              },
            },
            {
              "@type": "Question",
              name: "Jaki jest czas realizacji zamówienia?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Standardowo 48 h od potwierdzenia płatności.",
              },
            },
            {
              "@type": "Question",
              name: "Czy oferujecie montaż zębów?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Tak, koszt +120–270 zł w zależności od modelu.",
              },
            },
          ],
        };
        return (
          <>
            <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
            <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
            <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
          </>
        );
      })()}
      <HomeHero />
      {/* Machine selector only on homepage */}
      <FloatingMachineSelector />
      <Container>
        <AppSection>
          <div id="products" className="mt-4 scroll-mt-28 sm:scroll-mt-32">
            {/* Use curated featured block with local images for strong visual consistency */}
            <FeaturedProducts />
          </div>
        </AppSection>
        {/* Removed "Polecane kategorie"; using AllCategories below for mobile/desktop */}
        <HomeShowcase />
        <AppSection>
          <WhyHardox />
        </AppSection>
        {/* Wszystkie kategorie – przeniesione przed sekcję "Dlaczego Hardox" (widoczne na wszystkich rozdzielczościach) */}
        <AllCategories />
        <AppSection>
          <SevenReasons />
        </AppSection>
        <AppSection>
          <BrandStory />
        </AppSection>
        {/* Realizacje section hidden for now */}
        <BestSellers />
        {/* AllCategories przeniesione wyżej */}
        
        <AppSection>
          <FAQ />
        </AppSection>
        <FinalCTA />
        <LatestBlog />
        {/* Fit Check is mounted globally in layout */}
      </Container>
    </div>
  );
};

export default Home;
