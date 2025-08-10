import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Clock } from "lucide-react";
import img1 from "@/images/blachy/ciecie_laser.webp";
import img2 from "@/images/blachy/ciecie_laserowe.webp";
import img3 from "@/images/blachy/laser.webp";
import Image from "next/image";

const secrets = [
  { 
    title: "Technologia FIBER 6kW", 
    description: "10× szybsza niż tradycyjne lasery CO2. Realizujemy krótkie serie i terminy last minute bez kompromisów w jakości.", 
    image: img1,
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    title: "Precyzja CNC ±0,02 mm", 
    description: "Powtarzalność i idealne pasowanie elementów dzięki programowalnemu gięciu. Każdy element identyczny co do milimetra.", 
    image: img2,
    icon: Target,
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    title: "Kompleksowa obsługa", 
    description: "Cięcie + gięcie w jednym miejscu, w jeden dzień. Bez przestojów, bez dodatkowych podwykonawców.", 
    image: img3,
    icon: Clock,
    gradient: "from-purple-500 to-violet-500"
  },
];

const ObrobkaSecrets = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]">
          Nasza Przewaga
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900">Dlaczego jesteśmy najszybsi i najprecyzyjniejsi</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Kombinacja najnowocześniejszych technologii, która daje nam przewagę nad konkurencją
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {secrets.map((secret, index) => {
          const IconComponent = secret.icon;
          return (
            <Card key={secret.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group">
              <div className="relative">
                <Image src={secret.image} alt="" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r ${secret.gradient} flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[var(--color-brand-orange)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{secret.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{secret.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  );
};

export default ObrobkaSecrets;

