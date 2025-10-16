import React from "react";
import Container from "@/components/Container";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PartsSection from "@/components/PartsSection";
import { 
  Wrench, 
  DollarSign, 
  Shield, 
  Truck, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Heart,
  Sparkles,
  TrendingUp,
  Percent,
  Timer,
  Award
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Części - Okazje | Oszczędź do 40% na Osprzęcie do Koparek | Mini Team Project",
  description: "🔥 Najlepsze okazje na osprzęt do koparek! Części z nadwyżki produkcyjnej, nieodebrane zamówienia, wyprzedaże magazynowe. Oszczędź do 40% na łyżkach, zrywakach, szybkozłączach. Pełna gwarancja 2 lata. Dostawa 48h. Sprawdź teraz!",
  keywords: [
    "części do koparek",
    "osprzęt do koparek okazje", 
    "łyżki do koparek tanie",
    "zrywaki do koparek",
    "szybkozłącza do koparek",
    "części z nadwyżki produkcyjnej",
    "osprzęt budowlany okazje",
    "części do minikoparek",
    "wyprzedaż osprzętu budowlanego",
    "tanie części do koparek",
    "osprzęt do koparek z gwarancją",
    "części do koparek nowe",
    "osprzęt budowlany zniżki",
    "części do koparek dostawa 48h"
  ],
  alternates: { 
    canonical: "/czesci",
    languages: {
      'pl-PL': '/czesci',
    }
  },
  openGraph: {
    title: "Części - Okazje | Oszczędź do 40% na Osprzęcie do Koparek",
    description: "Najlepsze okazje na osprzęt do koparek! Części z nadwyżki produkcyjnej, nieodebrane zamówienia, wyprzedaże. Oszczędź do 40% na łyżkach, zrywakach, szybkozłączach. Pełna gwarancja 2 lata.",
    url: "/czesci",
    siteName: "Mini Team Project",
    images: [
      {
        url: "/images/og-czesci-okazje.jpg",
        width: 1200,
        height: 630,
        alt: "Części - Okazje na osprzęt do koparek - Mini Team Project",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Części - Okazje | Oszczędź do 40% na Osprzęcie do Koparek",
    description: "Najlepsze okazje na osprzęt do koparek! Części z nadwyżki produkcyjnej, nieodebrane zamówienia, wyprzedaże. Oszczędź do 40%!",
    images: ["/images/og-czesci-okazje.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

const CzesciPage = () => {

  return (
    <div className="bg-white">
      {/* Enhanced JSON-LD Structured Data */}
      {(() => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const ld = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Części - Okazje na Osprzęt do Koparek",
          url: `${base}/czesci`,
          description: "Najlepsze okazje na osprzęt do koparek! Części z nadwyżki produkcyjnej, nieodebrane zamówienia, wyprzedaże magazynowe. Oszczędź do 70% na łyżkach, zrywakach, szybkozłączach.",
          mainEntity: {
            "@type": "ItemList",
            name: "Części do koparek - okazje",
            description: "Lista części do koparek dostępnych w promocyjnych cenach",
            numberOfItems: 10,
            itemListElement: [
              {
                "@type": "Product",
                name: "Łyżka Kopiąca 60cm MS03",
                description: "Nieodebrane zamówienie. Stan: nowy, bez śladów użytkowania.",
                brand: "Mini Team Project",
                category: "Łyżki do koparek",
                offers: {
                  "@type": "Offer",
                  price: "1200",
                  priceCurrency: "PLN",
                  availability: "https://schema.org/InStock",
                  priceValidUntil: "2024-12-31",
                  seller: {
                    "@type": "Organization",
                    name: "Mini Team Project"
                  }
                }
              },
              {
                "@type": "Product", 
                name: "Zrywak Korzeni 80cm",
                description: "Część z nadwyżki produkcyjnej. Minimalne ślady magazynowe.",
                brand: "Mini Team Project",
                category: "Zrywaki do koparek",
                offers: {
                  "@type": "Offer",
                  price: "850",
                  priceCurrency: "PLN",
                  availability: "https://schema.org/InStock",
                  priceValidUntil: "2024-12-31",
                  seller: {
                    "@type": "Organization",
                    name: "Mini Team Project"
                  }
                }
              }
            ]
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Start", item: base },
              { "@type": "ListItem", position: 2, name: "Części - Okazje", item: `${base}/czesci` },
            ],
          },
          publisher: {
            "@type": "Organization",
            name: "Mini Team Project",
            url: base,
            logo: {
              "@type": "ImageObject",
              url: `${base}/images/logo_mini_team_project.png`
            }
          },
          potentialAction: {
            "@type": "SearchAction",
            target: `${base}/czesci?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        };
        return <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      })()}

      {/* Hero Section */}
      <section className="relative bg-white py-16 md:py-24 overflow-hidden border-b border-gray-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <Container>
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>LIMITOWANE OKAZJE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-orange-600">
                Części do Koparek - Okazje
              </span>
              <br />
              <span className="text-gray-800">Oszczędź do 40% na Osprzęcie</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              <strong>Nie przegap wyjątkowych okazji!</strong> Części z nadwyżki produkcyjnej, nieodebrane zamówienia, 
              wyprzedaże magazynowe. <strong className="text-orange-600">Łyżki, zrywaki, szybkozłącza w cenach, które Cię zaskoczą!</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="#produkty">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300">
                  <Wrench className="w-5 h-5 mr-2" />
                  Zobacz Części
                </Button>
              </Link>
              <Link href="/kontakt">
                <Button variant="outline" size="lg" className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold">
                  <Heart className="w-5 h-5 mr-2" />
                  Zapytaj o Dostępność
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">-40%</div>
                <div className="text-sm text-gray-600 font-medium">Oszczędności</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">48h</div>
                <div className="text-sm text-gray-600 font-medium">Dostawa</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">2 lata</div>
                <div className="text-sm text-gray-600 font-medium">Gwarancja</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">4.9/5</div>
                <div className="text-sm text-gray-600 font-medium">Ocena</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose Parts Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Dlaczego Warto Wybrać Nasze Części?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <strong>To nie są uszkodzone produkty!</strong> To wyjątkowe okazje na wysokiej jakości <strong>osprzęt do koparek</strong> w cenach, które wydają się niemożliwe! 
              Wszystkie części objęte są pełną gwarancją 2 lata i dostawą w 48 godzin.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Oszczędności do 40% - To Prawie Za Darmo!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Części z nadwyżki produkcyjnej to <strong>osprzęt do koparek</strong> wysokiej jakości w cenach, które wydają się niemożliwe! 
                  <strong> Idealne rozwiązanie dla każdego budżetu - od małych firm po duże przedsiębiorstwa.</strong>
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Dostępne Natychmiast - Nie Czekaj!</h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Klienci nie odebrali zamówień - Twoja szansa!</strong> Nowy <strong>osprzęt do koparek</strong> w cenach, które Cię zaskoczą - <strong>dostępne od ręki, bez czekania!</strong>
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pełna Gwarancja - Bez Ryzyka!</h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Wszystkie części do koparek objęte są pełną gwarancją 2 lata!</strong> Jakość Hardox HB500, 
                  profesjonalne wykonanie, pełne wsparcie techniczne. <strong>Kupujesz bez ryzyka!</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-orange-500 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <Container>
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-full">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">PROMOCJA TYGODNIA</h2>
              <div className="p-3 bg-white/20 rounded-full">
                <Percent className="w-8 h-8" />
              </div>
            </div>
            <p className="text-lg md:text-xl mb-6 font-medium">
              <strong>Dodatkowe 10% zniżki</strong> na wszystkie części przy zakupie powyżej 2000 zł! 
              <strong> To już prawie za darmo!</strong>
            </p>
            <div className="inline-flex items-center justify-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-full">
              <Timer className="w-4 h-4" />
              <span>Promocja ważna do końca tygodnia</span>
            </div>
          </div>
        </Container>
      </section>

      {/* What You Can Find Section */}
      <section id="produkty" className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Co Możesz Znaleźć - Okazje, Które Cię Zaskoczą!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <strong>Sprawdź nasze aktualne okazje na osprzęt do koparek!</strong> Ceny, które wydają się niemożliwe, 
              ale są prawdziwe. <strong>Nie przegap tej szansy!</strong>
            </p>
          </div>

          {/* Parts Grid */}
          <PartsSection />

          {/* Special Offers Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="border border-blue-200 shadow-sm bg-blue-50 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Darmowa Dostawa - Bez Ukrytych Kosztów!</h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      <strong>Przy zakupie powyżej 4000 zł dostawa gratis!</strong> Normalnie 120 zł. Bez ukrytych kosztów, bez niespodzianek!
                    </p>
                    <Badge className="bg-blue-500 text-white px-4 py-1">Aktywne</Badge>
                  </CardContent>
                </Card>

            <Card className="border border-purple-200 shadow-sm bg-purple-50 hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Szybka Realizacja - Nie Czekaj!</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  <strong>Części dostępne od ręki - wysyłka w 24h!</strong> Nie czekaj tygodniami na zamówienie!
                </p>
                <Badge className="bg-purple-500 text-white px-4 py-1">Aktywne</Badge>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <div className="bg-orange-50 rounded-3xl p-8 border border-orange-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nie Znalazłeś Tego Czego Szukasz? <strong>Nie Martw Się!</strong>
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                <strong>Nasze okazje zmieniają się regularnie!</strong> Skontaktuj się z nami, a poinformujemy Cię 
                o nowych dostępnych częściach lub pomożemy znaleźć alternatywę. <strong>Zawsze znajdziemy rozwiązanie!</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kontakt">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4">
                    <Heart className="w-5 h-5 mr-2" />
                    Zapytaj o Dostępność
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" size="lg" className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4">
                    <Truck className="w-5 h-5 mr-2" />
                    Zobacz Pełną Ofertę
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Najczęściej Zadawane Pytania
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Czy części do koparek z nadwyżki produkcyjnej są uszkodzone?</h3>
                <p className="text-gray-600">
                  <strong>Absolutnie nie!</strong> To są <strong>części do koparek</strong> wysokiej jakości, które z różnych powodów nie trafiły do pierwotnych odbiorców. 
                  Mogą mieć minimalne ślady magazynowe, ale są w pełni funkcjonalne i objęte gwarancją 2 lata. <strong>To prawdziwe okazje!</strong>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Czy mogę zwrócić części do koparek z okazji?</h3>
                <p className="text-gray-600">
                  <strong>Oczywiście!</strong> Wszystkie nasze <strong>części do koparek</strong> objęte są standardową polityką zwrotów. Masz 14 dni na zwrot 
                  bez podania przyczyny, a także pełną gwarancję 2 lata na wszystkie osprzęt. <strong>Kupujesz bez ryzyka!</strong>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Jak często pojawiają się nowe okazje na części do koparek?</h3>
                <p className="text-gray-600">
                  <strong>Nowe okazje pojawiają się nieregularnie!</strong> Nowe <strong>części do koparek</strong> z nadwyżki produkcyjnej pojawiają się nieregularnie - czasami kilka razy w miesiącu, 
                  czasami rzadziej. <strong>Najlepiej skontaktować się z nami, aby być informowanym o nowych okazjach - nie przegapisz żadnej!</strong>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Jakie części do koparek są dostępne w okazjach?</h3>
                <p className="text-gray-600">
                  <strong>W naszych okazjach znajdziesz wszystko!</strong> <strong>Łyżki do koparek</strong>, <strong>zrywaki do koparek</strong>, 
                  <strong>szybkozłącza do koparek</strong>, <strong>grabie do koparek</strong>, <strong>wiertnice</strong> i inne osprzęt budowlany w cenach, które Cię zaskoczą!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Czy części do koparek z okazji mają gwarancję?</h3>
                <p className="text-gray-600">
                  <strong>Oczywiście!</strong> Wszystkie <strong>części do koparek</strong> z okazji objęte są pełną gwarancją 2 lata, tak samo jak standardowe produkty. 
                  Jakość Hardox HB500, profesjonalne wykonanie, pełne wsparcie techniczne. <strong>Kupujesz bez ryzyka!</strong>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Jak szybko dostanę części do koparek z okazji?</h3>
                <p className="text-gray-600">
                  <strong>Błyskawicznie!</strong> <strong>Części do koparek</strong> z okazji są dostępne od ręki - dostawa w 48 godzin. 
                  Przy zakupie powyżej 1500 zł dostawa gratis! <strong>Nie czekaj tygodniami!</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CzesciPage;
