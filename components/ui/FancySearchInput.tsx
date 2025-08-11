"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onReset?: () => void;
};

const FancySearchInput: React.FC<Props> = ({ value, onChange, placeholder = "", className, onReset }) => {
  const handleReset = () => {
    onChange("");
    onReset?.();
  };

  return (
    <div
      className={cn(
        "relative w-full h-10 flex items-center rounded-full transition-all duration-300 ease-out bg-white px-3",
        "focus-within:rounded-md",
        className
      )}
    >
      {/* Animated bottom border */}
      <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full origin-center scale-x-0 bg-[var(--color-brand-red)] transition-transform duration-300 ease-out focus-within:scale-x-100" />

      {/* Search button (decorative) */}
      <button
        type="button"
        aria-label="Szukaj"
        className="text-[#8b8ba7] hover:text-gray-700 transition-colors"
        tabIndex={-1}
      >
        <svg width={17} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
          <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <input
        className="peer bg-transparent w-full h-full px-2 py-2 outline-none text-sm placeholder:text-gray-400"
        placeholder={placeholder}
        required
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Reset button */}
      <button
        type="button"
        onClick={handleReset}
        aria-label="Wyczyść"
        className={cn(
          "opacity-0 invisible transition-all duration-200 text-gray-500 hover:text-gray-700",
          value ? "opacity-100 visible" : ""
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default FancySearchInput;


