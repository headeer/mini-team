import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
// import FavoriteButton from "@/components/FavoriteButton";
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
// import ProductConfigurator from "@/components/ProductConfigurator";
// import ABCDGuide from "@/components/ABCDGuide";
// import BucketConfigurator from "@/components/BucketConfigurator";
// import ProminentTeethOption from "@/components/ProminentTeethOption";
import ProductPageClient from "@/components/ProductPageClient";

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

  // Define variables for the component
  const hasKeyParams = Boolean(
    product?.specifications?.widthCm ||
    product?.specifications?.pinDiameterMm ||
    product?.specifications?.volumeM3 ||
    (product as any)?.toothQty ||
    product?.specifications?.toothThickness ||
    (product as any)?.priceTier
  );
  const hasCompat = Boolean(
    product?.specifications?.quickCoupler ||
    (product?.specifications?.machineCompatibility?.length || 0) > 0
  );
  const hasFeatures = (product?.specifications?.features?.length || 0) > 0;
  const isPhoneOnly = Boolean((product as any)?.phoneOrderOnly);
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
      {/* JSON-LD Product + Breadcrumb + FAQ */}
      {(() => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
        const breadcrumb = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Start", item: base },
            { "@type": "ListItem", position: 2, name: "Oferta", item: `${base}/shop` },
            { "@type": "ListItem", position: 3, name: String(product?.name || ''), item: `${base}/product/${String((product as any)?.slug?.current || '')}` },
          ]
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
            <script suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
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
      <Container className="py-6 sm:py-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 overflow-x-hidden">
          {/* Left: images + trust */}
          <div>
            {product?.images ? (() => {
              const drawings: Array<{ imageUrl?: string | null; fileUrl?: string | null; title?: string | null }> =
                Array.isArray((product as any)?.technicalDrawings)
                  ? ((product as any).technicalDrawings as Array<{ imageUrl?: string | null; fileUrl?: string | null; title?: string | null }>)
                  : [];
              // Legacy single technicalDrawing (URL string) – map to fileUrl so component can render
              if (!drawings.length && (product as any)?.technicalDrawing?.url) {
                drawings.push({ fileUrl: (product as any).technicalDrawing.url, title: (product as any).technicalDrawing.title });
              }
              return (
                <MediaTabs
                  slug={slug}
                  files={drawings}
                  defaultTab={drawings.length ? "tech" : "gallery"}
                  gallery={<ImageView images={product?.images} isStock={product?.stock} />}
                />
              );
            })() : null}
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
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
          <div className="min-w-0">
            <div className="mb-3 sm:mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">{product?.name}</h1>
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
                <PriceView price={(product as any)?.pricing?.priceNet ?? (product as any)?.priceNet ?? (product as any)?.price} discount={product?.discount} priceOlx={(product as any)?.pricing?.priceOlx ?? (product as any)?.priceOlx} phoneOrderOnly={Boolean((product as any)?.phoneOrderOnly)} className="text-2xl font-bold" />
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
              {/* Visible go-to-cart CTA */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/cart"
                  className="btn-shine inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white shadow hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  🛒 Przejdź do koszyka
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border border-gray-300 text-gray-800 bg-white hover:bg-gray-50"
                >
                  Zobacz inne produkty
                </Link>
              </div>
            </div>
            
            {/* Product Description - Moved below price */}
            {product?.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Opis produktu</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
            
            {/* Spacing between opis and Doposażenie w zęby */}
            <div className="mt-6"></div>
            
            <ProductPageClient 
              product={product}
              isPhoneOnly={isPhoneOnly}
              hasCompat={hasCompat}
              hasFeatures={hasFeatures}
              hasKeyParams={hasKeyParams}
              similar={similar}
            >
              <div></div>
            </ProductPageClient>
          </div>
        </div>

        {/* Specyfikacja techniczna – pełna szerokość */}
        {(() => {
          const hasAnySpecs = hasKeyParams || hasCompat || hasFeatures;
          if (!hasAnySpecs) return null;
          return (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Specyfikacja techniczna</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-sm">
            {/* Kluczowe parametry */}
            {hasKeyParams ? (
            <div className="p-4 sm:p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[10px] tracking-wider uppercase text-gray-500 mb-3">Kluczowe parametry</div>
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
            ) : null}

            {/* Kompatybilność i mocowania */}
            {hasCompat ? (
            <div className="p-4 sm:p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[10px] tracking-wider uppercase text-gray-500 mb-3">Kompatybilność i mocowania</div>
              {product?.specifications?.quickCoupler ? (
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-4 w-4 text-[var(--color-brand-orange)]" />
                  <span className="text-gray-600">Szybkozłącze:</span>
                  <span className="font-semibold ml-auto">{product.specifications.quickCoupler}</span>
                </div>
              ) : null}
              {product?.specifications?.machineCompatibility?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {product.specifications.machineCompatibility.map((m: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 text-[11px] rounded-lg border bg-white text-gray-800 hover:bg-gray-50">{m}</span>
                  ))}
                </div>
              ) : null}
              {((product as any)?.mountSystems?.length || 0) > 0 ? (
                <div className="mt-3">
                  <div className="text-[11px] text-gray-500 mb-1">Mocowania pasujące</div>
                  <div className="flex flex-wrap gap-1.5">
                    {((product as any).mountSystems || []).map((m: any, i: number) => (
                      <span key={i} className="px-2.5 py-1 text-[11px] rounded-lg border bg-white text-gray-800">
                        {m?.code ? `[${m.code}]` : ''} {m?.title || ''}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            ) : null}

            {/* Cechy */}
            {hasFeatures ? (
            <div className="p-4 sm:p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[10px] tracking-wider uppercase text-gray-500 mb-3">Cechy</div>
              {product?.specifications?.features?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {product.specifications.features.map((f: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 text-[11px] rounded-lg bg-gray-50 border border-gray-200 text-gray-800">{f}</span>
                  ))}
                </div>
              ) : null}
            </div>
            ) : null}
          </div>
        </div>
          );
        })()}

        {/* Zamów w 60 sekund - Moved below technical specifications */}
        <div className="mt-10">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Zamów w 60 sekund</CardTitle>
              <div className="text-sm text-gray-600 mt-2">
                🚚 <strong>Szybka dostawa:</strong> Produkty dostępne na magazynie - wysyłka w ciągu 24h od potwierdzenia zamówienia
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input suppressHydrationWarning placeholder="Imię i nazwisko" />
              <Input suppressHydrationWarning placeholder="Numer telefonu" />
              <Input suppressHydrationWarning placeholder="Adres email" />
              <Button className="w-full bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)] text-white">
                ZAMAWIAM - DOSTAWA W 24H
              </Button>
              <div className="text-xs text-gray-600 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                🔒 Bezpieczne zamówienie | 📋 Faktura VAT | ⚡ Natychmiastowa realizacja
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sticky CTA mobile - Enhanced with better positioning */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 max-w-full">
              <div className="flex-1 min-w-0 overflow-hidden">
                <PriceView price={(product as any)?.pricing?.priceNet ?? (product as any)?.priceNet ?? (product as any)?.price as number | string | undefined} discount={product?.discount} priceOlx={(product as any)?.pricing?.priceOlx ?? (product as any)?.priceOlx as number | string | undefined} phoneOrderOnly={Boolean((product as any)?.phoneOrderOnly)} className="text-base font-bold" compact />
              </div>
              {isPhoneOnly ? (
                <a href="tel:+48782851962" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)] text-white font-semibold shadow transition-all duration-200 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>Zadzwoń</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 min-w-[120px] max-w-full overflow-hidden">
                  <div className="min-w-[120px] max-w-[50vw] overflow-hidden">
                    <AddToCartButton product={product} size="sm" alwaysButton />
                  </div>
                  <Link
                    href="/cart"
                    className="shrink-0 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50"
                  >
                    Koszyk
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="h-safe-area-inset-bottom"></div>
        </div>
        
        {/* Add bottom padding to content on mobile to prevent overlay */}
        <div className="md:hidden h-24"></div>

        {/* Enhanced Similar Products Section */}
        {similar?.length ? (
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full border border-gray-200 mb-4">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold text-gray-700">Polecane produkty</span>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
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
                    <div className="absolute -top-2 -left-2 z-20 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white">
                      ⭐ TOP
                    </div>
                  )}
                  
                  <Card className="h-full overflow-hidden bg-white border border-gray-200/60 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02] group">
                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardHeader className="p-0 relative z-10">
                      <div className="relative aspect-[5/4] bg-white overflow-hidden">
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
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
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
                              <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200">
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
                          className="block w-full bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)] text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
                        >
                          Zobacz szczegóły
                        </Link>
                      </div>
                    </CardContent>
                    
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Bottom CTA for Similar Products */}
            <div className="mt-12 text-center bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Potrzebujesz pomocy w doborze?</h3>
              <p className="text-gray-600 mb-6">
                Nasi eksperci pomogą Ci wybrać idealny produkt dla Twojej maszyny
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+48782851962"
                  className="inline-flex items-center gap-2 bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(
    `*[_type == "product" && defined(slug.current)].slug.current`
  );
  return (slugs || []).map((slug) => ({ slug }));
}
