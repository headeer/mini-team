"use client";
import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | string | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  const formattedPrice =
    typeof amount === "string"
      ? amount
      : new Number(amount ?? 0).toLocaleString("pl-PL", {
          currency: "PLN",
          style: "currency",
          minimumFractionDigits: 2,
        });
  return (
    <span
      className={twMerge("text-sm font-semibold text-darkColor", className)}
    >
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;
