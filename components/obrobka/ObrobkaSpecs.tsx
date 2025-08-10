import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Settings } from "lucide-react";

const specs = [
  {
    title: "Laser FIBER 6000W",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500",
    specs: [
      { label: "Format maksymalny", value: "3000 × 1500 mm" },
      { label: "Dokładność cięcia", value: "±0,02 mm" },
      { label: "Stal czarna", value: "do 20 mm" },
      { label: "Stal nierdzewna", value: "do 12 mm" },
      { label: "Aluminium", value: "do 8 mm" }
    ]
  },
  {
    title: "Prasa krawędziowa CNC",
    icon: Settings,
    gradient: "from-purple-500 to-violet-500",
    specs: [
      { label: "Siła nacisku", value: "do 100 ton" },
      { label: "Długość gięcia", value: "do 3000 mm" },
      { label: "Powtarzalność", value: "±0,1 mm" },
      { label: "Programowanie", value: "offline/online" },
      { label: "Zakres kątów", value: "0° - 180°" }
    ]
  }
];

const ObrobkaSpecs = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]">
          Specyfikacja Techniczna
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900">Parametry naszych maszyn</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Najnowocześniejsze technologie w służbie precyzji i szybkości
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {specs.map((spec) => {
          const IconComponent = spec.icon;
          return (
            <Card key={spec.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${spec.gradient}`} />
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${spec.gradient} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{spec.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {spec.specs.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600 font-medium">{item.label}</span>
                      <span className="text-gray-900 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ObrobkaSpecs;