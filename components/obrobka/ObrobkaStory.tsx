import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import imgCrisis from "@/images/blachy/ciecie_laserowe.webp";
import imgAfter from "@/images/blachy/laser_cut.jpg";
import imgBefore from "@/images/blachy/cnc-laser-cutting-of-metal-modern-industrial-tech-2025-03-07-07-06-06-utc.jpg";

const ObrobkaStory = () => (
  <section className="space-y-8">
    <div className="text-center space-y-4">
      <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]">
        Nasza Historia
      </Badge>
      <h2 className="text-3xl font-bold text-gray-900">Jak zaczęła się rewolucja w obróbce blach</h2>
    </div>
    
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <Image src={imgBefore} alt="Cięcie laserowe" className="w-full h-48 object-cover" />

        <CardContent className="p-6 text-gray-700 space-y-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] flex items-center justify-center text-white font-bold text-xl">
            1
          </div>
          <p className="text-lg leading-relaxed">
            Przez 15 lat budowałem reputację w branży metalowej. W marcu 2023 roku klient przyniósł pilne zlecenie: 200 precyzyjnych elementów w zaledwie 48 godzin.
          </p>
          <blockquote className="border-l-4 border-[var(--color-brand-orange)] pl-4 italic text-gray-600">
            &bdquo;Piotr, liczę na ciebie. Jeśli nie zdążysz, stracę całą inwestycję&rdquo;
          </blockquote>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
        <Image src={imgCrisis} alt="Cięcie laserowe" className="w-full h-48 object-cover" />
        <CardContent className="p-6 text-gray-700 space-y-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] flex items-center justify-center text-white font-bold text-xl">
            2
          </div>
          <p className="text-lg leading-relaxed">
            Stare maszyny zawiodły: szorstkie krawędzie, odchyłki milimetrowe. Wiedziałem, że groziła mi utrata najważniejszego kontraktu i relacji biznesowej.
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
        <Image src={imgAfter} alt="Laser FIBER" className="w-full h-48 object-cover" />
        <CardContent className="p-6 text-gray-700 space-y-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] flex items-center justify-center text-white font-bold text-xl">
            3
          </div>
          <p className="text-lg leading-relaxed">
            &bdquo;Może to znak, że czas na zmiany?&rdquo; — powiedziała żona. Zamiast się poddać, postanowiłem zainwestować w najnowocześniejszą technologię.
          </p>
        </CardContent>
      </Card>
    </div>
  </section>
);

export default ObrobkaStory;

