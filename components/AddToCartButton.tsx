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
    <div className="w-full h-12 flex items-center">
      {itemCount && !isPhoneOnly ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={isPhoneOnly ? undefined : handleAddToCart}
          disabled={isOutOfStock || isPhoneOnly}
          className={cn(
            "w-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white font-semibold tracking-wide shadow-none border-0 hover:opacity-95",
            className
          )}
        >
          {isPhoneOnly ? (
            <a href="tel:+48782851962" className="w-full flex items-center justify-center gap-2">
              <ShoppingBag /> Zamów telefonicznie
            </a>
          ) : (
            <>
              <ShoppingBag /> {isOutOfStock ? "Brak w magazynie" : "Dodaj do koszyka"}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
