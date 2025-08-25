import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import MediaTabs from "@/components/MediaTabs";
import PriceView from "@/components/PriceView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/sanity/queries";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { Shield, StarIcon, Truck, Award, CheckCircle2, Phone, Factory, BadgeCheck, Package, Hammer, Ruler, Gauge, Box, Wrench, Tag, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { notFound } from "next/navigation";
import React from "react";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
// JSON-LD scripts will use plain <script> to avoid hydration issues
import ProductConfigurator from "@/components/ProductConfigurator";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = `${product?.name} – MTT Osprzęt do koparek`;
  const description = String(product?.description || "Osprzęt do koparek: Hardox HB500, dostawa 48h.").slice(0, 160);
  const cover = (product?.images?.[0] && (typeof product.images[0] === 'object' && (product.images[0] as any).asset?._ref ? urlFor(product.images[0]).url() : (product as any).cover)) || undefined;
  const url = `/product/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: cover ? [{ url: cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }
  // AI-powered podobne produkty - inteligentne rekomendacje
  const getCurrentProductData = (product: any) => {
    const categories = product?.categories?.map((cat: any) => cat?.title || cat?._ref || '').filter(Boolean) || [];
    const name = product?.name?.toLowerCase() || '';
    const price = typeof product?.price === 'number' ? product.price : (typeof product?.basePrice === 'number' ? product.basePrice : 0);
    const priceTier = product?.priceTier || '';
    const specifications = product?.specifications || {};
    
    return {
      categories,
      name,
      price,
      priceTier,
      specifications,
      isGrabie: name.includes('grabie'),
      isLyzka: name.includes('łyżk') || name.includes('lyzk'),
      isZrywak: name.includes('zrywak') || name.includes('ripper'),
      widthCm: specifications?.widthCm || 0,
      toothCount: specifications?.toothCount || 0,
      toothThickness: specifications?.toothThickness || 0
    };
  };

  const currentProduct = getCurrentProductData(product);
  
  // Check for manual similar products first, then fall back to AI recommendations
  let similar: any[] = [];
  
  // First check if product has manually set similar products
  if (product?.similarProducts && product.similarProducts.length > 0) {
    similar = product.similarProducts.slice(0, 6); // Use manual selection, max 6
  } else if (product?.recommendationSettings?.enableAutoRecommendations !== false) {
    // Use AI-powered recommendations with custom weights if available
    const settings = product?.recommendationSettings?.priorityFactors || {};
    const categoryWeight = settings.categoryWeight || 40;
    const typeWeight = settings.typeWeight || 30;
    const priceWeight = settings.priceWeight || 15;
    const specWeight = settings.specWeight || 15;
    
    // Advanced similarity query with multiple criteria
    const similarityQuery = `*[_type=="product" && slug.current != $slug && defined(name) && recommendationSettings.excludeFromRecommendations != true] {
      ..., 
      "slug": slug.current,
      "categories": categories[]->{title},
      description,
      "similarity_score": 0
    }`;
    
    const allProducts = await client.fetch(similarityQuery, { slug });
  
    // AI-powered similarity scoring algorithm with custom weights
    const calculateSimilarity = (productA: any, productB: any) => {
      let score = 0;
      const dataB = getCurrentProductData(productB);
      
      // Category similarity (customizable weight)
      const categoryOverlap = productA.categories.filter((cat: string) => 
        dataB.categories.some((catB: string) => catB.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(catB.toLowerCase()))
      ).length;
      if (categoryOverlap > 0) score += categoryWeight * (categoryOverlap / Math.max(productA.categories.length, dataB.categories.length));
      
      // Product type similarity (customizable weight)
      if ((productA.isGrabie && dataB.isGrabie) || 
          (productA.isLyzka && dataB.isLyzka) || 
          (productA.isZrywak && dataB.isZrywak)) {
        score += typeWeight;
      }
      
      // Price range similarity (customizable weight)
      if (productA.price > 0 && dataB.price > 0) {
        const priceDifference = Math.abs(productA.price - dataB.price) / Math.max(productA.price, dataB.price);
        if (priceDifference < 0.3) score += priceWeight * (1 - priceDifference);
      }
      
      // Size/specification similarity (customizable weight)
      if (productA.widthCm > 0 && dataB.widthCm > 0) {
        const sizeDifference = Math.abs(productA.widthCm - dataB.widthCm) / Math.max(productA.widthCm, dataB.widthCm);
        if (sizeDifference < 0.5) score += (specWeight * 0.6) * (1 - sizeDifference);
      }
      
      if (productA.toothThickness > 0 && dataB.toothThickness > 0) {
        const thicknessDifference = Math.abs(productA.toothThickness - dataB.toothThickness) / Math.max(productA.toothThickness, dataB.toothThickness);
        if (thicknessDifference < 0.5) score += (specWeight * 0.4) * (1 - thicknessDifference);
      }
      
      return score;
    };
    
    // Calculate similarity scores and sort
    const productsWithScores = allProducts.map((p: any) => ({
      ...p,
      similarity_score: calculateSimilarity(currentProduct, p)
    }));
    
    // Filter and sort by similarity score, then by stock/availability
    similar = productsWithScores
      .filter((p: any) => p.similarity_score > 10) // Only show products with meaningful similarity
      .sort((a: any, b: any) => {
        // Primary sort: similarity score
        if (b.similarity_score !== a.similarity_score) {
          return b.similarity_score - a.similarity_score;
        }
        // Secondary sort: prioritize in-stock items
        const aStock = (a.stock || 0) > 0 ? 1 : 0;
        const bStock = (b.stock || 0) > 0 ? 1 : 0;
        if (bStock !== aStock) return bStock - aStock;
        // Tertiary sort: by price (ascending)
        return (a.price || a.basePrice || 0) - (b.price || b.basePrice || 0);
      })
      .slice(0, 6); // Show up to 6 similar products
  }
  const isPhoneOnly =
    typeof (product as any)?.price === "string" ||
    typeof (product as any)?.priceText === "string" ||
    (typeof (product as any)?.basePrice === "number" && (product as any)?.basePrice === 0);
  const toSrc = (img: any): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img || null;
    if (typeof img === "object" && img.url) return img.url || null;
    if (typeof img === "object" && img.asset?._ref) {
      try {
        return urlFor(img).url();
      } catch {
        return null;
      }
    }
    return null;
  };
  return (
    <div className="bg-white">
      {/* JSON-LD Product + FAQ */}
      {(() => {
        const ld: any = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product?.name,
          description: product?.description,
          image: product?.images?.length ? product.images.map((img: any) => (typeof img === 'object' && img.asset?._ref ? urlFor(img).url() : (img?.url || ''))) : undefined,
          offers: {
            "@type": "Offer",
            availability: (product?.stock as number) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            priceCurrency: "PLN",
            price: typeof (product as any)?.price === 'number' ? (product as any).price : undefined,
          },
          brand: product?.brand ? { "@type": "Brand", name: "MTT" } : undefined,
        };
        const faq = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Jak dobrać odpowiednią łyżkę do mojej maszyny?", acceptedAnswer: { "@type": "Answer", text: "Sprawdź wagę maszyny i rodzaj mocowania (np. MS01, MS03, CW05). Jeśli masz wątpliwości, zadzwoń: 782-851-962." } },
            { "@type": "Question", name: "Ile trwa dostawa?", acceptedAnswer: { "@type": "Answer", text: "Standardowo 24–48 h na terenie Polski. Produkty z magazynu wysyłamy tego samego lub następnego dnia." } },
            { "@type": "Question", name: "Czy mogę zwrócić produkt?", acceptedAnswer: { "@type": "Answer", text: "Tak, masz 14 dni na zwrot. Produkt musi być nieużywany i w oryginalnym stanie." } }
          ]
        };
        return (
          <>
            <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
            <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
          </>
        );
      })()}
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Start</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[var(--color-brand-orange)]">Oferta</Link>
            <span>/</span>
            <span className="text-gray-900 line-clamp-1">{product?.name}</span>
          </div>
        </Container>
      </div>
      <Container className="py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: images + trust */}
          <div>
            {product?.images ? (() => {
              // Decide technical drawings by priceTier if available, otherwise infer from category text
              const tier = String((product as any)?.priceTier || "").toLowerCase();
              const catTitles: string[] = Array.isArray((product as any)?.categories)
                ? ((product as any).categories as Array<{ title?: string } | null>).map((c) => c?.title || "").filter(Boolean)
                : [];
              const catText = catTitles.join(" ").toLowerCase();
              let files: string[] = [];
              
              // Check if product has a specific technical drawing (for new Grabie products)
              const technicalDrawing = (product as any)?.technicalDrawing;
              if (technicalDrawing?.url) {
                // Extract just the filename from the URL path
                const fileName = technicalDrawing.url.split('/').pop() || technicalDrawing.url;
                files = [fileName];
              } else {
                // Fallback to tier-based logic for older products
                const isRipper = /zrywak|ripper/.test((product?.name || "")?.toLowerCase() + " " + catText + " " + (product?.description || "").toLowerCase());
                const ripperTier = String((product as any)?.ripperTier || "").toLowerCase();
                if (isRipper) {
                // Zrywaki mają inne zakresy: 1–1.5t, 2–4t, 4–8t
                if (ripperTier === '1-1.5t' || /1\s*[–-]?\s*1\.5\s*t|1-1\.5t/.test(tier) || /1\s*-\s*1\.5\s*t/.test((product?.name||"").toLowerCase())) {
                  files = ["ripper_1-1.5t.png", "rysunek_techniczny_ripper1-1.5tony.pdf"]; // PNG + PDF
                } else if (ripperTier === '2-4t' || /2\s*[–-]?\s*4\s*t|2-4t/.test((product?.name||"").toLowerCase() + " " + (product?.description||"").toLowerCase())) {
                  files = [
                    "zrywak_pojedynczy_2-4t.png",
                    "zrywak_podwojny_2-4t.png",
                    "rysunek_techniczny_zrywak_pojedynczy_2-4_tony.pdf",
                    "rysunek_techniczniczny_zrywak_podwojny_2-4_tony.pdf",
                  ];
                } else if (ripperTier === '4-8t' || /4\s*[–-]?\s*8\s*t|4-8t/.test((product?.name||"").toLowerCase() + " " + (product?.description||"").toLowerCase())) {
                  files = [
                    "zrywak_pojedynczy_4-8t.png",
                    "zrywak_podwojny_4-8t.png",
                    "rysunek_techniczny_zrywak_pojedynczy_4-8_tony.pdf",
                    "rysunek_techniczny_zrywak_podwojny_4-8_tony.pdf",
                  ];
                }
              } else {
              if (tier === '1-1.5t' || /1\s*[–-]\s*1\.5\s*t/.test(catText)) {
                // 1–1.5 t: use two base visuals
                files = [
                  "lyska_skarpowa.png",
                  "lyska_skarpowa_2.png",
                ];
              } else if (tier === '1.5-2.3t' || /1\.5\s*[–-]\s*2\.3\s*t/.test(catText)) {
                // 1.5–2.3 t: provided set
                files = [
                  "lyzka_hydr_1.5_2.3.png",
                  "lyzka_hydr_2_1.5_2.3.png",
                  "lyska_1.5_2.3.png",
                  "lyska_1.5_2.3_2.png",
                ];
              } else if (tier === '2.3-3t' || /2\.3\s*[–-]\s*3\s*t/.test(catText)) {
                // 2.3–3 t: last image differs vs 1.5–2.3 t
                files = [
                  "lyzka_hydr_2.3_3.5.png",
                  "lyzka_hydr_2.3_3.png",
                ];
              } else if (tier === '3-5t' || /3\s*[–-]\s*5\s*t/.test(catText)) {
                // 3–5 t: awaiting final assets – keep gallery default
                files = [];
              }
              }
              }

              // Special case: Wiertnica – always show the three mount system PDFs if present in public assets
              if (/wiertnic/.test(String((product as any)?.name || "").toLowerCase())) {
                files = [
                  "rysunek_techniczny_wahacza_gietego.pdf",
                  "rysunek_techniczny_wahacz_kostka.pdf",
                  "rysunek_techniczny_premium.pdf",
                ];
              }
              return (
                <MediaTabs
                  slug={slug}
                  files={files}
                  defaultTab={files.length ? "tech" : "gallery"}
                  gallery={<ImageView images={product?.images} isStock={product?.stock} />}
                />
              );
            })() : null}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                <Truck className="h-4 w-4" /> Dostawa 48 h
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <BadgeCheck className="h-4 w-4" /> Hardox HB500
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Award className="h-4 w-4" /> 2 lata gwarancji
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                <Factory className="h-4 w-4" /> Polska produkcja
              </span>
            </div>
          </div>

          {/* Right: info + price + specs + order */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-red-600 text-white">HARDOX HB500</Badge>
                <Badge className="bg-green-600 text-white">2 LATA GWARANCJI</Badge>
                {product?.specifications?.quickCoupler ? (
                  <Badge className="bg-blue-600 text-white">{product.specifications.quickCoupler}</Badge>
                ) : null}
              </div>
              <div className="flex items-center gap-0.5 text-xs">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} size={12} className="text-shop_light_green" fill="#3b9c3c" />
                ))}
                <p className="font-semibold">(127 opinii)</p>
              </div>
            </div>
            <div className="space-y-3 border-t border-b border-gray-200 py-5">
              <div className="flex items-baseline gap-2">
                <PriceView price={product?.price as number | string | undefined} discount={product?.discount} priceOlx={product?.priceOlx as number | string | undefined} phoneOrderOnly={Boolean((product as any)?.phoneOrderOnly)} className="text-2xl font-bold" />
              </div>
              {isPhoneOnly && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 inline-flex items-center gap-2">
                  <span>Ten produkt zamówisz wyłącznie telefonicznie – przygotujemy ofertę i termin.</span>
                  <a href="tel:+48782851962" className="underline underline-offset-2 font-semibold">Zadzwoń: 782-851-962</a>
                </div>
              )}
              <p className={`px-4 py-1.5 text-sm inline-block font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}>
                {(product?.stock as number) > 0 ? `W magazynie: ${product?.stock}` : "Brak w magazynie"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-600" /> Darmowe doradztwo</span>
                <span className="flex items-center gap-1"><Package className="h-4 w-4 text-green-600" /> Bezpieczne pakowanie</span>
                <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-green-600" /> Zwrot 14 dni</span>
              </div>
              {/* Stripe security */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-[var(--color-brand-orange)]" />
                <span className="font-semibold">Bezpieczne płatności:</span>
                <span className="text-gray-900 font-medium">Stripe</span>
                <span>• 3D Secure • Szyfrowanie TLS • Apple Pay / Google Pay</span>
              </div>
            </div>
            <div className="flex items-center gap-3 my-4">
              <AddToCartButton product={product} />
              <FavoriteButton showProduct={true} product={product} />
              {isPhoneOnly && (
                <a href="tel:+48782851962" className="ml-auto inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border hover:bg-gray-50">
                  <Phone className="h-4 w-4" /> Zamów telefonicznie
                </a>
              )}
            </div>

            {/* Configurator for mount systems and drill bits */}
            {((product as any)?.mountSystems?.length || (product as any)?.drillBits?.length) ? (
              <ProductConfigurator product={product as any} />
            ) : null}

            {/* Specyfikacja przeniesiona niżej nad podobne produkty */}

            {/* Zamów w 60 sekund */}
            <Card className="bg-gradient-to-br from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 border-[var(--color-brand-orange)]/20">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--color-brand-red)]">Zamów w 60 sekund</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input suppressHydrationWarning placeholder="Imię i nazwisko" />
                <Input suppressHydrationWarning placeholder="Numer telefonu" />
                <Input suppressHydrationWarning placeholder="Adres email" />
                <Button className="w-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">ZAMAWIAM - DOSTAWA 48H</Button>
                <div className="text-xs text-gray-600 flex items-center gap-2"><Shield className="h-4 w-4" />🔒 Bezpieczne zamówienie | 📋 Faktura VAT</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Specyfikacja techniczna – pełna szerokość */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Specyfikacja techniczna</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
            {/* Kluczowe parametry */}
            <div className="p-3 rounded-lg border bg-white">
              <div className="text-xs uppercase text-gray-500 mb-2">Kluczowe parametry</div>
              <div className="space-y-2">
                {product?.specifications?.widthCm ? (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-[var(--color-brand-orange)]" />
                    <span className="text-gray-600">Szerokość robocza:</span>
                    <span className="font-semibold ml-auto">{product.specifications.widthCm} cm</span>
                  </div>
                ) : null}
                {product?.specifications?.pinDiameterMm ? (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-[var(--color-brand-orange)]" />
                    <span className="text-gray-600">Średnica sworznia:</span>
                    <span className="font-semibold ml-auto">{product.specifications.pinDiameterMm} mm</span>
                  </div>
                ) : null}
                {product?.specifications?.volumeM3 ? (
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-[var(--color-brand-orange)]" />
                    <span className="text-gray-600">Pojemność:</span>
                    <span className="font-semibold ml-auto">{product.specifications.volumeM3} m³</span>
                  </div>
                ) : null}
                {(product as any)?.toothQty ? (
                  <div className="flex items-center gap-2">
                    <Hammer className="h-4 w-4 text-[var(--color-brand-orange)]" />
                    <span className="text-gray-600">Ilość zębów:</span>
                    <span className="font-semibold ml-auto">{(product as any).toothQty}</span>
                  </div>
                ) : null}
                {product?.specifications?.toothThickness ? (
                  <div className="flex items-center gap-2">
                    <Hammer className="h-4 w-4 text-[var(--color-brand-orange)]" />
                    <span className="text-gray-600">Grubość zęba:</span>
                    <span className="font-semibold ml-auto">{product.specifications.toothThickness} mm</span>
                  </div>
                ) : null}
                {(product as any)?.priceTier ? (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[var(--color-brand-orange)]" />
                    <span className="text-gray-600">Zakres maszyn:</span>
                    <span className="font-semibold ml-auto">{(product as any).priceTier}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Kompatybilność i mocowania */}
            <div className="p-3 rounded-lg border bg-white">
              <div className="text-xs uppercase text-gray-500 mb-2">Kompatybilność i mocowania</div>
              {product?.specifications?.quickCoupler ? (
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-4 w-4 text-[var(--color-brand-orange)]" />
                  <span className="text-gray-600">Szybkozłącze:</span>
                  <span className="font-semibold ml-auto">{product.specifications.quickCoupler}</span>
                </div>
              ) : null}
              {product?.specifications?.machineCompatibility?.length ? (
                <div className="flex flex-wrap gap-1">
                  {product.specifications.machineCompatibility.map((m: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 text-[11px] rounded-md border bg-gray-50 text-gray-800">{m}</span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500">Brak danych o kompatybilności</div>
              )}
            </div>

            {/* Cechy */}
            <div className="p-3 rounded-lg border bg-white">
              <div className="text-xs uppercase text-gray-500 mb-2">Cechy</div>
              {product?.specifications?.features?.length ? (
                <div className="flex flex-wrap gap-1">
                  {product.specifications.features.map((f: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 text-[11px] rounded-md bg-gray-100 text-gray-800">{f}</span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500">Brak dodatkowych cech</div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky CTA mobile - Enhanced with better positioning */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <PriceView price={product?.price as number | string | undefined} discount={product?.discount} priceOlx={product?.priceOlx as number | string | undefined} phoneOrderOnly={Boolean((product as any)?.phoneOrderOnly)} className="text-lg font-bold" />
              </div>
              {isPhoneOnly ? (
                <a href="tel:+48782851962" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Phone className="h-5 w-5" /> 
                  <span>Zadzwoń</span>
                </a>
              ) : (
                <div className="min-w-[140px]"><AddToCartButton product={product} /></div>
              )}
            </div>
          </div>
          {/* Safe area padding for iPhone */}
          <div className="h-safe-area-inset-bottom"></div>
        </div>
        
        {/* Add bottom padding to content on mobile to prevent overlay */}
        <div className="md:hidden h-24"></div>

        {/* Enhanced Similar Products Section */}
        {similar?.length ? (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-3 rounded-full border border-orange-200/50 mb-4">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold text-gray-700">Polecane produkty</span>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Podobne produkty</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Sprawdź inne produkty z tej samej kategorii lub o podobnych specyfikacjach
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similar.map((p: { _id: string; images?: Array<{ asset?: { _ref?: string } } | { url?: string } | string>; name: string; description?: string; price?: number | string; discount?: number; slug: string; stock?: number; categories?: Array<{ title?: string }>; similarity_score?: number }, index: number) => (
                <div key={p._id} className="group relative">
                  {/* Top Products Badge */}
                  {index < 2 && (
                    <div className="absolute -top-2 -left-2 z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white">
                      ⭐ TOP
                    </div>
                  )}
                  
                  <Card className="h-full overflow-hidden bg-white border border-gray-200/60 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02] group">
                    {/* Premium Gradient Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Floating Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    
                    <CardHeader className="p-0 relative z-10">
                      <div className="relative aspect-[5/4] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                        {/* Premium Image Background Pattern */}
                        <div className="absolute inset-0 opacity-5" 
                             style={{
                               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
                               backgroundSize: '20px 20px'
                             }} />
                        
                        {(() => { 
                          const s = toSrc(p?.images?.[0]); 
                          return s ? (
                            <Image 
                              src={s} 
                              alt={p.name} 
                              fill 
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-contain transition-all duration-700 ease-out p-4 group-hover:scale-110 group-hover:rotate-1 group-hover:drop-shadow-2xl" 
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <div className="w-16 h-16 bg-gray-300 rounded-full opacity-20" />
                            </div>
                          ); 
                        })()}
                        
                        {/* Stock Indicator */}
                        <div className="absolute top-3 right-3 z-20">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${
                            (p?.stock || 0) === 0 
                              ? "bg-red-50/90 text-red-700 border-red-200" 
                              : "bg-emerald-50/90 text-emerald-700 border-emerald-200"
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              (p?.stock || 0) === 0 ? "bg-red-400" : "bg-emerald-400"
                            } ${(p?.stock || 0) !== 0 ? "animate-pulse" : ""}`} />
                            {(p?.stock || 0) > 0 ? `${p?.stock}` : "0"}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 relative z-10 bg-white/80 backdrop-blur-sm">
                      {/* Categories */}
                      {(() => {
                        // Filter out empty categories and ensure we have valid titles
                        const validCategories = p?.categories?.filter(cat => cat?.title && cat.title.trim() !== '') || [];
                        
                        if (validCategories.length === 0) {
                          // Don't show anything if no categories - looks cleaner
                          return null;
                        }
                        
                        return (
                          <div className="flex flex-wrap gap-2">
                            {validCategories.slice(0, 2).map((cat, idx) => (
                              <span key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200/50">
                                {cat.title}
                              </span>
                            ))}
                            {validCategories.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                                +{validCategories.length - 2}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                      
                      {/* Product Title */}
                      <Link href={`/product/${p.slug}`} className="group/title">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight transition-all duration-300 group-hover/title:text-[var(--color-brand-orange)] group-hover/title:underline underline-offset-4">
                          {p.name}
                        </h3>
                      </Link>
                      
                      {/* Product Description */}
                      {p?.description && (
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                      
                      {/* Price */}
                      <div className="mt-auto pt-4 border-t border-gray-100 space-y-4">
                        <PriceView 
                          price={p.price as number | string | undefined} 
                          discount={p.discount} 
                          className="text-xl font-bold"
                        />
                        
                        {/* Action Button */}
                        <Link 
                          href={`/product/${p.slug}`} 
                          className="block w-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] hover:from-[var(--color-brand-red)] hover:to-[var(--color-brand-orange)] text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
                        >
                          Zobacz szczegóły
                        </Link>
                      </div>
                    </CardContent>
                    
                    {/* Premium Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Bottom CTA for Similar Products */}
            <div className="mt-12 text-center bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Potrzebujesz pomocy w doborze?</h3>
              <p className="text-gray-600 mb-6">
                Nasi eksperci pomogą Ci wybrać idealny produkt dla Twojej maszyny
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+48782851962"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span>📞</span>
                  <span>Zadzwoń: 782-851-962</span>
                </a>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span>🛍️</span>
                  <span>Zobacz wszystkie produkty</span>
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {/* Jak powstaje nasz osprzęt */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Jak powstaje nasz osprzęt</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-white flex items-start gap-3">
              <Factory className="h-5 w-5 text-[var(--color-brand-orange)] mt-1" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Cięcie i przygotowanie</div>
                <div className="text-gray-600">Precyzyjne cięcie Hardox HB500 – powtarzalność i dokładność.</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-white flex items-start gap-3">
              <Hammer className="h-5 w-5 text-[var(--color-brand-orange)] mt-1" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Spawanie i montaż</div>
                <div className="text-gray-600">Doświadczeni spawacze, sprawdzone procedury i przyrządy.</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-white flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-[var(--color-brand-orange)] mt-1" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Kontrola jakości</div>
                <div className="text-gray-600">Pomiary, testy obciążeniowe i dopuszczenie do wysyłki.</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-white flex items-start gap-3">
              <Truck className="h-5 w-5 text-[var(--color-brand-orange)] mt-1" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Wysyłka 48 h</div>
                <div className="text-gray-600">Bezpieczne pakowanie i szybka dostawa na plac budowy.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dlaczego Hardox HB500? */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Dlaczego Hardox HB500?</h2>
          <p className="text-center text-gray-600 mb-6">3× dłuższa żywotność w porównaniu do standardowej stali – mniej przestojów, więcej pracy.</p>
          <div className="max-w-3xl mx-auto p-5 border rounded-xl bg-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Stal standardowa</span>
                <span>~800 h</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-gray-400 w-1/3" />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700 mt-4">
                <span>Hardox HB500</span>
                <span>~2400 h</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-[var(--color-brand-orange)] w-[85%]" />
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg text-center">Mniej wymian i serwisu</div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">Więcej godzin pracy</div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">Niższy koszt eksploatacji</div>
            </div>
          </div>
        </div>

        {/* Certyfikaty i gwarancje */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Certyfikaty i gwarancje</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-white flex items-start gap-3">
              <Shield className="h-5 w-5 text-[var(--color-brand-orange)] mt-1" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">2 lata gwarancji</div>
                <div className="text-gray-600">Pełna rękojmia na wady materiałowe i wykonanie.</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-white flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-[var(--color-brand-orange)] mt-1" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Certyfikowany materiał</div>
                <div className="text-gray-600">Hardox HB500 z atestem – śledzimy partie materiałowe.</div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-white flex items-start gap-3">
              <Package className="h-5 w-5 text-[var(--color-brand-orange)] mt-1" />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Bezpieczna dostawa</div>
                <div className="text-gray-600">Solidne opakowanie, ubezpieczona przesyłka.</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Najczęstsze pytania</h2>
          <div className="max-w-3xl mx-auto bg-white border rounded-xl p-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>Jak dobrać odpowiednią łyżkę do mojej maszyny?</AccordionTrigger>
                <AccordionContent>Sprawdź wagę maszyny i rodzaj mocowania (np. MS01, MS03, CW05). W opisie produktu podajemy zgodność – jeśli masz wątpliwości, zadzwoń: <a href="tel:+48782851962" className="underline hover:no-underline">782-851-962</a>.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Ile trwa dostawa?</AccordionTrigger>
                <AccordionContent>Standardowo 24–48 h na terenie Polski. Produkty dostępne na magazynie wysyłamy tego samego lub następnego dnia roboczego.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Czy mogę zwrócić produkt?</AccordionTrigger>
                <AccordionContent>Tak, masz 14 dni na zwrot. Produkt musi być nieużywany i w oryginalnym stanie. Wystawiamy fakturę VAT.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Czy montujecie zęby / szybkozłącza?</AccordionTrigger>
                <AccordionContent>Oferujemy opcjonalne zęby oraz przygotowanie pod popularne szybkozłącza. Skontaktuj się, aby dopasować konfigurację do Twojej maszyny.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SingleProductPage;
