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
    <div className="w-full">
      <div className="space-y-2">
        {priceArray.map(({ title, value }) => {
          const active = selectedPrice === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedPrice(value)}
              className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 border border-[var(--color-brand-orange)]/30 text-[var(--color-brand-orange)] font-semibold"
                  : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  active 
                    ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)]" 
                    : "bg-gray-300"
                }`} />
                <span className="text-sm">{title}</span>
              </div>
            </button>
          );
        })}
      </div>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-4 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 w-full"
        >
          ✕ Wyczyść wybór
        </button>
      )}
    </div>
  );
};

export default PriceList;
