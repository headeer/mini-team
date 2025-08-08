import { Category } from "@/sanity.types";
import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Kategorie</Title>
      <RadioGroup value={selectedCategory || ""} className="mt-2 space-y-1">
        {/* Presets when no categories in Sanity */}
        {!categories?.length && (
          <>
            {[
              { title: "Łyżki 1–2t", slug: "1-2t" },
              { title: "Łyżki 2–3t", slug: "2-3t" },
              { title: "Łyżki 3–4.5t", slug: "3-4.5t" },
              { title: "Grabie", slug: "grabie" },
              { title: "Zrywarki korzeni", slug: "zrywarki" },
            ].map((p) => (
              <div
                key={p.slug}
                onClick={() => setSelectedCategory(p.slug)}
                className="flex items-center space-x-2 hover:cursor-pointer"
              >
                <RadioGroupItem value={p.slug} id={p.slug} className="rounded-sm" />
                <Label htmlFor={p.slug} className={`${selectedCategory === p.slug ? "font-semibold text-shop_dark_green" : "font-normal"}`}>
                  {p.title}
                </Label>
              </div>
            ))}
          </>
        )}
        {categories?.map((category) => (
          <div
            onClick={() => {
              setSelectedCategory(category?.slug?.current as string);
            }}
            key={category?._id}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={category?.slug?.current as string}
              id={category?.slug?.current}
              className="rounded-sm"
            />
            <Label
              htmlFor={category?.slug?.current}
              className={`${selectedCategory === category?.slug?.current ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect text-left"
        >
          Wyczyść wybór
        </button>
      )}
    </div>
  );
};

export default CategoryList;
