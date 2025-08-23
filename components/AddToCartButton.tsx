"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { urlFor } from "@/sanity/lib/image";

interface Props {
  product: Product;
  className?: string;
  compact?: boolean; // compact summary for cards (shop)
}

const AddToCartButton = ({ product, className, compact = false }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;
  const priceAsUnknown = typeof (product as unknown as { price?: unknown }).price === "string";
  const hasPriceText = typeof (product as unknown as { priceText?: unknown }).priceText === "string";
  const baseIsZero = (product as unknown as { basePrice?: number })?.basePrice === 0;
  const explicitPhoneOnly = Boolean((product as unknown as { phoneOrderOnly?: boolean })?.phoneOrderOnly);
  const isPhoneOnly = priceAsUnknown || hasPriceText || baseIsZero || explicitPhoneOnly;

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success(`${product?.name?.substring(0, 12)}... dodano do koszyka`);
    } else {
      toast.error("Nie można dodać więcej niż dostępny stan");
    }
  };
  return (
    <div className="w-full flex items-center">
      {itemCount && !isPhoneOnly ? (
        compact ? (
          <div className="w-full bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <QuantityButtons product={product} />
              <div className="text-right">
                <div className="text-[11px] text-gray-600 leading-none">Razem</div>
                <div className="text-base font-bold bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] bg-clip-text text-transparent">
                  <PriceFormatter amount={product?.price ? product?.price * itemCount : 0} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
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
              const src = toSrc((product as any)?.images?.[0]) || (product as any)?.imageUrls?.[0]?.url || (product as any)?.cover || null;
              return (
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {src ? (
                      <Image src={src} alt="Miniatura produktu" fill className="object-cover" sizes="48px" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{product?.name}</div>
                    <div className="text-xs text-gray-600 truncate">{String(product?.description || "").slice(0, 60)}</div>
                  </div>
                  <QuantityButtons product={product} />
                </div>
              );
            })()}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-800">Razem</span>
              <span className="text-lg font-bold bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] bg-clip-text text-transparent">
                <PriceFormatter amount={product?.price ? product?.price * itemCount : 0} />
              </span>
            </div>
          </div>
        )
      ) : (
        <Button
          onClick={isPhoneOnly ? undefined : handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "group relative w-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
            isOutOfStock 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isPhoneOnly
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              : "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] hover:from-[var(--color-brand-red)] hover:to-[var(--color-brand-orange)]",
            "text-white font-bold border-0 h-auto min-h-12 rounded-2xl px-6 py-3",
            className
          )}
        >
          {/* Animated background effect */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          
          {/* Shine effect */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          )}
          
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isPhoneOnly ? (
              <a href="/kontakt" className="w-full flex items-center justify-center gap-3 text-center">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Zapytaj o ofertę</span>
                </div>
              </a>
            ) : isOutOfStock ? (
              <>
                <span className="text-lg">❌</span>
                <span className="font-bold">Brak w magazynie</span>
              </>
            ) : (
              <>
                <span className="font-bold">Dodaj do koszyka</span>
              </>
            )}
          </div>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
