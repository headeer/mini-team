import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import { Flame } from "lucide-react";
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

  return (
    <div className="text-sm border rounded-xl border-gray-200 group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="relative group bg-white">
        <Link href={slugValue ? `/product/${slugValue}` : "#"}>
          <div className="relative aspect-[4/3] bg-shop_light_bg">
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
                  className={`object-contain transition-transform duration-500 ${product?.stock !== 0 ? "group-hover:scale-[1.02]" : "opacity-50"}`}
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              );
            })()}
          </div>
        </Link>
        <ProductSideMenu product={product} />
        {product?.status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-lightGreen hover:text-shop_dark_green hoverEffect">
            Sale!
          </p>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect"
          >
            <Flame
              size={18}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {categoryLabels.length > 0 ? (
          <p className="uppercase line-clamp-1 text-xs font-medium text-gray-500">
            {categoryLabels.join(", ")}
          </p>
        ) : null}
        <Link href={slugValue ? `/product/${slugValue}` : "#"} className="hover:underline underline-offset-2">
          <Title className="text-[15px] line-clamp-2 min-h-[40px]">{product?.name}</Title>
        </Link>
        <div className="flex items-center gap-2 min-h-[20px]">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={
                  index < 4 ? "text-shop_light_green" : " text-lightText"
                }
                fill={index < 4 ? "#93D991" : "#ababab"}
              />
            ))}
          </div>
          <p className="text-lightText text-xs tracking-wide">5 opinii</p>
        </div>

        <div className="flex items-center justify-between min-h-[28px]">
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${product?.stock === 0 ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
            {(product?.stock as number) > 0 ? `W magazynie: ${product?.stock}` : "Brak w magazynie"}
          </span>
        </div>

        <PriceView
          price={product?.basePrice ?? product?.price}
          discount={product?.discount}
          priceOlx={(product as unknown as { priceOlx?: number | string })?.priceOlx}
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
