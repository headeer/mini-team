import React from "react";
import { Label } from "../ui/label";

const priceArray = [
  { title: "Do 1 000 zł", value: "0-1000" },
  { title: "1 000 – 2 000 zł", value: "1000-2000" },
  { title: "2 000 – 4 000 zł", value: "2000-4000" },
  { title: "4 000 – 8 000 zł", value: "4000-8000" },
  { title: "Powyżej 8 000 zł", value: "8000-100000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-semibold">Cena</Label>
        {selectedPrice && (
          <button
            onClick={() => setSelectedPrice(null)}
            className="text-xs font-medium underline underline-offset-2 hover:text-shop_dark_green"
          >
            Wyczyść
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {priceArray.map(({ title, value }) => {
          const active = selectedPrice === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedPrice(value)}
              className={`w-full text-left px-3 py-2 rounded-md border transition ${
                active
                  ? "bg-[var(--color-brand-orange)]/10 border-[var(--color-brand-orange)] text-gray-900"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              {title}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PriceList;
