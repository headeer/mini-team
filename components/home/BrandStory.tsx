"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Quote } from "lucide-react";
import Image from "next/image";
import brandBg from "@/images/main/close-up-of-excavator-at-construction-site-backho-2025-01-29-04-41-18-utc.webp";

const BrandStory = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <Image
          src={brandBg}
          alt="Nasze osprzęty w pracy"
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 100vw, 100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/50" />
      </div>
      <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 text-white">
        <div className="max-w-3xl">
          <p className="uppercase tracking-widest text-[var(--color-brand-orange)] font-semibold text-xs mb-2">
            Polska produkcja • Hardox HB500 • Operator-first
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
            Robimy osprzęt, który wytrzymuje realną robotę – nie tylko katalog
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-100/90">
            Projektujemy pod operatora: precyzja, sztywność, szybki montaż i kompatybilność ze
            szybkozłączami. Każdy element sprawdzamy w terenie, zanim trafi do Ciebie.
          </p>

          <div className="mt-5 border-l-2 border-[var(--color-brand-orange)] pl-4 text-gray-100 flex items-start gap-2">
            <Quote className="h-5 w-5 text-[var(--color-brand-orange)] mt-0.5" />
            <p className="italic text-sm md:text-base">
              „Lepiej zrobić raz, a dobrze. Dlatego nasze łyżki po całym dniu dalej trzymają linię.”
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
              <Link href="/realizacje">Zobacz w akcji</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/50 text-amber-700 hover:text-gray-900">
              <Link href="#fit-check">Sprawdź dopasowanie</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;



