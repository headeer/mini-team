import { Category } from "@/sanity.types";
import React, { useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

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
    <div className="w-full bg-white">
      <Input
        placeholder="Szukaj kategorii"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-2"
      />
      <RadioGroup value={selectedCategory || ""} className="space-y-1">
        {filtered?.map((category) => {
          const count = (category as any)?.productCount as number | undefined;
          return (
            <div
              onClick={() => setSelectedCategory(category?.slug?.current as string)}
              key={category?._id}
              className="flex items-center justify-between gap-2 hover:cursor-pointer rounded-md px-2 py-1 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={category?.slug?.current as string} id={category?.slug?.current} className="rounded-sm" />
                <Label
                  htmlFor={category?.slug?.current}
                  className={`${selectedCategory === category?.slug?.current ? "font-semibold text-shop_dark_green" : "font-normal"}`}
                >
                  {category?.title}
                </Label>
              </div>
              {typeof count === "number" && (
                <span className="text-xs text-gray-600">{count}</span>
              )}
            </div>
          );
        })}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-3 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect text-left"
        >
          Wyczyść wybór
        </button>
      )}
    </div>
  );
};

export default CategoryList;
