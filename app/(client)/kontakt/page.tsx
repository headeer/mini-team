import Container from "@/components/Container";
import AppHeading from "@/components/ui/AppHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Phone, Mail, Clock, Bot, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Kontakt – MiniTeamProject",
  description:
    "Skontaktuj się z MiniTeamProject: telefon, e‑mail, formularz zapytania i lokalizacja. Dostępny także chat AI.",
};

export default function KontaktPage() {
  return (
    <div className="bg-white">
      <Container className="py-10 space-y-12">
        <AppHeading title="Skontaktuj się z nami" subtitle="Jesteśmy do Twojej dyspozycji – zadzwoń, napisz lub odwiedź nas osobiście" />

        {/* Dane kontaktowe + Formularz */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lewa kolumna: dane kontaktowe */}
          <Card>
            <CardHeader>
              <CardTitle>Dane kontaktowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-gray-800">
              <div>
                <p className="font-semibold">MiniTeamProject Teodorczyk Piotr</p>
                <p>Ujazd 11, 56-330 Ujazd, woj. dolnośląskie</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[var(--color-brand-orange)]" />
                <a href="tel:+48570037128" className="hover:underline">570-037-128</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[var(--color-brand-orange)]" />
                <a href="mailto:teodorczykpt@gmail.com" className="hover:underline">teodorczykpt@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--color-brand-orange)]" />
                <p>
                  <span className="font-medium">Godziny pracy biura:</span> Pon–Pt: 8:00–16:00
                </p>
              </div>

              <div className="pt-2">
                <p className="font-medium">Szybki kontakt:</p>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Formularz poniżej</li>
                  <li>
                    Chat AI (ikona w prawym dolnym rogu)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prawa kolumna: formularz */}
          <Card>
            <CardHeader>
              <CardTitle>Wyślij zapytanie</CardTitle>
            </CardHeader>
            <CardContent>
              <form method="post" action="/api/contact" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Imię i nazwisko*
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      E-mail*
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
                      placeholder="jan@firma.pl"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefon
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
                      placeholder="+48 600 000 000"
                    />
                  </div>
                  <div>
                    <label htmlFor="sizeCm" className="block text-sm font-medium text-gray-700">
                      Rozmiar (cm)
                    </label>
                    <input
                      id="sizeCm"
                      name="sizeCm"
                      type="number"
                      min={0}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
                      placeholder="np. 60"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700">
                      Rodzaj osprzętu
                    </label>
                    <select
                      id="equipmentType"
                      name="equipmentType"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Wybierz
                      </option>
                      <option>Łyżka kopiąca</option>
                      <option>Łyżka skarpowa</option>
                      <option>Grabie</option>
                      <option>Zrywacz korzeni</option>
                      <option>Szybkozłącze</option>
                      <option>Inne</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="machineTier" className="block text-sm font-medium text-gray-700">
                      Zakres maszyn
                    </label>
                    <select
                      id="machineTier"
                      name="machineTier"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Wybierz
                      </option>
                      <option>1–1.5 t</option>
                      <option>1.5–2.3 t</option>
                      <option>2.3–3 t</option>
                      <option>3–5 t</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Wiadomość*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)]"
                    placeholder="Opisz czego potrzebujesz, model maszyny, mocowanie, itp."
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input id="rodo" name="rodo" type="checkbox" required className="mt-1" />
                  <label htmlFor="rodo" className="text-sm text-gray-700">
                    Wyrażam zgodę na przetwarzanie danych osobowych w celu obsługi zapytania.
                  </label>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
                  Wyślij zapytanie
                </Button>
                <p className="text-xs text-gray-500">Pola oznaczone * są wymagane.</p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Mapa Google */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Gdzie nas znajdziesz</h2>
          <div className="w-full h-[380px] overflow-hidden rounded-xl border">
            <iframe
              title="Mapa – Ujazd 11, 56-330 Ujazd"
              src="https://www.google.com/maps?q=Ujazd%2011%2C%2056-330%20Ujazd&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <Link
            href="https://www.google.com/maps/search/?api=1&query=Ujazd+11%2C+56-330+Ujazd"
            className="text-[var(--color-brand-orange)] hover:underline"
            target="_blank"
          >
            Zobacz w Google Maps
          </Link>
        </div>

        {/* Alternatywne kanały */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Inne sposoby kontaktu</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border p-4 flex items-center gap-3">
              <Bot className="h-6 w-6 text-[var(--color-brand-orange)]" />
              <div>
                <p className="font-medium">Chat AI</p>
                <p className="text-sm text-gray-600">Dostępny 24/7</p>
              </div>
            </div>
            <div className="rounded-lg border p-4 flex items-center gap-3">
              <Phone className="h-6 w-6 text-[var(--color-brand-orange)]" />
              <div>
                <p className="font-medium">Telefon</p>
                <p className="text-sm text-gray-600">Szybka odpowiedź 8:00–16:00</p>
              </div>
            </div>
            <div className="rounded-lg border p-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-[var(--color-brand-orange)]" />
              <div>
                <p className="font-medium">E-mail</p>
                <p className="text-sm text-gray-600">Odpowiedź do 24 h</p>
              </div>
            </div>
            <div className="rounded-lg border p-4 flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-[var(--color-brand-orange)]" />
              <div>
                <p className="font-medium">Formularz</p>
                <p className="text-sm text-gray-600">Najlepszy dla szczegółowych zapytań</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stopka podstrony */}
        <div className="flex flex-wrap items-center gap-4 justify-between border-t pt-6">
          <div className="flex gap-4 text-sm text-gray-700">
            <Link href="/shop" className="hover:underline">
              Oferta
            </Link>
            <Link href="/realizacje" className="hover:underline">
              Nasze Realizacje
            </Link>
            <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:underline">
              Polityka prywatności
            </Link>
          </div>
          <p className="text-sm text-gray-600">© 2025 MiniTeamProject Teodorczyk Piotr</p>
        </div>
      </Container>
    </div>
  );
}

