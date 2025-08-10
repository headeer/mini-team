import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp } from "lucide-react";

const ObrobkaResults = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge className="bg-green-100 text-green-800 border-green-200">Rezultaty</Badge>
        <h2 className="text-3xl font-bold text-gray-900">Jak technologia FIBER + CNC zmieniła nasz biznes</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Korzyści dla klientów</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Terminy realizacji 24–48h zamiast tygodni",
                "Dokładność cięcia ±0,02mm – idealne pasowanie",
                "Gładkie krawędzie bez dodatkowej obróbki",
                "Optymalne wykorzystanie materiału – minimum odpadów"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Korzyści biznesowe</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Marże wzrosły o 40% dzięki większej efektywności",
                "Więcej zleceń w tym samym czasie",
                "Spokój – jeden dostawca \"od pliku do gotowego elementu\"",
                "Konkurencja przestała mieć znaczenie"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ObrobkaResults;