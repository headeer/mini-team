"use client";
import { Shield, Zap } from "lucide-react";
import React from "react";

const TopBenefitsBar = () => {
  return (
    <div className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white py-2 px-4 text-center text-sm font-medium">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1">
          <Zap className="h-4 w-4" /> EKSPRESOWA DOSTAWA 48H
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-4 w-4" /> GWARANCJA 2 LATA
        </span>
        <span className="flex items-center gap-1">
          🇵🇱 POLSKI PRODUCENT
        </span>
      </div>
    </div>
  );
};

export default TopBenefitsBar;

