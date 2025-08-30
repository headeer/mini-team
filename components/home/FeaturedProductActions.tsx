"use client";

import React from "react";
import AddToCartButton from "@/components/AddToCartButton";
import QuantityButtons from "@/components/QuantityButtons";
import useStore from "@/store";
import Link from "next/link";

type Props = {
  productId: string;
  name: string;
  price?: number;
  slug: string;
};

export default function FeaturedProductActions({ productId, name, price, slug }: Props) {
  const { getItemCount } = useStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  const count = hydrated ? getItemCount(productId) : 0;

  return (
    <div className="mt-2 flex items-center justify-between gap-2">
      {count > 0 ? (
        <>
          <Link href={`/product/${slug}`} className="hidden sm:inline-block text-xs px-3 py-1.5 rounded-lg border-2 border-[var(--color-brand-orange)] bg-white hover:bg-[var(--color-brand-orange)] text-[var(--color-brand-orange)] hover:text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md">Szczegóły</Link>
          <QuantityButtons product={{ _id: productId, name, price } as any} />
        </>
      ) : (
        // hide "Szczegóły" button when Add to Cart is shown (image/title already link to details)
        <AddToCartButton product={{ _id: productId, name, price } as any} className="w-full rounded-md" />
      )}
    </div>
  );
}


