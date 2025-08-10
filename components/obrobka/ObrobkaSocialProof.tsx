import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Uratowali kontrakt wart 200 tysięcy złotych. Elementy były gotowe w 36 godzin i pasowały idealnie. Teraz to mój jedyny dostawca.",
    author: "Marcin K.",
    company: "Konstrukcje stalowe, Żmigród",
    rating: 5
  },
  {
    quote: "Próbowałem z 3 różnymi firmami. Wszędzie były problemy z terminami lub jakością. MiniTeamProject to jedyne miejsce, gdzie mogę spać spokojnie.",
    author: "Adam S.",
    company: "Warsztat mechaniczny, Oleśnica",
    rating: 5
  },
  {
    quote: "Ceny uczciwe, terminy dotrzymywane, jakość na europejskim poziomie. Współpracujemy już rok bez żadnych zastrzeżeń. Polecam w 100%.",
    author: "Robert M.",
    company: "Maszyny rolnicze, Milicz",
    rating: 5
  }
];

const ObrobkaSocialProof = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Opinie Klientów</Badge>
        <h2 className="text-3xl font-bold text-gray-900">Co mówią o nas nasi klienci</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Prawdziwe opinie od firm, które zaufały naszej technologii
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Quote className="w-8 h-8 text-[var(--color-brand-orange)] opacity-60" />
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-gray-800 italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              
              <div className="pt-4 border-t border-orange-100">
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-600">{testimonial.company}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]">
          Średnia ocena: 5/5 ⭐ | 100% zadowolonych klientów
        </Badge>
      </div>
    </section>
  );
};

export default ObrobkaSocialProof;