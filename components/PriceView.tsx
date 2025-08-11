import { twMerge } from "tailwind-merge";
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
  const priceIsText = typeof price === 'string';
  const isZero = sitePriceNum === 0;
  const olxIsNum = typeof priceOlx === 'number';
  const olxIsText = typeof priceOlx === 'string';

  // Phone-order custom view
  if (phoneOrderOnly) {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200">
          Zamówienia telefoniczne
        </span>
        {olxIsNum && (
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <span className="uppercase tracking-wide">OLX</span>
            <PriceFormatter amount={priceOlx} className="line-through text-gray-500" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-baseline gap-2">
        <PriceFormatter amount={price} className={cn("text-gray-900 font-semibold", className)} />
        {typeof sitePriceNum === 'number' && typeof discount === 'number' && discount > 0 ? (
          <PriceFormatter amount={sitePriceNum + (discount * sitePriceNum) / 100} className={twMerge("line-through text-xs font-normal text-zinc-500", className)} />
        ) : null}
      </div>
      {olxIsNum ? (
        <div className="text-xs text-gray-600 flex items-center gap-1">
          <span className="uppercase tracking-wide">OLX</span>
          <PriceFormatter amount={priceOlx} className="line-through text-gray-500" />
        </div>
      ) : null}
    </div>
  );
};

export default PriceView;
