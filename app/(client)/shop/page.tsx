import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import React, { Suspense } from "react";
import Container from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sklep – Osprzęt do koparek | Łyżki, zrywak, szybkozłącza",
  description: "Oferta Mini Team Project: łyżki kopiące, skarpowe, zrywaki, szybkozłącza. Hardox HB500, dostawa 48 h.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Sklep – Osprzęt do koparek | Łyżki, zrywak, szybkozłącza",
    description: "Oferta Mini Team Project: łyżki kopiące, skarpowe, zrywaki, szybkozłącza. Hardox HB500, dostawa 48 h.",
    url: "/shop",
  },
};

const ShopPage = async () => {
  const categories = await getCategories();
  return (
    <div className="bg-white">
      {/* JSON-LD for CollectionPage + ItemList */}
      {(() => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const ld = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Sklep – Osprzęt do koparek",
          url: `${base}/shop`,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Start", item: base },
              { "@type": "ListItem", position: 2, name: "Oferta", item: `${base}/shop` },
            ],
          },
        };
        return <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      })()}
      <Container>
        <Suspense fallback={<div>Loading...</div>}>
          <Shop categories={categories} brands={[]} />
        </Suspense>
      </Container>
    </div>
  );
};

export default ShopPage;
