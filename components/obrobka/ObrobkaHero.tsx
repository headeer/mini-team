import Container from "@/components/Container";
import Title from "@/components/Title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import imgPoster from "@/images/blachy/laser.webp";

const ObrobkaHero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
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
      <Container className="relative z-10 py-16 text-center text-white space-y-6">
        <Badge className="bg-[var(--color-brand-orange)]">Obróbka Blach</Badge>
        <Title className="text-4xl md:text-5xl font-extrabold">Obróbka Blach – Cięcie Laserem FIBER 6kW + Gięcie CNC</Title>
        <p className="text-lg md:text-xl text-gray-100">Hardox HB500 - Gwarancja 2 lata - Terminy 24–48 h - Cała Polska</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] hover:scale-105 transition-transform shadow-lg">
            <Link href="#wycena">WYŚLIJ PLIK DXF – WYCENA W 2 H</Link>
          </Button>
          <Button
            className="bg-white/20 text-white font-semibold backdrop-blur-md border border-white/40 hover:bg-white/30 hover:text-white shadow-md"
            asChild
          >
            <a href="tel:+48570037128">ZADZWOŃ TERAZ</a>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ObrobkaHero;

