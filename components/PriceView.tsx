
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | string | undefined;
  discount: number | undefined;
  className?: string;
  priceOlx?: number | string | undefined;
  phoneOrderOnly?: boolean;
}
const PriceView = ({ price, discount, className, priceOlx, phoneOrderOnly }: Props) => {
  const sitePriceNum = typeof price === 'number' ? price : undefined;
  const olxIsNum = typeof priceOlx === 'number';

  // Phone-order custom view
  if (phoneOrderOnly) {
    return (
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2.5 rounded-2xl border border-orange-200/50 shadow-sm">
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-3">
        <div className="relative">
          <PriceFormatter 
            amount={price} 
            className={cn("font-bold bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] bg-clip-text text-transparent", className)} 
          />
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
      {olxIsNum ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide border border-blue-200/50">
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
