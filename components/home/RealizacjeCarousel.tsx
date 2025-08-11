import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import imgA from "@/images/main/industrial-backhoe-excavator-loader-2024-09-12-10-51-04-utc.webp";
import imgB from "@/images/main/mini-excavator-digging-preparing-ground-under-home-2024-10-31-04-20-43-utc.webp";
import imgC from "@/images/main/excavator-bulldozer-repair-work-on-the-road-norw-2025-03-10-05-20-48-utc.webp";

const items = [
  {
    title: "Budowa drogi lokalnej – łyżka skarpowa 120 cm",
    image: imgA.src,
  },
  {
    title: "Prace rolnicze – szybkozłącze MS03 montaż w 5 min",
    image: imgB.src,
  },
  {
    title: "Przesiewanie gruzu – grabie 140 cm",
    image: imgC.src,
  },
];

const RealizacjeCarousel = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Nagłówek celowo usunięty – jest dostarczany przez AppHeading na stronie głównej */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <Card key={it.title}>
              <Image src={it.image} alt={it.title} width={1200} height={600} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <p className="text-sm text-gray-800">{it.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealizacjeCarousel;

