import Container from "@/components/Container";
import ObrobkaContactForm from "@/components/obrobka/ObrobkaContactForm";

export const metadata = {
  title: "Toczenie (obróbka skrawaniem) – AMA PROFIL",
  description: "Usługi toczenia i obróbki skrawaniem – serie, prototypy, detale jednostkowe.",
};

export default function ToczeniePage() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 py-12">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900">Toczenie (obróbka skrawaniem)</h1>
          <p className="text-gray-700 mt-2 max-w-3xl">Realizujemy toczenie na materiale własnym i powierzonym. Produkcja prototypowa, jednostkowa i małoseryjna. Dokumentacja DXF/DWG/PDF lub na podstawie detalu.</p>
          <div className="mt-4 text-sm text-gray-700">📞 Wycena: <a className="font-semibold text-[var(--color-brand-orange)]" href="tel:+48782851962">+48 782 851 962</a></div>
        </Container>
      </div>
      <Container className="py-10 space-y-10">
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Zakres usług</h2>
            <div className="rounded-lg border p-4">
              <ul className="text-gray-700 space-y-1">
                <li>• Toczenie elementów stalowych, nierdzewnych, aluminium i mosiądzu</li>
                <li>• Gwintowanie, rozwiercanie, planowanie</li>
                <li>• Małe serie i prototypy</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Branże</h2>
            <div className="rounded-lg border p-4">
              <ul className="text-gray-700 space-y-1">
                <li>• Maszynowa, automotive, lotnicza</li>
                <li>• Budowlana i wykończeniowa</li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Wycena</h2>
          <p className="text-gray-700 mb-4">Opisz operacje oraz ilości i materiały. Dołącz rysunki – odpiszemy 2–24 h.</p>
          <ObrobkaContactForm service="toczenie" />
        </section>
      </Container>
    </div>
  );
}


