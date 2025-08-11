import Container from "@/components/Container";
import Title from "@/components/Title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import imgPoster from "@/images/blachy/laser.webp";

const ObrobkaHero = () => {
  return (
    <section className="relative w-full min-h-[75vh] flex items-center overflow-hidden">
      {/* dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/60 z-10" />

      {/* full-bleed background video (16:9 scaled to cover) */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 w-[177.78vh] h-[100vh] -translate-x-1/2 -translate-y-1/2">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/bm1oOOgKh7c?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=0&fs=0&playlist=bm1oOOgKh7c"
            title="Obróbka blach - video"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen={false}
          />
        </div>
      </div>

      {/* content */}
      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-white">
          <div className="max-w-4xl text-center mx-auto">
            <p className="uppercase tracking-widest text-[var(--color-brand-orange)] font-semibold text-xs mb-2">Obróbka Blach</p>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="block">Obróbka Blach,</span>
              <span className="block mt-1">Cięcie Laserem <span className="title-stroke">FIBER 6kW</span> 
                <span className="title-accent-wrap">
                  <span className="text-white">+ Gięcie CNC</span>
                  <span className="title-accent-backbar" aria-hidden />
                  <svg className="hero-underline-svg" viewBox="0 0 400 18" preserveAspectRatio="none" aria-hidden>
                    <defs>
                      <linearGradient id="heroGradObr" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-brand-red)" />
                        <stop offset="100%" stopColor="var(--color-brand-orange)" />
                      </linearGradient>
                    </defs>
                    <path className="glow" d="M5 12 Q 120 2 200 9 T 395 12" fill="none" stroke="url(#heroGradObr)" />
                    <path className="main" d="M5 12 Q 120 2 200 9 T 395 12" fill="none" stroke="url(#heroGradObr)" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h2>
            <p className="mt-4 text-lg md:text-2xl text-gray-100">Hardox HB500 • Gwarancja 2 lata • Terminy 24–48 h • Cała Polska</p>

            {/* Trust chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/90">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 border border-white/20">Wycena DXF 2h</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 border border-white/20">Dokładność 0,02 mm</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 border border-white/20">Powt. gięcia ±0,5°</span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#wycena" className="btn-shine inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-white font-semibold h-9 px-4 py-2 bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] hover:scale-105 transition-transform shadow-lg">
                WYŚLIJ PLIK DXF – WYCENA W 2 H
              </a>
              <a href="tel:+48782851962" className="btn-shine inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm h-9 px-4 py-2 bg-white/20 text-white font-semibold backdrop-blur-md border border-white/40 hover:bg-white/30 hover:text-white shadow-md">
                ZADZWOŃ TERAZ
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObrobkaHero;

