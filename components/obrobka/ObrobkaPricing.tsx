import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scissors, Wrench, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

const pricingItems = [
  {
    icon: Scissors,
    title: "Cięcie laserem",
    price: "od 3,50 zł/min",
    description: "Precyzyjne cięcie FIBER 6kW",
    gradient: "from-blue-500 to-cyan-500",
    features: ["Dokładność ±0,02mm", "Gładkie krawędzie", "Bez dodatkowej obróbki"]
  },
  {
    icon: Wrench,
    title: "Gięcie CNC",
    price: "od 15 zł/zagięcie",
    description: "Programowalne gięcie precyzyjne",
    gradient: "from-green-500 to-emerald-500",
    features: ["Powtarzalność ±0,1mm", "Każdy kąt", "Serie produkcyjne"]
  },
  {
    icon: Zap,
    title: "Express 24h",
    price: "+30%",
    description: "Pilne realizacje w 24h",
    gradient: "from-red-500 to-orange-500",
    features: ["Priorytet w kolejce", "Gwarancja terminu", "Dostępne 24/7"]
  }
];

const discounts = [
  { label: "Stali klienci (5+ zleceń/mies.)", value: "do 10%" },
  { label: "Umowy roczne", value: "do 15%" },
  { label: "Duże serie (100+ elementów)", value: "kalkulacja indywidualna" },
];

const ObrobkaPricing = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]">
          Cennik
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900">Transparentne ceny bez ukrytych kosztów</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Konkurencyjne stawki z możliwością rabatów dla stałych klientów
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {pricingItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${item.gradient}`} />
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-3">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-gray-900">{item.price}</div>
                  {item.title === "Express 24h" && (
                    <div className="text-sm text-gray-500">do ceny podstawowej</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.gradient}`} />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rabaty */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-8">
          <div className="text-center space-y-4 mb-6">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-900">System rabatów</h3>
            <p className="text-gray-600">Im dłuższa współpraca, tym lepsze warunki</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {discounts.map((discount, index) => (
              <div key={index} className="text-center p-4 bg-white/60 rounded-lg">
                <div className="font-semibold text-gray-900 mb-1">{discount.label}</div>
                <div className="text-lg font-bold text-green-600">{discount.value}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition-transform">
              <Link href="#wycena">SPRAWDŹ SWOJĄ CENĘ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ObrobkaPricing;