import Container from "@/components/Container";
import AppHeading from "@/components/ui/AppHeading";
import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Nasze realizacje",
  description: "Przykładowe realizacje MiniTeamProject – Hardox HB500, 48h dostawy, polski producent.",
};

export default function RealizacjePage() {
  return (
    <div className="bg-white">
      <Container className="py-10 space-y-10">
        <AppHeading
          eyebrow="Case studies"
          title="Nasze realizacje"
          subtitle="Każdy projekt to dla nas wyzwanie i okazja, by pokazać, jak niezawodny i wszechstronny jest nasz osprzęt."
        />

        {/* Case studies grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="overflow-hidden rounded-xl border bg-white hover:shadow-lg transition-all h-full flex flex-col">
            <div className="relative w-full h-48">
              <Image src="/images/products/product_1.png" alt="Realizacja 1" fill className="object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2 py-0.5 text-xs rounded bg-black/80 text-white">JCB</span>
                <span className="px-2 py-0.5 text-xs rounded bg-[var(--color-brand-orange)] text-white">2024</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-3">
              <h3 className="text-lg font-bold text-gray-900">Budowa Galerii Krakowskiej – Etap II</h3>
              <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
                <li>Klient: Budimex SA</li>
                <li>Projekt: 15 łyżek różnych szerokości</li>
                <li>Wyzwanie: Dostawa w 48h w wiele lokalizacji</li>
              </ul>
              <div className="mt-auto p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                Rezultat: 100% terminowa dostawa, 0 reklamacji
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="overflow-hidden rounded-xl border bg-white hover:shadow-lg transition-all h-full flex flex-col">
            <div className="relative w-full h-48">
              <Image src="/images/products/product_3.png" alt="Realizacja 2" fill className="object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2 py-0.5 text-xs rounded bg-black/80 text-white">CAT</span>
                <span className="px-2 py-0.5 text-xs rounded bg-[var(--color-brand-orange)] text-white">2024</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-3">
              <h3 className="text-lg font-bold text-gray-900">Modernizacja sieci wodociągowej – Warszawa</h3>
              <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
                <li>Klient: MPWiK Warszawa</li>
                <li>Projekt: 8 łyżek wąskich do wykopów</li>
                <li>Wyzwanie: Trudny grunt miejski</li>
              </ul>
              <div className="mt-auto p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                Rezultat: 40% wzrost wydajności prac
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="overflow-hidden rounded-xl border bg-white hover:shadow-lg transition-all h-full flex flex-col">
            <div className="relative w-full h-48">
              <Image src="/images/products/product_4.png" alt="Realizacja 3" fill className="object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2 py-0.5 text-xs rounded bg-black/80 text-white">Volvo</span>
                <span className="px-2 py-0.5 text-xs rounded bg-[var(--color-brand-orange)] text-white">2024</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-3">
              <h3 className="text-lg font-bold text-gray-900">Melioracja 500ha – Wielkopolska</h3>
              <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
                <li>Klient: Gospodarstwo Kowalski</li>
                <li>Projekt: 4 łyżki rowkowe specjalne</li>
                <li>Wyzwanie: Specjalistyczny kształt rowków</li>
              </ul>
              <div className="mt-auto p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                Rezultat: Idealne rowki, zadowolony klient
              </div>
            </div>
          </div>
        </div>

        {/* Opis Techniczny */}
        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Opis Techniczny</h3>
          <p className="text-gray-700">
            Wszystkie realizacje wykonane zostały na stali Hardox HB500, zapewniającej wyjątkową wytrzymałość i odporność na zużycie. Montaż i demontaż osprzętu trwa zaledwie kilkadziesiąt sekund dzięki standardowym szybkozłączom (MS03, S40, Q-Fit), co znacząco przyspiesza zmianę narzędzi w terenie.
          </p>
        </div>

        {/* Opinia Klienta */}
        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Opinia Klienta</h3>
          <blockquote className="italic text-gray-800">
            „Dzięki łyżce skarpowej od MiniTeamProject czas pracy nad skarpami skrócił się o połowę. Wreszcie nie musimy tracić godzin na poprawki.”
          </blockquote>
          <p className="text-sm text-gray-600 mt-2">— Marek, Budownictwo Drogowe</p>
        </div>

        {/* Contact block (based on company info) */}
        <div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[var(--color-brand-orange)] mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Adres</p>
              <p className="text-sm text-gray-700">Ujazd 11, 56-330 Cieszków</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-[var(--color-brand-orange)] mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Telefon</p>
              <a href="tel:+48782851962" className="text-sm text-gray-700 hover:underline">782-851-962</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-[var(--color-brand-orange)] mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Godziny pracy</p>
              <p className="text-sm text-gray-700">Pn–Pt: 7:00–16:00, Sb: 8:00–12:00</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3">
          <p className="text-lg text-gray-800 font-semibold">Masz pytania dotyczące konkretnego zastosowania?</p>
          <p className="text-gray-700">Skontaktuj się z nami lub wypróbuj naszego asystenta AI — pomoże dobrać idealne rozwiązanie pod Twoje potrzeby!</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/kontakt" className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white font-semibold">
              Skontaktuj się z nami
            </Link>
            <Link href="#chat" className="inline-flex items-center px-6 py-3 rounded-lg border font-semibold hover:bg-gray-50">
              Rozpocznij rozmowę (AI)
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

