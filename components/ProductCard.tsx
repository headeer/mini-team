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
    // Prefer string price (e.g., "Zamówienia telefoniczne"). If numeric, prefer positive basePrice, else numeric price
    if (typeof rawPrice === "string") return rawPrice;
    if (typeof basePrice === "number" && basePrice > 0) return basePrice;
    return typeof rawPrice === "number" ? rawPrice : basePrice;
  })();
  const derivedPhoneOrderOnly = Boolean((product as any)?.phoneOrderOnly) || typeof ((product as any)?.price) === "string" || ((product as any)?.basePrice === 0 && isRipper);

  return (
    <div className="relative text-sm border rounded-2xl border-gray-200 group bg-white overflow-hidden shadow-sm hover:shadow-2xl hover:border-[var(--color-brand-orange)]/30 transition-all duration-500 ease-out flex flex-col h-full">
      {/* Shine sweep */}
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out" />
      </div>
      {/* Subtle glow */}
      <div
        className="pointer-events-none absolute -inset-2 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,115,0,0.15) 0%, rgba(255,115,0,0) 65%)",
        }}
      />

      <div className="relative z-10 bg-white">
        <Link href={slugValue ? `/product/${slugValue}` : "#"}>
          <div className="relative aspect-[4/3] bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden">
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
                  className={`object-contain transition-transform duration-500 ${product?.stock !== 0 ? "group-hover:scale-[1.04] group-hover:translate-y-0.5" : "opacity-50"}`}
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              );
            })()}
          </div>
        </Link>
        <ProductSideMenu product={product} />
        {product?.status === "sale" && (
          <span className="absolute top-2 left-2 z-20 text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white shadow">Promocja</span>
        )}
        {/* Inspired micro-badge */}
        <span className="absolute top-2 right-2 z-20 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full transform scale-90 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100">
          HB500
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1 relative z-10">
        {isRipper ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 w-fit">Zrywak korzeni</span>
        ) : null}
        {!isRipper && categoryLabels.length > 0 ? (
          <p className="uppercase line-clamp-2 text-xs font-medium text-gray-500 leading-tight">
            {categoryLabels.join(", ")}
          </p>
        ) : null}
        <Link href={slugValue ? `/product/${slugValue}` : "#"} className="hover:underline underline-offset-2">
          <Title className="text-[15px] line-clamp-2 min-h-[40px] transition-colors duration-300 group-hover:text-[var(--color-brand-orange)]">{product?.name}</Title>
        </Link>
        {product?.description && (
          <p className="text-xs text-gray-600 line-clamp-2">{String(product.description)}</p>
        )}
        
        {/* simplified: removed quick coupler, compatibility, and tier badges */}

        <div className="flex items-center justify-between min-h-[28px] mt-1">
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${product?.stock === 0 ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
            {(product?.stock as number) > 0 ? `W magazynie: ${product?.stock}` : "Brak w magazynie"}
          </span>
        </div>

        <PriceView
          price={priceValue}
          discount={product?.discount}
          priceOlx={(product as unknown as { priceOlx?: number | string })?.priceOlx}
          phoneOrderOnly={derivedPhoneOrderOnly}
          className="text-base"
        />
        <div className="mt-auto pt-2">
          <AddToCartButton product={product} className="w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
