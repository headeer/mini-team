"use client";
import { AlignLeft } from "lucide-react";
import React, { useState } from "react";
import SideMenu from "./SideMenu";

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <button
        aria-label="Otwórz menu"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] text-white shadow-lg hover:shadow-xl active:scale-95 transition-all w-10 h-10"
      >
        <AlignLeft className="w-5 h-5" />
      </button>
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
};

export default MobileMenu;
