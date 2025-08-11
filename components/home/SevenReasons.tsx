import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AppHeading from "@/components/ui/AppHeading";
import { Shield, Zap, Ruler, Wrench, Flag, Truck, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Reason = { title: string; desc: string; Icon: React.ComponentType<{ className?: string }> };
const reasons: Reason[] = [
  { title: "Ekstremalna wytrzymałość", desc: "Hardox HB500 – praca bez kompromisów.", Icon: Shield },
  { title: "Szybki montaż", desc: "Kompatybilne szybkozłącza MS03, S40, Q-Fit.", Icon: Zap },
  { title: "Pełna gama rozmiarów", desc: "Od 18 cm do 150 cm – dla każdej pracy.", Icon: Ruler },
  { title: "Wyposażenie opcjonalne", desc: "Zęby i płaskowniki dopasowane do potrzeb.", Icon: Wrench },
  { title: "Polska produkcja", desc: "Kontrola jakości i szybka dostępność.", Icon: Flag },
  { title: "Szybka dostawa", desc: "48 h na terenie Polski.", Icon: Truck },
];

const SevenReasons = () => {
  return (
    <section className="relative py-20">
      {/* decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute -top-24 right-0 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left intro/CTA column */}
          <div className="lg:col-span-4 space-y-5">
            <AppHeading eyebrow="Korzyści" title="6 powodów, dla których warto" subtitle="Wybór, który procentuje w codziennej pracy" />
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Hardox HB500 + precyzyjna obróbka",
                "Dostawa nawet w 48 h",
                "Kompatybilność z popularnymi szybkozłączami",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-brand-orange)] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button asChild className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
                <Link href="/shop">Sprawdź ofertę</Link>
              </Button>
              <Button variant="outline" asChild className="border-gray-300">
                <a href="tel:+48570037128" aria-label="Zadzwoń do nas">
                  <Phone className="h-4 w-4 mr-2" /> Zadzwoń: 570-037-128
                </a>
              </Button>
            </div>
          </div>

          {/* Right features grid */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-5">
            {reasons.map(({ title, desc, Icon }, idx) => (
              <div
                key={title}
                className="group relative rounded-xl bg-white border border-gray-200 shadow-sm transition hover:shadow-lg hover:border-[var(--color-brand-orange)]/40 overflow-hidden"
              >
                {/* gradient top bar */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)]" />
                {/* subtle background pattern */}
                <div aria-hidden className="absolute -right-4 -bottom-4 w-40 h-40 rounded-full bg-gradient-to-tr from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 blur-xl scale-0 group-hover:scale-100 transition-transform duration-500" />
                <Card className="border-0 shadow-none">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-[var(--color-brand-orange)] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-gray-900 leading-tight pr-2">{title}</h3>
                          <span className="text-xs font-bold bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] bg-clip-text text-transparent">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SevenReasons;

