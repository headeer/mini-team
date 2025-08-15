"use client";
import React from "react";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;
  const priceAsUnknown = typeof (product as unknown as { price?: unknown }).price === "string";
  const hasPriceText = typeof (product as unknown as { priceText?: unknown }).priceText === "string";
  const baseIsZero = (product as unknown as { basePrice?: number })?.basePrice === 0;
  const isPhoneOnly = priceAsUnknown || hasPriceText || baseIsZero;

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success(
        `${product?.name?.substring(0, 12)}... added successfully!`
      );
    } else {
      toast.error("Can not add more than available stock");
    }
  };
  return (
    <div className="w-full flex items-center">
      {itemCount && !isPhoneOnly ? (
        <div className="w-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              W koszyku
            </span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-800">Suma:</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
              className="text-lg font-bold bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] bg-clip-text text-transparent"
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={isPhoneOnly ? undefined : handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "group relative w-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
            isOutOfStock 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isPhoneOnly
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              : "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] hover:from-[var(--color-brand-red)] hover:to-[var(--color-brand-orange)]",
            "text-white font-bold border-0 h-auto min-h-12 rounded-2xl px-6 py-3",
            className
          )}
        >
          {/* Animated background effect */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          
          {/* Shine effect */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          )}
          
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isPhoneOnly ? (
              <a href="tel:+48782851962" className="w-full flex items-center justify-center gap-3 text-center">
                <span className="text-xl">📞</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Zamów telefonicznie</span>
                  <span className="text-xs opacity-90">782-851-962</span>
                </div>
              </a>
            ) : isOutOfStock ? (
              <>
                <span className="text-lg">❌</span>
                <span className="font-bold">Brak w magazynie</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                <div className="flex flex-col text-left">
                  <span className="font-bold">Dodaj do koszyka</span>
                  <span className="text-xs opacity-90">Szybka dostawa 24-48h</span>
                </div>
              </>
            )}
          </div>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
