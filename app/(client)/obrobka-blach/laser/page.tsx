import Container from "@/components/Container";
import ObrobkaContactForm from "@/components/obrobka/ObrobkaContactForm";

export const metadata = {
  title: "Cięcie laserem 6kW – AMA PROFIL",
  description: "Profesjonalne cięcie laserem FIBER 6kW (Bystronic). Format 3000×1500 mm, wysoka dokładność, szybkie terminy.",
};

export default function LaserPage() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 py-12">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900">Cięcie laserem 6kW</h1>
          <p className="text-gray-700 mt-2 max-w-3xl">Bystronic FIBER 6kW • stół 3000 × 1500 mm • precyzyjne cięcie stali czarnej, nierdzewnej, kwasoodpornej i aluminium. Dobieramy technologię pod materiał (wytapianie / wypalanie, odpowiedni gaz tnący).</p>
          <div className="mt-4 text-sm text-gray-700">📞 Szybka wycena telefoniczna: <a className="font-semibold text-[var(--color-brand-orange)]" href="tel:+48782851962">+48 782 851 962</a></div>
        </Container>
      </div>
      <Container className="py-10 space-y-10">
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Parametry pracy</h2>
            <div className="rounded-lg border p-4">
              <ul className="text-gray-700 space-y-1">
                <li>• Stół: 3000 × 1500 mm</li>
                <li>• Stal czarna: do 25 mm</li>
                <li>• Stal nierdzewna/kwasoodporna: do 30 mm</li>
                <li>• Aluminium: do 30 mm</li>
                <li>• Dokładność: ±0,02 mm</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Dlaczego my</h2>
            <div className="rounded-lg border p-4">
              <ul className="text-gray-700 space-y-1">
                <li>• Doradztwo technologiczne i optymalizacja rozkroju</li>
                <li>• Realizacja 24–48h (express możliwy)</li>
                <li>• Cięcie wytapianie/wypalanie – dobór gazu do materiału</li>
                <li>• Cała Polska – wysyłka i odbiór</li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Wycena</h2>
          <p className="text-gray-700 mb-4">Wyślij rysunek DXF/DWG (akceptujemy też PDF/zdjęcie szkicu). Otrzymasz ofertę w 2–24 h.</p>
          <ObrobkaContactForm service="laser" />
        </section>
      </Container>
    </div>
  );
}


