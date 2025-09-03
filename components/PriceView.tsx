
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | string | undefined; // Netto
  discount: number | undefined;
  className?: string;
  priceOlx?: number | string | undefined;
  phoneOrderOnly?: boolean;
  gross?: number | undefined; // Brutto – optional; computed if not provided
  vatRate?: number; // default 0.23
  compact?: boolean; // mobile sticky bar – only show net price row or short message
}
const PriceView = ({ price, discount, className, priceOlx, phoneOrderOnly, gross, vatRate = 0.23, compact = false }: Props) => {
  const sitePriceNum = typeof price === 'number' ? price : undefined;
  const olxIsNum = typeof priceOlx === 'number';
  const computedGross = typeof gross === 'number' ? gross : (typeof sitePriceNum === 'number' ? Math.round(sitePriceNum * (1 + vatRate) * 100) / 100 : undefined);

  // Phone-order custom view
  if (phoneOrderOnly) {
    return compact ? (
      <div className="flex items-baseline gap-2">
        <span className="text-xs text-gray-600">tel.</span>
        <span className="text-sm font-semibold text-gray-900">Zamów telefonicznie</span>
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2.5 rounded-2xl border border-amber-200 shadow-sm">
          <span className="text-lg">📞</span>
          <span className="font-semibold text-sm">Zamówienia telefoniczne</span>
        </div>
        {olxIsNum && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded-lg text-xs font-medium uppercase tracking-wide">OLX</span>
            <PriceFormatter amount={priceOlx} className="line-through text-gray-500 font-medium" />
          </div>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="text-[11px] text-gray-600">netto</span>
        <PriceFormatter amount={price} className={cn("text-lg font-bold text-[var(--color-brand-red)]", className)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-3">
        <div className="relative">
          <span className="text-xs text-gray-600 mr-2 align-middle">netto</span>
          <PriceFormatter amount={price} className={cn("font-bold text-[var(--color-brand-red)]", className)} />
          {typeof sitePriceNum === 'number' && typeof discount === 'number' && discount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">
              -{discount}%
            </div>
          )}
        </div>
        {typeof sitePriceNum === 'number' && typeof discount === 'number' && discount > 0 ? (
          <PriceFormatter 
            amount={sitePriceNum + (discount * sitePriceNum) / 100} 
            className="line-through text-sm font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-lg" 
          />
        ) : null}
      </div>
      {/* Brutto row */}
      {typeof computedGross === 'number' ? (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-xs text-gray-600">brutto</span>
          <PriceFormatter amount={computedGross} className="font-semibold text-gray-900" />
          <span className="text-[11px] text-gray-500">(VAT {Math.round(vatRate*100)}%)</span>
        </div>
      ) : null}
      {olxIsNum ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide border border-blue-200">
            OLX
          </span>
          <PriceFormatter amount={priceOlx} className="line-through text-gray-500 font-medium" />
          <span className="text-xs text-green-600 font-medium">📉 Taniej u nas!</span>
        </div>
      ) : null}
    </div>
  );
};

export default PriceView;
