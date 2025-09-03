import Container from "@/components/Container";
import ObrobkaContactForm from "@/components/obrobka/ObrobkaContactForm";

export const metadata = {
  title: "Frezowanie CNC – AMA PROFIL",
  description: "Centrum pionowe HAAS VF-3SSYT • CAD/CAM • 2D/3D • czwarta oś obrotowa.",
};

export default function FrezowaniePage() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 py-12">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900">Frezowanie CNC</h1>
          <p className="text-gray-700 mt-2 max-w-3xl">Centrum pionowe HAAS VF-3SSYT. Frezowanie 2D/3D, fazowanie, gwintowanie, pogłębianie, planowanie. Obsługa dokumentacji DXF/DWG oraz modelowania 3D (ESPRIT CAM).</p>
          <div className="mt-4 text-sm text-gray-700">📞 Wycena: <a className="font-semibold text-[var(--color-brand-orange)]" href="tel:+48782851962">+48 782 851 962</a></div>
        </Container>
      </div>
      <Container className="py-10 space-y-10">
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Dane techniczne</h2>
            <div className="rounded-lg border p-4">
              <ul className="text-gray-700 space-y-1">
                <li>• Przesuwy: X 1016 mm • Y 660 mm • Z 635 mm</li>
                <li>• Stół: 1372 × 610 mm (obciążenie do 794 kg)</li>
                <li>• Wrzeciono: 22.4 kW • 12 000 rpm</li>
                <li>• 4. oś obrotowa</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Możliwości</h2>
            <div className="rounded-lg border p-4">
              <ul className="text-gray-700 space-y-1">
                <li>• Frezowanie 2D/3D, fazowanie, pogłębianie</li>
                <li>• Gwintowanie i rozwiercanie</li>
                <li>• Obróbka prototypowa oraz serie</li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Wycena</h2>
          <p className="text-gray-700 mb-4">Opisz operacje (np. frezowanie 2D, gwint M8) i dołącz plik. Odpowiemy 2–24 h.</p>
          <ObrobkaContactForm service="frezowanie" />
        </section>
      </Container>
    </div>
  );
}


