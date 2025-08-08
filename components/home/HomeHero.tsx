import React from "react";
import { Button } from "@/components/ui/button";
import Title from "@/components/Title";

const HomeHero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden rounded-lg">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F1da19f26bd614858b393d192aecff340%2F28e45546454a456fb2c0d4a2ff02c810?format=webp&width=1200"
          alt="Łyżka Hardox HB500 na placu budowy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60"></div>
      </div>
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center text-white space-y-6">
        <Title className="text-4xl md:text-6xl font-bold leading-tight">
          Twój osprzęt <span className="text-[var(--color-brand-orange)]">zawodzi?</span>
        </Title>
        <p className="text-xl md:text-2xl text-gray-100">
          Polskie łyżki Hardox HB500 – trzykrotnie dłuższa żywotność, dopasowane do JCB, CAT i Volvo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white px-8 py-6 text-lg font-semibold rounded-lg">
            💰 Bezpłatna wycena
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-semibold rounded-lg">
            📞 Zadzwoń 782 851 962
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

