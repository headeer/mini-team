import Container from "@/components/Container";
import AppHeading from "@/components/ui/AppHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Phone, Mail, Clock, MessageCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Kontakt – MiniTeamProject",
  description:
    "Skontaktuj się z MiniTeamProject: telefon, e‑mail, formularz zapytania i lokalizacja.",
};

export default function KontaktPage() {
  return (
    <div className="bg-white">
      <Container className="py-8">
        <AppHeading
          title="Kontakt"
          description="Skontaktuj się z nami – odpowiemy na wszystkie pytania dotyczące naszych produktów."
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Lewa kolumna: informacje kontaktowe */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Szybki kontakt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Telefon</h4>
                  <p className="text-gray-600">
                    <Link href="tel:+48782851962" className="hover:text-[var(--color-brand-orange)]">
                      +48 782 851 962
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500">Pon-Pt: 8:00-16:00</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">E-mail</h4>
                  <p className="text-gray-600">
                    <Link href="mailto:kontakt@miniteamproject.pl" className="hover:text-[var(--color-brand-orange)]">
                      kontakt@miniteamproject.pl
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500">Odpowiadamy w ciągu 24h</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Godziny pracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Poniedziałek - Piątek</span>
                    <span className="font-medium">8:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sobota - Niedziela</span>
                    <span className="font-medium text-gray-500">Zamknięte</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lokalizacja</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>Mini Team Project</strong><br />
                  ul. Przykładowa 123<br />
                  00-000 Warszawa<br />
                  Polska
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Prawa kolumna: formularz */}
          <Card>
            <CardHeader>
              <CardTitle>Wyślij zapytanie</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* Sekcja dodatkowych informacji */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Phone className="w-8 h-8 text-[var(--color-brand-orange)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Telefoniczne doradztwo</h3>
              <p className="text-sm text-gray-600">
                Pomożemy dobrać odpowiedni produkt do Twojej maszyny
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Mail className="w-8 h-8 text-[var(--color-brand-orange)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Szybka odpowiedź</h3>
              <p className="text-sm text-gray-600">
                Odpowiadamy na e-maile w ciągu 24 godzin
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="w-8 h-8 text-[var(--color-brand-orange)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Profesjonalne doradztwo</h3>
              <p className="text-sm text-gray-600">
                Nasi eksperci pomogą wybrać najlepsze rozwiązanie
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}