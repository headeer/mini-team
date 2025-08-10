"use client";
import React from "react";

const TopBenefitsBar = () => {
  return (
    <div className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white py-2 px-4 text-center text-xs sm:text-sm font-semibold tracking-wide">
      <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
        <span className="uppercase">EKSPRESOWA DOSTAWA 48H</span>
        <span className="opacity-60">|</span>
        <span className="uppercase">GWARANCJA 2 LATA</span>
        <span className="opacity-60">|</span>
        <span className="uppercase">POLSKI PRODUCENT</span>
      </div>
    </div>
  );
};

export default TopBenefitsBar;

