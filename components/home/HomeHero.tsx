import React from "react";
import { Button } from "@/components/ui/button";
import Title from "@/components/Title";
import Image from "next/image";
import heroImg from "@/images/main/excavator-digging-into-the-ground-with-its-large-b-2025-02-09-20-08-19-utc.webp";
 

const HomeHero = () => {
  return (
    <section className="relative w-full min-h-[75vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <Image
          src={heroImg}
          alt="Koparka z łyżką Hardox HB500 na placu budowy"
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 100vw, 100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/60"></div>
      </div>
      <div className="z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-white">
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest text-[var(--color-brand-orange)] font-semibold text-xs mb-3">Hardox HB500</p>
            <Title className="text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="block">Łyżki do koparek,</span>
              <span className="block mt-1">które <span className="title-stroke">wytrzymują</span> 
                <span className="title-accent-wrap">
                  <span className="text-white">realną robotę</span>
                <span className="title-accent-backbar" aria-hidden />
                <span className="shine-text absolute inset-0" data-text="realną robotę" aria-hidden />
                <svg className="hero-underline-svg" viewBox="0 0 400 18" preserveAspectRatio="none" aria-hidden>
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-brand-red)" />
                      <stop offset="100%" stopColor="var(--color-brand-orange)" />
                    </linearGradient>
                  </defs>
                  <path className="glow" d="M5 12 Q 120 2 200 9 T 395 12" fill="none" stroke="url(#heroGrad)" />
                  <path className="main" d="M5 12 Q 120 2 200 9 T 395 12" fill="none" stroke="url(#heroGrad)" strokeWidth="4" strokeLinecap="round" />
                </svg>
                </span>
              </span>
            </Title>
            <p className="mt-4 text-lg md:text-2xl text-gray-100">
              Dopasujemy do Twojej maszyny w 24h. JCB, CAT, Volvo, Bobcat i inne.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/80">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 border border-white/20">Dostawa 48h</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 border border-white/20">2 lata gwarancji</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 border border-white/20">Polska produkcja</span>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild className="btn-shine bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white px-7 py-4 text-base font-semibold rounded-lg shadow hover:shadow-lg">
                <a href="#fit-check">Sprawdź dopasowanie</a>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 px-7 py-4 text-base font-semibold rounded-lg">
                <a href="tel:+48570037128">Zadzwoń: 570-037-128</a>
              </Button>
            </div>
          </div>
        </div>
        {/* Scroll indicator to products */}
        <a href="#products" className="hero-scroll absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center text-white/90 hover:text-white" aria-label="Przewiń do produktów">
          <div className="hero-scroll-box">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" aria-hidden>
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 13.1716L7.05 8.22186L5.636 9.63607L12 16L18.364 9.63607L16.95 8.22186L12 13.1716Z" fill="currentColor"></path>
            </svg>
          </div>
          <span className="hero-scroll-text mt-1 text-xs">Scroll</span>
        </a>
      </div>
    </section>
  );
};

export default HomeHero;

