import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Regulamin Sklepu - ShopCartYT",
  description: "Regulamin świadczenia usług elektronicznych i sprzedaży produktów w sklepie ShopCartYT. Zasady korzystania z platformy.",
};

export default function RegulaminPage() {
  return (
    <div className="bg-white">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)] mb-4">
              Dokumenty Prawne
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Regulamin Sklepu</h1>
            <p className="text-xl text-gray-600">
              Regulamin świadczenia usług elektronicznych oraz sprzedaży produktów
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 1. Postanowienia ogólne</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. Niniejszy Regulamin określa zasady korzystania ze sklepu internetowego dostępnego pod adresem shopcartyt.pl</p>
                <p>2. Właścicielem sklepu internetowego jest:</p>
                <div className="ml-6 bg-gray-50 p-4 rounded-lg">
                  <p><strong>ShopCartYT</strong><br />
                  Adres: [Adres firmy]<br />
                  NIP: [NIP]<br />
                  REGON: [REGON]<br />
                  Telefon: +48 782 851 962<br />
                  E-mail: kontakt@shopcartyt.pl</p>
                </div>
                <p>3. Regulamin określa zasady zawierania umów sprzedaży oraz świadczenia usług elektronicznych przez Sklep.</p>
                <p>4. Każdy Klient zobowiązuje się do przestrzegania postanowień niniejszego Regulaminu.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 2. Definicje</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. <strong>Sklep</strong> – sklep internetowy dostępny pod adresem shopcartyt.pl</p>
                <p>2. <strong>Klient</strong> – osoba fizyczna, prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, która korzysta ze Sklepu</p>
                <p>3. <strong>Konsument</strong> – Klient będący osobą fizyczną, który zawiera umowę niezwiązaną bezpośrednio z jej działalnością gospodarczą lub zawodową</p>
                <p>4. <strong>Produkt</strong> – osprzęt budowlany, maszyn budowlanych oraz usługi obróbki blach oferowane w Sklepie</p>
                <p>5. <strong>Zamówienie</strong> – oświadczenie woli Klienta składane za pomocą formularza zamówienia</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 3. Usługi elektroniczne</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. Sklep świadczy następujące usługi elektroniczne:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Umożliwienie składania zamówień przez Formularz zamówienia</li>
                  <li>Udostępnienie katalogu produktów</li>
                  <li>Obsługa konta Klienta</li>
                  <li>Przesyłanie newslettera (po wyrażeniu zgody)</li>
                  <li>Usługa &quot;Dobierz do maszyny&quot;</li>
                  <li>Usługa weryfikacji kompatybilności produktów</li>
                </ul>
                <p>2. Wszystkie usługi elektroniczne są świadczone bezpłatnie.</p>
                <p>3. Minimalne wymagania techniczne: przeglądarka internetowa z obsługą JavaScript i cookies.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 4. Składanie zamówień</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. Zamówienia można składać 24 godziny na dobę przez wszystkie dni w roku.</p>
                <p>2. Warunkiem złożenia Zamówienia jest:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Wypełnienie formularza zamówienia</li>
                  <li>Wybór sposobu dostawy</li>
                  <li>Wybór sposobu płatności</li>
                  <li>Akceptacja Regulaminu</li>
                </ul>
                <p>3. Złożenie zamówienia równoznaczne jest z zawarciem umowy sprzedaży.</p>
                <p>4. Potwierdzenie zamówienia zostanie wysłane na adres e-mail podany przez Klienta.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 5. Ceny i płatności</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. Wszystkie ceny podane w Sklepie są cenami brutto (zawierają VAT).</p>
                <p>2. Ceny nie zawierają kosztów dostawy, które są doliczane podczas składania zamówienia.</p>
                <p>3. Dostępne formy płatności:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Płatności elektroniczne (PayU, Stripe)</li>
                  <li>Przelew bankowy tradycyjny</li>
                  <li>Płatność za pobraniem</li>
                  <li>Płatność gotówką przy odbiorze osobistym</li>
                </ul>
                <p>4. W przypadku produktów wymagających kalkulacji indywidualnej, cena zostanie podana po kontakcie telefonicznym.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 6. Dostawa</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. Dostawa realizowana jest na terenie całej Polski.</p>
                <p>2. Standardowy czas dostawy: 24-48 godzin roboczych (dla produktów dostępnych).</p>
                <p>3. Produkty wykonywane na zamówienie: czas realizacji podawany indywidualnie.</p>
                <p>4. Dostępne sposoby dostawy:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Kurier DPD/DHL</li>
                  <li>Paczkomaty InPost</li>
                  <li>Odbior osobisty (po umówieniu)</li>
                  <li>Transport dedykowany (dla dużych gabarytów)</li>
                </ul>
                <p>5. Ryzyko przejścia na Klienta przechodzi z chwilą wydania przesyłki przewoźnikowi.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 7. Prawo odstąpienia (dla Konsumentów)</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. Konsument ma prawo odstąpić od umowy bez podania przyczyny w terminie 14 dni.</p>
                <p>2. Termin liczy się od dnia, w którym Konsument wszedł w posiadanie produktu.</p>
                <p>3. Prawo odstąpienia nie przysługuje w przypadku:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Produktów wykonanych na indywidualne zamówienie</li>
                  <li>Produktów, które mogą ulec szybkiemu zepsuciu</li>
                  <li>Produktów dostarczonych w zapieczętowanym opakowaniu, które zostało otwarte</li>
                </ul>
                <p>4. Zwrot kosztów następuje w terminie 14 dni od otrzymania oświadczenia o odstąpieniu.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 8. Reklamacje i gwarancja</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. Wszystkie produkty objęte są 24-miesięczną gwarancją producenta.</p>
                <p>2. Klient może zgłosić reklamację:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Telefonicznie: +48 782 851 962</li>
                  <li>E-mail: reklamacje@shopcartyt.pl</li>
                  <li>Formularz na stronie internetowej</li>
                </ul>
                <p>3. Reklamacja powinna zawierać opis wady oraz żądanie Klienta.</p>
                <p>4. Odpowiedź na reklamację zostanie udzielona w terminie 14 dni roboczych.</p>
                <p>5. Produkty na gwarancji wymieniane są na nowe lub naprawiane bezpłatnie.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 9. Ochrona danych osobowych</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. Administratorem danych osobowych jest ShopCartYT.</p>
                <p>2. Szczegółowe informacje o przetwarzaniu danych znajdują się w Polityce Prywatności.</p>
                <p>3. Dane są przetwarzane zgodnie z RODO.</p>
                <p>4. Klient ma prawo dostępu, sprostowania, usunięcia i przenoszenia swoich danych.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">§ 10. Postanowienia końcowe</h2>
              <div className="space-y-3 text-gray-700">
                <p>1. W sprawach nieuregulowanych stosuje się przepisy prawa polskiego.</p>
                <p>2. Spory rozstrzygane są przez sąd właściwy dla siedziby Sklepu.</p>
                <p>3. Regulamin wchodzi w życie z dniem publikacji.</p>
                <p>4. Sklep zastrzega sobie prawo do zmiany Regulaminu z zachowaniem 14-dniowego okresu wypowiedzenia.</p>
                <p>5. W przypadku wprowadzenia zmian, Klienci zostaną powiadomieni przez e-mail lub komunikat na stronie.</p>
              </div>
            </section>

            <div className="bg-[var(--color-brand-orange)]/10 p-6 rounded-lg border border-[var(--color-brand-orange)]/20 mt-12">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kontakt w sprawach Regulaminu</h3>
              <p className="text-gray-700">
                W przypadku pytań dotyczących Regulaminu prosimy o kontakt:<br />
                📞 <strong>+48 782 851 962</strong><br />
                📧 <strong>kontakt@shopcartyt.pl</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Regulamin obowiązuje od: {new Date().toLocaleDateString('pl-PL')}
              </p>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
