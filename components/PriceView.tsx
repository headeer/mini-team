import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | string | undefined;
  discount: number | undefined;
  className?: string;
  priceOlx?: number | string | undefined;
}
const PriceView = ({ price, discount, className, priceOlx }: Props) => {
  const sitePriceNum = typeof price === 'number' ? price : undefined;
  const olxPriceNum = typeof priceOlx === 'number' ? priceOlx : undefined;
  const hasOlx = typeof olxPriceNum === 'number';

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-baseline gap-2">
        <PriceFormatter amount={price} className={cn("text-gray-900 font-semibold", className)} />
        {!hasOlx && typeof sitePriceNum === 'number' && typeof discount === 'number' && discount > 0 ? (
          <PriceFormatter amount={sitePriceNum + (discount * sitePriceNum) / 100} className={twMerge("line-through text-xs font-normal text-zinc-500", className)} />
        ) : null}
      </div>
      {typeof priceOlx !== 'undefined' ? (
        <div className="text-xs text-gray-600 flex items-center gap-1">
          <span className="uppercase tracking-wide">OLX</span>
          <PriceFormatter amount={priceOlx} className="line-through text-gray-500" />
        </div>
      ) : null}
    </div>
  );
};

export default PriceView;
