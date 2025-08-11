"use client";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Główne menu" className="hidden lg:flex items-center gap-1 text-sm font-semibold">
      {/* Primary highlighted links */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {headerData?.slice(0, 3).map((item) => (
          <Link
            key={item?.title}
            href={item?.href}
            className={`px-3 py-2 rounded-md transition ${
              pathname === item?.href
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-700 hover:text-gray-900 hover:bg-white"
            }`}
          >
            {item?.title}
          </Link>
        ))}
      </div>
      {/* Secondary links */}
      <div className="flex items-center gap-1 ml-1">
        {headerData?.slice(3).map((item) => (
          <Link
            key={item?.title}
            href={item?.href}
            className={`px-3 py-2 rounded-md transition ${
              pathname === item?.href ? "text-gray-900 bg-gray-50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {item?.title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default HeaderMenu;
