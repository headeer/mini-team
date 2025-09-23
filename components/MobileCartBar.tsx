"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import useStore from "@/store";
import PriceFormatter from "./PriceFormatter";

export default function MobileCartBar() {
  const pathname = usePathname() || "";
  const isCart = pathname.startsWith("/cart");
  const isHidden = pathname === "/" ? false : !(pathname.startsWith("/shop") || pathname.startsWith("/product/"));

  // Avoid SSR/client mismatches due to persisted cart rehydration
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const items = useStore((s) => s.getGroupedItems());
  const total = useStore((s) => s.getTotalPrice());
  const count = items.reduce((n, i) => n + i.quantity, 0);

  if (!mounted || isCart || count === 0 || isHidden) return null;

  return (
    <div className="md:hidden fixed bottom-2 left-2 right-2 z-40">
      <Link href="/cart" className="flex items-center justify-between rounded-full px-4 py-3 bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white shadow-lg active:scale-[0.98]">
        <span className="text-sm font-semibold">Koszyk ({count})</span>
        <span className="text-base font-bold"><PriceFormatter amount={total} /></span>
      </Link>
    </div>
  );
}
