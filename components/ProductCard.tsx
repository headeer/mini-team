import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
// import { StarIcon } from "@sanity/icons";
// import { Flame } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  type ProductWithVariant = Product & {
    slug?: string | { current?: string };
    categories?: Array<string | { title?: string } | null | undefined>;
    imageUrls?: Array<{ url?: string | null } | null>;
    cover?: string | null;
  };
  const p = product as unknown as ProductWithVariant;
  const slugValue = (typeof p.slug === "string" ? p.slug : p.slug?.current) || "";
  const categoryLabels: string[] = Array.isArray(p.categories)
    ? (p.categories as Array<string | { title?: string }>)
        .map((c) => (typeof c === "string" ? c : c?.title))
        .filter((v): v is string => Boolean(v))
    : [];

  // Minimal card: no extra quick specs, no fits badge
  const isRipper = /zrywak/i.test(String(product?.name)) || categoryLabels.some((c) => /zrywaki|zrywak/i.test(c || ""));
  const priceValue = ((): number | string | undefined => {
    const rawPrice = (product as unknown as { price?: number | string | undefined }).price;
    const basePrice = (product as unknown as { basePrice?: number | undefined }).basePrice;
    const priceNet = (product as any)?.pricing?.priceNet ?? (product as any)?.priceNet;
    // Prefer explicit string (phone order). Otherwise prefer net price, then legacy base/price
    if (typeof rawPrice === "string") return rawPrice;
    if (typeof priceNet === 'number') return priceNet;
    if (typeof basePrice === "number" && basePrice > 0) return basePrice;
    return typeof rawPrice === "number" ? rawPrice : basePrice;
  })();
  // Only respect explicit flag; do NOT infer from price/base values
  const derivedPhoneOrderOnly = Boolean((product as any)?.phoneOrderOnly);

  return (
    <div className="group relative h-full overflow-hidden">
      {/* Main Card */}
      <div className="relative h-full bg-white border border-gray-200/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ease-out transform hover:-translate-y-2 hover:scale-[1.02] flex flex-col">
        
        {/* Premium Gradient Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
             style={{
               background: 'linear-gradient(45deg, transparent 30%, rgba(255,115,0,0.3) 50%, transparent 70%)',
               mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               maskComposite: 'xor',
               padding: '2px'
             }} />

        {/* Floating Shine Effect (no shadow on image hover) */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        {/* Image Section */}
        <div className="relative z-10">
          <Link href={slugValue ? `/product/${slugValue}` : "#"}>
            <div className="relative aspect-[5/4] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
              {/* Premium Image Background Pattern */}
              <div className="absolute inset-0 opacity-5" 
                   style={{
                     backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
                     backgroundSize: '20px 20px'
                   }} />
              
              {(() => {
                const toSrc = (img: any): string | null => {
                  if (!img) return null;
                  if (typeof img === "string") return img || null;
                  if (typeof img === "object" && img.url) return img.url || null;
                  if (typeof img === "object" && img.asset?._ref) {
                    try { return urlFor(img).url(); } catch { return null; }
                  }
                  return null;
                };
                const src = (p.cover as string) || (p?.imageUrls?.[0]?.url as string) || toSrc(product?.images?.[0]);
                return src ? (
                  <Image
                    src={src}
                    alt={product?.name || "product"}
                    fill
                    sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 300px"
                    priority={false}
                    className={`object-contain transition-transform duration-700 ease-out p-4 ${
                      product?.stock !== 0 
                        ? "group-hover:scale-110 group-hover:rotate-1" 
                        : "opacity-40 grayscale"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full opacity-20" />
                  </div>
                );
              })()}

              {/* Favorite (heart) - fixed position */}
              <div className="absolute top-3 right-3 z-20">
                <ProductSideMenu product={product} />
              </div>
            </div>
          </Link>

          {/* Status Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {product?.status === "sale" && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20 animate-pulse">
                🔥 PROMOCJA
              </span>
            )}
            {product?.status === "new" && (
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                ✨ NOWOŚĆ
              </span>
            )}
            {product?.status === "hot" && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                🌟 HIT
              </span>
            )}
          </div>

          {/* Premium Quality Badge */}
          <div className="absolute bottom-3 right-3 z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/50 backdrop-blur-sm">
              💎 HB500
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 p-6 flex flex-col gap-2 flex-1 bg-white/80 backdrop-blur-sm">
          
          {/* Category & stock badges removed for a cleaner header */}

          {/* Product Title */}
          <Link href={slugValue ? `/product/${slugValue}` : "#"} className="group/title">
            <Title className="text-lg font-bold text-gray-900 line-clamp-3 leading-tight transition-all duration-300 group-hover/title:text-[var(--color-brand-orange)] group-hover/title:underline underline-offset-4">
              {product?.name}
            </Title>
          </Link>

          {/* Description */}
          {product?.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {String(product.description)}
            </p>
          )}

          {/* Specifications Preview */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {(product as any)?.specifications?.widthCm && (
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                📏 {(product as any).specifications.widthCm}cm
              </span>
            )}
            {(product as any)?.specifications?.toothThickness && (
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                🔧 {(product as any).specifications.toothThickness}mm
              </span>
            )}
          </div>

          {/* Price Section */}
          <div className="mt-auto pt-4 border-t border-gray-100 space-y-2">
            <PriceView
              price={priceValue}
              discount={product?.discount}
              priceOlx={(product as unknown as { priceOlx?: number | string })?.priceOlx}
              phoneOrderOnly={derivedPhoneOrderOnly}
              className="text-xl font-bold"
            />
            
            {/* No details button; clicking card elements links to product page above */}
            
            {/* Action Button */}
            <Link href={slugValue ? `/product/${slugValue}` : "#"} className="w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white font-semibold">
              Dodaj do koszyka
            </Link>
          </div>
        </div>

        {/* Premium Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default ProductCard;
