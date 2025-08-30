"use client";
import { headerData, categoriesData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CategoryIconSprite from "./CategoryIconSprite";

const HeaderMenu = () => {
  const pathname = usePathname();
  const [offerOpen, setOfferOpen] = React.useState(false);

  return (
    <nav aria-label="Główne menu" className="hidden lg:flex items-center gap-1 text-sm font-semibold">
      {/* Primary highlighted links (with Oferta mega menu) */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {headerData?.slice(0, 1).map((item) => (
          <Link key={item?.title} href={item?.href} className={`px-3 py-2 rounded-md transition ${pathname === item?.href ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:text-gray-900 hover:bg-white"}`}>{item?.title}</Link>
        ))}
        <Popover open={offerOpen} onOpenChange={setOfferOpen}>
          <PopoverTrigger asChild>
            <Link
              href="/shop"
              onMouseEnter={() => setOfferOpen(true)}
              className={`px-3 py-2 rounded-md transition ${pathname === "/shop" ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:text-gray-900 hover:bg-white"}`}
              aria-haspopup="menu"
            >
              Oferta
            </Link>
          </PopoverTrigger>
          <PopoverContent align="start" sideOffset={10} className="w-[560px] p-3 rounded-2xl" onMouseLeave={() => setOfferOpen(false)}>
            <div className="grid grid-cols-2 gap-2">
              {categoriesData.map((c) => (
                <Link
                  key={c.href}
                  href={`/shop?category=${encodeURIComponent(c.href)}`}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 border overflow-hidden flex items-center justify-center">
                      <CategoryIconSprite title={c.title} className="w-[32px] h-[32px]" />
                    </div>
                    <span className="text-sm font-medium text-gray-800 truncate">{c.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Zobacz</span>
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {headerData?.slice(2, 3).map((item) => (
          <Link key={item?.title} href={item?.href} className={`px-3 py-2 rounded-md transition ${pathname === item?.href ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:text-gray-900 hover:bg-white"}`}>{item?.title}</Link>
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
