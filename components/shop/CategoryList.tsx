import { Category } from "@/sanity.types";
import React, { useMemo, useState } from "react";
import FancySearchInput from "../ui/FancySearchInput";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({ categories, selectedCategory, setSelectedCategory }: Props) => {
  const [filter, setFilter] = useState("");
  const filtered = useMemo(() => {
    if (!filter) return categories || [];
    const needle = filter.toLowerCase();
    return (categories || []).filter((c) => String(c?.title ?? "").toLowerCase().includes(needle));
  }, [categories, filter]);

  return (
    <div className="w-full">
      <FancySearchInput
        placeholder="Szukaj kategorii"
        value={filter}
        onChange={(v) => setFilter(v)}
        className="mb-3"
        onReset={() => setFilter("")}
      />
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filtered?.map((category) => {
          const count = (category as any)?.productCount as number | undefined;
          const isSelected = selectedCategory === category?.slug?.current;
          return (
            <div
              onClick={() => setSelectedCategory(category?.slug?.current as string)}
              key={category?._id}
              className={`flex items-center justify-between gap-2 hover:cursor-pointer rounded-lg px-3 py-2.5 transition-all duration-200 ${
                isSelected 
                  ? "bg-gradient-to-r from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 border border-[var(--color-brand-orange)]/30" 
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  isSelected 
                    ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)]" 
                    : "bg-gray-300"
                }`} />
                <span className={`text-sm transition-colors duration-200 ${
                  isSelected ? "font-semibold text-[var(--color-brand-orange)]" : "font-medium text-gray-700"
                }`}>
                  {category?.title}
                </span>
              </div>
              {typeof count === "number" && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isSelected 
                    ? "bg-[var(--color-brand-orange)]/20 text-[var(--color-brand-orange)] font-medium" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-4 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 w-full"
        >
          ✕ Wyczyść wybór
        </button>
      )}
    </div>
  );
};

export default CategoryList;
