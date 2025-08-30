"use client";
import React from "react";
import Link from "next/link";
import Title from "@/components/Title";
import { categoriesData } from "@/constants/data";
import CategoryIconSprite from "@/components/CategoryIconSprite";

const AllCategories = () => {
  // Use the same categories as in the menu (requested)
  const menuCategories = categoriesData;
  const [expanded, setExpanded] = React.useState(false);
  const mobileVisible = expanded ? menuCategories : menuCategories.slice(0, 6);
  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="uppercase tracking-widest text-[var(--color-brand-orange)] text-xs font-semibold mb-1">Katalog</p>
          <Title className="!mb-0 text-2xl md:text-3xl">Wszystkie kategorie</Title>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-shop_dark_green hover:underline underline-offset-4">Zobacz wszystkie</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(mobileVisible).map((cat) => (
          <Link
            key={cat.href}
            href={`/shop?category=${encodeURIComponent(cat.href)}`}
            className="group rounded-2xl border bg-white hover:shadow-xl hover:border-[var(--color-brand-orange)]/30 transition overflow-hidden"
          >
            <div className="p-4 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 border border-orange-200/30 flex items-center justify-center overflow-hidden">
                <CategoryIconSprite title={cat.title} className="w-12 h-12" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[var(--color-brand-orange)] transition-colors">
                  {cat.title}
                </div>
                <div className="mt-1 text-xs text-gray-600">Sprawdź dostępność</div>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-lg bg-gray-100 text-gray-700 border">Zobacz</span>
            </div>
          </Link>
        ))}
      </div>
      {/* Mobile expand/collapse */}
      <div className="mt-4 md:hidden flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="px-4 py-2 rounded-full text-sm font-semibold border bg-white hover:bg-gray-50"
        >
          {expanded ? "Zwiń" : "Rozwiń"}
        </button>
      </div>
    </section>
  );
};

export default AllCategories;


