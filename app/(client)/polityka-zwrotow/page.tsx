import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Polityka Zwrotów - ShopCartYT",
  description: "Polityka zwrotów i reklamacji w sklepie ShopCartYT. Zasady zwracania produktów, gwarancja i obsługa reklamacji.",
};

export default function PolitykaNwrotowPage() {
  return (
    <div className="bg-white">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)] mb-4">
              Zwroty i Reklamacje
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Polityka Zwrotów</h1>
            <p className="text-xl text-gray-600">
              Zasady zwracania produktów, gwarancja i obsługa reklamacji
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Prawo odstąpienia od umowy (dla konsumentów)</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Masz prawo zwrotu bez podania przyczyny</h3>
                  <p>Jako konsument masz prawo odstąpić od umowy w terminie <strong>14 dni</strong> od otrzymania produktu, bez podania przyczyny i bez ponoszenia kosztów.</p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">Jak złożyć zwrot?</h3>
                  <ol className="list-decimal ml-6 space-y-2">
                    <li>Wyślij oświadczenie o odstąpieniu w terminie 14 dni</li>
                    <li>Odeślij produkt w stanie nienaruszonym w terminie 14 dni</li>
                    <li>Otrzymasz zwrot pieniędzy w ciągu 14 dni od otrzymania produktu</li>
                  </ol>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Sposoby zgłoszenia zwrotu:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-blue-700">
                    <li>📧 E-mail: <strong>zwroty@shopcartyt.pl</strong></li>
                    <li>📞 Telefon: <strong>+48 782 851 962</strong></li>
                    <li>📝 Formularz na stronie internetowej</li>
                    <li>📬 List polecony na adres firmy</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Wyjątki od prawa odstąpienia</h2>
              <div className="space-y-3 text-gray-700">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Prawo odstąpienia NIE przysługuje w przypadku:</h3>
                  <ul className="list-disc ml-6 space-y-2 text-red-700">
                    <li><strong>Produkty wykonane na indywidualne zamówienie</strong> - osprzęt dostosowany do konkretnej maszyny na podstawie specyfikacji klienta</li>
                    <li><strong>Produkty wykonane według specjalnych wymagań</strong> - niestandardowe wymiary, modyfikacje</li>
                    <li><strong>Produkty, które mogą ulec szybkiemu zepsuciu</strong> - uszczelki, elementy gumowe po rozpakowaniu</li>
                    <li><strong>Produkty w zapieczętowanym opakowaniu</strong> - otwarte po dostawie ze względów higienicznych lub bezpieczeństwa</li>
                    <li><strong>Usługi obróbki blach</strong> - już wykonane usługi cięcia/gięcia</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Warunki zwrotu</h2>
              <div className="space-y-4 text-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">✅ Produkt do zwrotu musi być:</h4>
                    <ul className="list-disc ml-4 space-y-1 text-sm">
                      <li>W stanie nienaruszonym</li>
                      <li>W oryginalnym opakowaniu</li>
                      <li>Kompletny (z akcesoriami)</li>
                      <li>Bez śladów użytkowania</li>
                      <li>Z oryginalnymi dokumentami</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">⚠️ Zwrot niemożliwy, gdy:</h4>
                    <ul className="list-disc ml-4 space-y-1 text-sm">
                      <li>Produkt został używany</li>
                      <li>Brak oryginalnego opakowania</li>
                      <li>Uszkodzenia mechaniczne</li>
                      <li>Upłynął termin 14 dni</li>
                      <li>Produkt był modyfikowany</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Proces zwrotu krok po kroku</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--color-brand-orange)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Złóż oświadczenie o odstąpieniu</h3>
                    <p className="text-gray-600 text-sm">W terminie 14 dni od otrzymania produktu wyślij nam informację o chęci zwrotu</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--color-brand-orange)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Otrzymasz etykietę zwrotną</h3>
                    <p className="text-gray-600 text-sm">Wyślemy Ci prepaid etykietę do odesłania produktu (dla zamówień powyżej 200 zł)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--color-brand-orange)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Zapakuj i odeślij produkt</h3>
                    <p className="text-gray-600 text-sm">Zabezpiecz produkt w oryginalnym opakowaniu i nadaj przesyłkę w terminie 14 dni</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[var(--color-brand-orange)] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Otrzymaj zwrot pieniędzy</h3>
                    <p className="text-gray-600 text-sm">Po otrzymaniu i sprawdzeniu produktu zwrócimy pełną kwotę w ciągu 14 dni</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Koszty zwrotu</h2>
              <div className="space-y-4 text-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">🆓 Bezpłatny zwrot</h4>
                    <ul className="list-disc ml-4 space-y-1 text-sm text-green-700">
                      <li>Zamówienia powyżej 200 zł</li>
                      <li>Produkty wadliwe</li>
                      <li>Pomyłka w realizacji zamówienia</li>
                      <li>Uszkodzenia podczas transportu</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">💸 Koszt po stronie klienta</h4>
                    <ul className="list-disc ml-4 space-y-1 text-sm text-orange-700">
                      <li>Zamówienia poniżej 200 zł</li>
                      <li>Zwrot z przyczyn osobistych</li>
                      <li>Rezygnacja bez uzasadnienia</li>
                      <li>Koszt: około 15-25 zł</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Gwarancja i reklamacje</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">🛡️ 24-miesięczna gwarancja na wszystkie produkty</h3>
                  <p className="text-blue-700">Wszystkie produkty objęte są pełną gwarancją producenta przez 24 miesiące od daty zakupu.</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">Co obejmuje gwarancja?</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Wady materiałowe i produkcyjne</li>
                    <li>Przedwczesne zużycie przy normalnym użytkowaniu</li>
                    <li>Nieprawidłowe działanie produktu</li>
                    <li>Bezpłatna naprawa lub wymiana</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">Gwarancja NIE obejmuje:</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Uszkodzeń mechanicznych powstałych przez niewłaściwe użytkowanie</li>
                    <li>Naturalnego zużycia eksploatacyjnego</li>
                    <li>Uszkodzeń powstałych przez przeciążenie</li>
                    <li>Samowolnych napraw lub modyfikacji</li>
                    <li>Uszkodzeń przez czynniki zewnętrzne (korozja, żywioły)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Zgłaszanie reklamacji</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Reklamacja powinna zawierać:</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Numer zamówienia i datę zakupu</li>
                    <li>Dokładny opis wady lub problemu</li>
                    <li>Zdjęcia uszkodzonego produktu</li>
                    <li>Dane kontaktowe</li>
                    <li>Żądanie (naprawa, wymiana, zwrot)</li>
                  </ul>
                </div>

                <div className="bg-[var(--color-brand-orange)]/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📞 Sposoby zgłoszenia reklamacji:</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>📧 E-mail: <strong>reklamacje@shopcartyt.pl</strong></li>
                    <li>📞 Telefon: <strong>+48 782 851 962</strong></li>
                    <li>📝 Formularz reklamacyjny na stronie</li>
                    <li>📬 Korespondencja na adres firmy</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">⏱️ Terminy rozpatrzenia</h3>
                  <ul className="list-disc ml-6 space-y-1 text-green-700">
                    <li><strong>Odpowiedź na reklamację:</strong> do 14 dni roboczych</li>
                    <li><strong>Wymiana produktu:</strong> do 7 dni roboczych</li>
                    <li><strong>Zwrot pieniędzy:</strong> do 14 dni od uznania reklamacji</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Zwroty dla firm (B2B)</h2>
              <div className="space-y-3 text-gray-700">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">🏢 Specjalne warunki dla klientów biznesowych</h3>
                  <p className="text-yellow-700 mb-2">Dla firm oferujemy elastyczne podejście do zwrotów:</p>
                  <ul className="list-disc ml-6 space-y-1 text-yellow-700">
                    <li>Możliwość negocjacji warunków zwrotu</li>
                    <li>Wydłużone terminy dla dużych zamówień</li>
                    <li>Bezpłatne zwroty dla zamówień powyżej 1000 zł</li>
                    <li>Dedykowany opiekun klienta biznesowego</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Rozstrzyganie sporów</h2>
              <div className="space-y-3 text-gray-700">
                <p>W przypadku niemożności polubownego rozstrzygnięcia sporu, możesz skorzystać z:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Pozasądowego rozstrzygania sporów konsumenckich</strong> - przez Wojewódzki Inspektorat Handlowy</li>
                  <li><strong>Platformy ODR</strong> - online dispute resolution (ec.europa.eu/consumers/odr)</li>
                  <li><strong>Rzecznika Praw Konsumenta</strong> - bezpłatne porady prawne</li>
                  <li><strong>Stowarzyszeń konsumenckich</strong> - pomoc w dochodzeniu roszczeń</li>
                </ul>
              </div>
            </section>

            <div className="bg-[var(--color-brand-orange)]/10 p-6 rounded-lg border border-[var(--color-brand-orange)]/20 mt-12">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kontakt w sprawach zwrotów i reklamacji</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <h4 className="font-semibold mb-1">📦 Zwroty:</h4>
                  <p>📧 zwroty@shopcartyt.pl<br />📞 +48 782 851 962</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">🛠️ Reklamacje:</h4>
                  <p>📧 reklamacje@shopcartyt.pl<br />📞 +48 782 851 962</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Godziny pracy:</strong> Pon-Pt 8:00-16:00<br />
                <strong>Adres:</strong> [Adres firmy]
              </p>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
