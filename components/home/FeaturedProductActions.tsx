"use client";

import React from "react";
import AddToCartButton from "@/components/AddToCartButton";
import QuantityButtons from "@/components/QuantityButtons";
import FavoriteButton from "@/components/FavoriteButton";
import useStore from "@/store";
import Link from "next/link";

type Props = {
  productId: string;
  name: string;
  price?: number;
  slug: string;
  phoneOrderOnly?: boolean;
};

export default function FeaturedProductActions({ productId, name, price, slug, phoneOrderOnly }: Props) {
  const { getItemCount } = useStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  const count = hydrated ? getItemCount(productId) : 0;

  return (
    <div className="mt-2 flex items-center justify-between gap-2">
      {phoneOrderOnly ? (
        <>
          <Link href={`/product/${slug}`} className="flex-1 text-center text-xs px-3 py-1.5 rounded-lg border-2 border-[var(--color-brand-orange)] bg-white hover:bg-[var(--color-brand-orange)] text-[var(--color-brand-orange)] hover:text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
            Sprawdź szczegóły
          </Link>
          <FavoriteButton showProduct={false} product={{ _id: productId, name } as any} />
        </>
      ) : count > 0 ? (
        <>
          <Link href={`/product/${slug}`} className="hidden sm:inline-block text-xs px-3 py-1.5 rounded-lg border-2 border-[var(--color-brand-orange)] bg-white hover:bg-[var(--color-brand-orange)] text-[var(--color-brand-orange)] hover:text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md">Szczegóły</Link>
          <QuantityButtons product={{ _id: productId, name, price } as any} />
        </>
      ) : (
        <>
          <Link href={`/product/${slug}`} className="flex-1 text-center text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white font-semibold shadow-sm hover:shadow-md">
            Dodaj do koszyka
          </Link>
          <FavoriteButton showProduct={false} product={{ _id: productId, name } as any} />
        </>
      )}
    </div>
  );
}


