import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import ObrobkaHero from "@/components/obrobka/ObrobkaHero";
import ObrobkaStory from "@/components/obrobka/ObrobkaStory";
import ObrobkaSecrets from "@/components/obrobka/ObrobkaSecrets";
import ObrobkaDeadEnds from "@/components/obrobka/ObrobkaDeadEnds";
import ObrobkaResults from "@/components/obrobka/ObrobkaResults";
import ObrobkaSpecs from "@/components/obrobka/ObrobkaSpecs";
import ObrobkaSocialProof from "@/components/obrobka/ObrobkaSocialProof";
import ObrobkaService from "@/components/obrobka/ObrobkaService";
import ObrobkaPricing from "@/components/obrobka/ObrobkaPricing";
import ObrobkaContactForm from "@/components/obrobka/ObrobkaContactForm";

export const metadata = {
  title: "Obróbka Blach – Cięcie Laserem FIBER 6kW + Gięcie CNC",
  description:
    "Cięcie laserem FIBER 6kW i gięcie CNC: dokładność 0,02 mm, terminy 24–48h, cała Polska. Wycena w 2h po DXF.",
};

export default function ObrobkaBlachPage() {
  return (
    <div className="bg-white">
      <ObrobkaHero />

      <Container className="py-12 space-y-12">
        <section className="text-center space-y-6 bg-gradient-to-r from-gray-50 to-orange-50 p-8 rounded-2xl">
          <Badge variant="outline" className="text-gray-600 border-gray-300">Nasza Historia</Badge>
          <blockquote className="text-2xl font-bold text-gray-900 italic max-w-4xl mx-auto">
            &bdquo;Stałem bezradny przed halą produkcyjną i wiedziałem, że straciłem najważniejszego klienta...&rdquo;
          </blockquote>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            To była chwila, która zmieniła wszystko. Moment, w którym zrozumiałem, że tradycyjne metody obróbki blach już nie wystarczą.
          </p>
        </section>

        <ObrobkaStory />

        <ObrobkaDeadEnds />

        <ObrobkaSecrets />

        <ObrobkaResults />

        <ObrobkaSpecs />



        <ObrobkaSocialProof />

        <ObrobkaService />

        <ObrobkaPricing />

        <ObrobkaContactForm />

        {/* Kontakt bezpośredni – usunięty na prośbę użytkownika (sekcje poniżej to zastępują) */}
      </Container>
    </div>
  );
}

