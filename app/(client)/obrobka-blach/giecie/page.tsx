import Container from "@/components/Container";
import ObrobkaContactForm from "@/components/obrobka/ObrobkaContactForm";

export const metadata = {
  title: "Gięcie blach – AMA PROFIL",
  description: "Gięcie na prasach krawędziowych Bystronic. Nacisk do 160 t, długość do 3100 mm.",
};

export default function GieciePage() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 py-12">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900">Gięcie blach</h1>
          <p className="text-gray-700 mt-2 max-w-3xl">Prasy krawędziowe Bystronic • do 160 t • długość gięcia do 3100 mm. Gięcie od 0.5 do 12 mm (zależnie od długości linii gięcia).</p>
          <div className="mt-4 text-sm text-gray-700">📞 Szybka wycena: <a className="font-semibold text-[var(--color-brand-orange)]" href="tel:+48782851962">+48 782 851 962</a></div>
        </Container>
      </div>
      <Container className="py-10 space-y-10">
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Zakres technologiczny</h2>
            <div className="rounded-lg border p-4">
              <ul className="text-gray-700 space-y-1">
                <li>• Nacisk: do 160 t</li>
                <li>• Długość gięcia: do 3100 mm</li>
                <li>• Grubość: 0.5 – 12 mm (zależnie od długości gięcia)</li>
                <li>• Pomiary i przyrządy zapewniające powtarzalność</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Materiały</h2>
            <div className="rounded-lg border p-4">
              <ul className="text-gray-700 space-y-1">
                <li>• Stal czarna (S235, S355), stal narzędziowa, transformatorowa</li>
                <li>• Stal nierdzewna / kwasoodporna (błyszcząca, szczotkowana)</li>
                <li>• Aluminium, mosiądz, miedź</li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Wycena</h2>
          <p className="text-gray-700 mb-4">Prześlij rysunek lub opisz elementy do gięcia. Podaj długość gięcia i ilości – przygotujemy kalkulację 2–24 h.</p>
          <ObrobkaContactForm service="giecie" />
        </section>
      </Container>
    </div>
  );
}


