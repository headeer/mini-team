import { BRANDS_QUERYResult } from "@/sanity.types";
import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Marka</Title>
      <RadioGroup value={selectedBrand || ""} className="mt-2 space-y-1">
        {/* Presets when no brands in Sanity */}
        {!brands?.length && (
          <>
            {[
              { title: "JCB", slug: "jcb" },
              { title: "Caterpillar", slug: "cat" },
              { title: "Kubota", slug: "kubota" },
              { title: "Volvo", slug: "volvo" },
              { title: "Yanmar", slug: "yanmar" },
              { title: "Wacker Neuson", slug: "wacker" },
            ].map((b) => (
              <div
                key={b.slug}
                onClick={() => setSelectedBrand(b.slug)}
                className="flex items-center space-x-2 hover:cursor-pointer"
              >
                <RadioGroupItem value={b.slug} id={b.slug} className="rounded-sm" />
                <Label htmlFor={b.slug} className={`${selectedBrand === b.slug ? "font-semibold text-shop_dark_green" : "font-normal"}`}>
                  {b.title}
                </Label>
              </div>
            ))}
          </>
        )}
        {brands?.map((brand) => (
          <div
            key={brand?._id}
            onClick={() => setSelectedBrand(brand?.slug?.current as string)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={brand?.slug?.current as string}
              id={brand?.slug?.current}
              className="rounded-sm"
            />
            <Label
              htmlFor={brand?.slug?.current}
              className={`${selectedBrand === brand?.slug?.current ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {brand?.title}
            </Label>
          </div>
        ))}
        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand(null)}
            className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect text-left"
          >
            Wyczyść wybór
          </button>
        )}
      </RadioGroup>
    </div>
  );
};

export default BrandList;
