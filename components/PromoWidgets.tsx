"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import zrywak from "@/images/zrywak.png";
import wiertnica from "@/images/weirtnica_glebowa.png";
import wiertla from "@/images/wiertla.jpg";

type Promo = {
  title: string;
  subtitle?: string;
  href: string;
  image: any;
};

const promos: Promo[] = [
  { title: "Rippery (zrywak)", subtitle: "Korzenie, skały", href: "/shop?category=rippery", image: zrywak },
  { title: "Wiertnice glebowe", subtitle: "Napędy + wiertła", href: "/shop?category=wiertnice", image: wiertnica },
  { title: "Wiertła", subtitle: "Świder do ziemi", href: "/shop?q=wiertlo", image: wiertla },
];

export default function PromoWidgets() {
  return (
    <div className="space-y-3">
      {promos.map((p) => (
        <Link key={p.title} href={p.href} className="block group">
          <div className="rounded-xl border bg-white overflow-hidden hover:shadow-lg transition">
            <div className="relative aspect-[5/3] bg-gray-50">
              <Image src={p.image} alt={p.title} fill className="object-cover" sizes="240px" />
            </div>
            <div className="p-3">
              <div className="text-sm font-semibold group-hover:text-[var(--color-brand-orange)] transition-colors line-clamp-2">
                {p.title}
              </div>
              {p.subtitle ? (
                <div className="text-xs text-gray-600">{p.subtitle}</div>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}



