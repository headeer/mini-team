import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle, Clock } from "lucide-react";

const deadEnds = [
  {
    title: "Cięcie plazmą",
    description: "Wymaga dodatkowej obróbki krawędzi, co przedłuża czas realizacji o kolejne 24 godziny. Jakość przeciętna, koszty ukryte.",
    icon: X,
    color: "text-red-500"
  },
  {
    title: "Laser CO2",
    description: "Stare lasery CO2 są powolne i drogie w eksploatacji. Wysokie koszty gazu, częste awarie, efekt wciąż za wolny.",
    icon: AlertTriangle,
    color: "text-yellow-500"
  },
  {
    title: "Outsourcing do miasta",
    description: "Wielkie firmy z kolejkami na 2 tygodnie, kosmiczne ceny, brak elastyczności. \"Małe zlecenia nas nie interesują\".",
    icon: Clock,
    color: "text-gray-500"
  }
];

const ObrobkaDeadEnds = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="destructive">Problemy tradycyjnych metod</Badge>
        <h2 className="text-3xl font-bold text-gray-900">Co nie działało i dlaczego szukałem alternatywy</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Próbowałem różnych rozwiązań, ale każde miało swoje ograniczenia
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {deadEnds.map((deadEnd) => {
          const IconComponent = deadEnd.icon;
          return (
            <Card key={deadEnd.title} className="border-2 border-gray-100 hover:border-red-200 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${deadEnd.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{deadEnd.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{deadEnd.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ObrobkaDeadEnds;