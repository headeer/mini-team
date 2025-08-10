import React from "react";
import { Button } from "@/components/ui/button";
import Title from "@/components/Title";

const HomeHero = () => {
  return (
    <section className="relative min-h-[64vh] flex items-center justify-center overflow-hidden rounded-xl">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F1da19f26bd614858b393d192aecff340%2F28e45546454a456fb2c0d4a2ff02c810?format=webp&width=1200"
          alt="Łyżka Hardox HB500 na placu budowy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60"></div>
      </div>
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center text-white space-y-5">
        <Title className="text-4xl md:text-5xl font-bold leading-tight">
          Twój sprzęt <span className="text-[var(--color-brand-orange)]">zawodzi?</span>
        </Title>
        <p className="text-xl md:text-2xl text-gray-100">
          Łyżki Hardox HB500 – nawet 3× dłuższa żywotność. Kompatybilność: JCB, CAT, Volvo i inne.
        </p>
        <p className="text-lg text-gray-100/90">Dostawa 48 h | 2 lata gwarancji | Polska produkcja</p>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white px-7 py-4 text-base font-semibold rounded-lg shadow hover:shadow-md">
              <a href="/obrobka-blach#wycena">Bezpłatna wycena</a>
            </Button>
            <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 px-7 py-4 text-base font-semibold rounded-lg">
              <a href="tel:+48570037128">Zadzwoń</a>
            </Button>
          </div>
          <div className="text-sm text-white/80">lub</div>
          <Button asChild variant="link" className="text-white text-base underline underline-offset-4 hover:text-white">
            <a href="#products">Przewiń do produktów</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

