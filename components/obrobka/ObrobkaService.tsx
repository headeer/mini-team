import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Settings, Clock, MapPin, Users, Lightbulb, DollarSign } from "lucide-react";

const services = [
  { icon: Zap, title: "Cięcie laserem FIBER 6kW", desc: "Najszybsza i najprecyzyjniejsza technologia" },
  { icon: Settings, title: "Gięcie blach prasą CNC", desc: "Powtarzalna precyzja ±0,1mm" },
  { icon: Clock, title: "Wycena w 2h po DXF", desc: "Błyskawiczna odpowiedź na zapytania" },
  { icon: CheckCircle, title: "Realizacja 24–48h", desc: "Ekspresowe terminy bez kompromisów" },
];

const benefits = [
  { icon: MapPin, title: "Dostawa w całej Polsce", desc: "Gratis do 50km, konkurencyjne stawki dalej" },
  { icon: Users, title: "Rabaty dla stałych klientów", desc: "Do 15% zniżki przy współpracy długoterminowej" },
  { icon: Lightbulb, title: "Doradztwo technologiczne", desc: "Optymalizacja projektów w cenie usługi" },
  { icon: DollarSign, title: "Optymalizacja kosztów", desc: "Minimalizacja odpadów materiału" },
];

const ObrobkaService = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white">
          Kompleksowa Usługa
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900">Wszystko czego potrzebujesz w jednym miejscu</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Od pliku DXF do gotowego elementu – obsługujemy cały proces produkcji
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Core Services */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Usługi Podstawowe</h3>
              <p className="text-gray-600">Najwyższa jakość technologii FIBER + CNC</p>
            </div>
            
            <div className="space-y-4">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/60 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{service.title}</h4>
                      <p className="text-sm text-gray-600">{service.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Additional Benefits */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dodatkowe Korzyści</h3>
              <p className="text-gray-600">Wartość dodana dla każdego klienta</p>
            </div>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/60 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ObrobkaService;