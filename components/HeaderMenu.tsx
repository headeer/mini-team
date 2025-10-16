"use client";
import { headerData, categoriesData } from "@/constants/data";
import { Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CategoryIconSprite from "./CategoryIconSprite";

interface HeaderMenuProps {
  user?: any;
}

const HeaderMenu = ({ user }: HeaderMenuProps) => {
  const pathname = usePathname();
  const [offerOpen, setOfferOpen] = React.useState(false);
  const [obrobkaOpen, setObrobkaOpen] = React.useState(false);

  return (
    <nav aria-label="Główne menu" className="hidden lg:flex items-center gap-1 text-sm font-semibold">
      {/* Primary highlighted links (with Oferta mega menu) */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {headerData?.slice(0, 1).map((item) => (
          <Link key={item?.title} href={item?.href} className={`px-3 py-2 rounded-md transition ${pathname === item?.href ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:text-gray-900 hover:bg-white"}`}>{item?.title}</Link>
        ))}
        {/* Części link */}
        <Link 
          href="/czesci" 
          className={`px-3 py-2 rounded-md transition ${pathname === "/czesci" ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:text-gray-900 hover:bg-white"}`}
        >
          Części
        </Link>
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
        {/* Obróbka blach przeniesiona do sekcji z podświetlonym tłem */}
        <Popover open={obrobkaOpen} onOpenChange={setObrobkaOpen}>
          <PopoverTrigger asChild>
            <Link
              href="/obrobka-blach"
              onMouseEnter={() => setObrobkaOpen(true)}
              className={`px-3 py-2 rounded-md transition ${pathname?.startsWith('/obrobka-blach') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:text-gray-900 hover:bg-white'}`}
              aria-haspopup="menu"
            >
              Obróbka blach
            </Link>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={10} className="w-[420px] p-3 rounded-2xl" onMouseLeave={() => setObrobkaOpen(false)}>
            <div className="grid grid-cols-1 gap-2">
              {[
                { title: 'Cięcie laserem 6kW', href: '/obrobka-blach/laser' },
                { title: 'Gięcie blach', href: '/obrobka-blach/giecie' },
                { title: 'Frezowanie CNC', href: '/obrobka-blach/frezowanie' },
                { title: 'Toczenie', href: '/obrobka-blach/toczenie' },
              ].map((s) => (
                <Link key={s.href} href={s.href} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 border">
                  <span className="text-sm font-medium text-gray-800 truncate">{s.title}</span>
                  <span className="text-[10px] text-gray-500">Zobacz</span>
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* Secondary links */}
      <div className="flex items-center gap-1 ml-1">
        {headerData?.slice(3)
          .filter((item) => item?.href !== "/obrobka-blach")
          .filter((item) => item?.href !== "/orders" || user) // Hide orders if not logged in
          .map((item) => (
          <Link
            key={item?.title}
            href={item?.href}
            className={`px-3 py-2 rounded-md transition ${
              pathname === item?.href ? "text-gray-900 bg-gray-50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {item?.href === '/orders' ? (
              <span className="inline-flex items-center gap-2"><Package className="w-4 h-4" /> {item?.title}</span>
            ) : item?.title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default HeaderMenu;
