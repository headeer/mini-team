import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AppHeading from "@/components/ui/AppHeading";
import { Shield, Zap, Ruler, Wrench, Flag, Truck } from "lucide-react";

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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <AppHeading eyebrow="Korzyści" title="6 powodów, dla których warto" subtitle="Wybór, który procentuje w codziennej pracy" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ title, desc, Icon }, idx) => (
            <Card key={title} className="group border-0 shadow-sm hover:shadow-md transition overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)]" />
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 text-[var(--color-brand-orange)] flex items-center justify-center border">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">{String(idx + 1).padStart(2, '0')}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SevenReasons;

