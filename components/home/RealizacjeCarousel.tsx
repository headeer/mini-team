import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    title: "Budowa drogi lokalnej – łyżka skarpowa 120 cm",
    image: "https://cdn.builder.io/api/v1/image/assets%2F1da19f26bd614858b393d192aecff340%2F9c6084cb6ae549c4946df0af676d89d7?format=webp&width=800",
  },
  {
    title: "Prace rolnicze – szybkozłącze MS03 montaż w 5 min",
    image: "https://cdn.builder.io/api/v1/image/assets%2F1da19f26bd614858b393d192aecff340%2F28e45546454a456fb2c0d4a2ff02c810?format=webp&width=800",
  },
  {
    title: "Przesiewanie gruzu – grabie 140 cm",
    image: "https://cdn.builder.io/api/v1/image/assets%2F1da19f26bd614858b393d192aecff340%2Ff4392396593447b2b34120f6ee55308b?format=webp&width=800",
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
              <img src={it.image} alt={it.title} className="w-full h-48 object-cover" />
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

