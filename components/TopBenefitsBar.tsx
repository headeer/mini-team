"use client";
import React from "react";

const TopBenefitsBar = () => {
  return (
    <div className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white py-2.5 px-3 text-center">
      {/* Mobile: Stacked layout */}
      <div className="sm:hidden space-y-1">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
          <span>🚚</span>
          <span>DOSTAWA W 24H</span>
          <span className="opacity-60">•</span>
          <span>🛡️</span>
          <span>2 LATA GWARANCJI</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
          <span>🇵🇱</span>
          <span>POLSKI PRODUCENT</span>
        </div>
      </div>
      
      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center justify-center gap-4 lg:gap-6 text-sm font-semibold tracking-wide">
        <div className="flex items-center gap-2">
          <span>🚚</span>
          <span className="uppercase">EKSPRESOWA DOSTAWA W 24H</span>
        </div>
        <span className="opacity-60">|</span>
        <div className="flex items-center gap-2">
          <span>🛡️</span>
          <span className="uppercase">GWARANCJA 2 LATA</span>
        </div>
        <span className="opacity-60">|</span>
        <div className="flex items-center gap-2">
          <span>🇵🇱</span>
          <span className="uppercase">POLSKI PRODUCENT</span>
        </div>
      </div>
    </div>
  );
};

export default TopBenefitsBar;

