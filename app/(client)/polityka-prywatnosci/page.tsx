import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Polityka Prywatności - Mini Team Project",
  description: "Polityka prywatności i ochrony danych osobowych w sklepie Mini Team Project. Informacje o przetwarzaniu danych zgodnie z RODO.",
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="bg-white">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)] mb-4">
              Ochrona Danych
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Polityka Prywatności</h1>
            <p className="text-xl text-gray-600">
              Informacje o przetwarzaniu danych osobowych zgodnie z RODO
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Administrator danych osobowych</h2>
              <div className="space-y-3 text-gray-700">
                <p>Administratorem Twoich danych osobowych jest:</p>
                <div className="ml-6 bg-gray-50 p-4 rounded-lg">
                  <p><strong>MiniTeamProject Teodorczyk Piotr</strong><br />
                  Adres: Ujazd 11, 56-330 Ujazd, Dolnośląskie<br />
                  NIP: 9161401364<br />
                  E-mail: teodorczykpt@gmail.com<br />
                  Telefon: 782-851-962</p>
                </div>
                <p>W sprawach związanych z ochroną danych osobowych możesz skontaktować się z nami pod adresem: <strong>teodorczykpt@gmail.com</strong></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Jakie dane zbieramy i w jakim celu</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Realizacja zamówień</h3>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <p><strong>Zbierane dane:</strong> imię, nazwisko, adres, telefon, e-mail, NIP (dla firm)</p>
                    <p><strong>Podstawa prawna:</strong> wykonanie umowy (art. 6 ust. 1 lit. b RODO)</p>
                    <p><strong>Okres przechowywania:</strong> przez okres przedawnienia roszczeń (do 6 lat)</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Konto klienta</h3>
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <p><strong>Zbierane dane:</strong> dane rejestracyjne, historia zamówień, preferencje</p>
                    <p><strong>Podstawa prawna:</strong> wykonanie umowy (art. 6 ust. 1 lit. b RODO)</p>
                    <p><strong>Okres przechowywania:</strong> do usunięcia konta przez użytkownika</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Newsletter i marketing</h3>
                  <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                    <p><strong>Zbierane dane:</strong> adres e-mail, preferencje marketingowe</p>
                    <p><strong>Podstawa prawna:</strong> zgoda (art. 6 ust. 1 lit. a RODO)</p>
                    <p><strong>Okres przechowywania:</strong> do wycofania zgody</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Usługa &quot;Dobierz do maszyny&quot;</h3>
                  <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                    <p><strong>Zbierane dane:</strong> marka maszyny, model, preferencje wyszukiwania</p>
                    <p><strong>Podstawa prawna:</strong> prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO)</p>
                    <p><strong>Okres przechowywania:</strong> 2 lata</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.5 Weryfikacja kompatybilności (zdjęcia)</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                    <p><strong>Zbierane dane:</strong> zdjęcia osprzętu, dane kontaktowe</p>
                    <p><strong>Podstawa prawna:</strong> wykonanie umowy/zgoda (art. 6 ust. 1 lit. b/a RODO)</p>
                    <p><strong>Okres przechowywania:</strong> 1 rok lub do wycofania zgody</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.6 Obsługa reklamacji</h3>
                  <div className="bg-red-50 p-4 rounded-lg space-y-2">
                    <p><strong>Zbierane dane:</strong> dane kontaktowe, opis problemu, korespondencja</p>
                    <p><strong>Podstawa prawna:</strong> prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO)</p>
                    <p><strong>Okres przechowywania:</strong> przez okres przedawnienia roszczeń</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies i technologie śledzące</h2>
              <div className="space-y-3 text-gray-700">
                <p>Nasza strona wykorzystuje pliki cookies w następujących celach:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Cookies niezbędne</strong> - zapewniają podstawowe funkcjonalności (koszyk, sesja)</li>
                  <li><strong>Cookies analityczne</strong> - Google Analytics (anonimowe statystyki)</li>
                  <li><strong>Cookies marketingowe</strong> - personalizacja reklam (po wyrażeniu zgody)</li>
                  <li><strong>Cookies preferencji</strong> - zapamiętywanie ustawień użytkownika</li>
                </ul>
                <p>Możesz zarządzać cookies w ustawieniach przeglądarki. Zablokowanie niektórych cookies może wpłynąć na funkcjonalność strony.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Udostępnianie danych</h2>
              <div className="space-y-3 text-gray-700">
                <p>Twoje dane możemy udostępnić następującym kategoriom odbiorców:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Kurierzy i firmy logistyczne</strong> - w celu realizacji dostaw</li>
                  <li><strong>Operatorzy płatności</strong> - Stripe, banki</li>
                  <li><strong>Dostawcy usług IT</strong> - hosting, wsparcie techniczne</li>
                  <li><strong>Firmy księgowe</strong> - w celu prowadzenia księgowości</li>
                  <li><strong>Organy publiczne</strong> - gdy wymaga tego prawo</li>
                </ul>
                <p>Wszyscy odbiorcy są zobowiązani do ochrony Twoich danych na podstawie umów powierzenia.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Transfer danych poza UE</h2>
              <div className="space-y-3 text-gray-700">
                <p>W ograniczonym zakresie możemy przekazywać dane poza Europejski Obszar Gospodarczy:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Google Analytics</strong> - na podstawie decyzji adequacyjnej</li>
                  <li><strong>Stripe</strong> - na podstawie standardowych klauzul umownych</li>
                </ul>
                <p>Zapewniamy odpowiedni poziom ochrony zgodnie z wymogami RODO.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Twoje prawa</h2>
              <div className="space-y-4 text-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">✋ Prawo dostępu</h4>
                    <p className="text-sm">Możesz uzyskać informacje o przetwarzanych danych</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">✏️ Prawo sprostowania</h4>
                    <p className="text-sm">Możesz poprawić nieprawidłowe dane</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🗑️ Prawo usunięcia</h4>
                    <p className="text-sm">Możesz żądać usunięcia swoich danych</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">📦 Prawo przenoszenia</h4>
                    <p className="text-sm">Możesz otrzymać dane w formacie umożliwiającym transfer</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">⛔ Prawo ograniczenia</h4>
                    <p className="text-sm">Możesz ograniczyć przetwarzanie w określonych przypadkach</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🚫 Prawo sprzeciwu</h4>
                    <p className="text-sm">Możesz wnieść sprzeciw wobec przetwarzania</p>
                  </div>
                </div>
                <p>Aby skorzystać z swoich praw, skontaktuj się z nami pod adresem: <strong>teodorczykpt@gmail.com</strong></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Bezpieczeństwo danych</h2>
              <div className="space-y-3 text-gray-700">
                <p>Stosujemy odpowiednie środki techniczne i organizacyjne dla ochrony danych:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Szyfrowanie połączeń (SSL/TLS)</li>
                  <li>Regularne kopie zapasowe</li>
                  <li>Ograniczenie dostępu do danych</li>
                  <li>Monitorowanie bezpieczeństwa</li>
                  <li>Szkolenia pracowników</li>
                  <li>Umowy powierzenia z podwykonawcami</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Automatyczne podejmowanie decyzji</h2>
              <div className="space-y-3 text-gray-700">
                <p>W ograniczonym zakresie stosujemy automatyczne przetwarzanie:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>System rekomendacji produktów</strong> - na podstawie historii przeglądania</li>
                  <li><strong>Filtrowanie antyspamowe</strong> - ochrona przed niechcianymi wiadomościami</li>
                  <li><strong>Analiza zachowań</strong> - optymalizacja doświadczeń użytkownika</li>
                </ul>
                <p>Nie podejmujemy w pełni automatycznych decyzji wywierających skutki prawne.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Prawo wniesienia skargi</h2>
              <div className="space-y-3 text-gray-700">
                <p>Jeśli uważasz, że przetwarzamy Twoje dane niezgodnie z prawem, masz prawo wniesienia skargi do:</p>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p><strong>Prezes Urzędu Ochrony Danych Osobowych</strong><br />
                  ul. Stawki 2, 00-193 Warszawa<br />
                  Tel.: 22 531 03 00<br />
                  E-mail: kancelaria@uodo.gov.pl</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Zmiany w polityce prywatności</h2>
              <div className="space-y-3 text-gray-700">
                <p>Możemy okresowo aktualizować niniejszą Politykę Prywatności. O istotnych zmianach poinformujemy:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Przez komunikat na stronie głównej</li>
                  <li>Wiadomością e-mail do zarejestrowanych użytkowników</li>
                  <li>Powiadomieniem w aplikacji</li>
                </ul>
                <p>Zmiany wchodzą w życie z dniem publikacji nowej wersji na stronie internetowej.</p>
              </div>
            </section>

            <div className="bg-[var(--color-brand-orange)]/10 p-6 rounded-lg border border-[var(--color-brand-orange)]/20 mt-12">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kontakt w sprawach RODO</h3>
              <p className="text-gray-700">
                W przypadku pytań dotyczących ochrony danych osobowych:<br />
                📧 <strong>teodorczykpt@gmail.com</strong><br />
                📞 <strong>782-851-962</strong><br />
                📍 <strong>Ujazd 11, 56-330 Ujazd</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Polityka obowiązuje od: {new Date().toLocaleDateString('pl-PL')}
              </p>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
