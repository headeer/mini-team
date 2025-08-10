import React from "react";
import AppHeading from "@/components/ui/AppHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Clock } from "lucide-react";

const WhyHardox = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <AppHeading eyebrow="Materiał" title="Dlaczego Hardox HB500?" subtitle="Zobacz różnicę w żywotności między standardową stalą a Hardox HB500" />

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Chart/Comparison */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-center">Porównanie żywotności (godziny pracy)</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Legenda */}
              <div className="flex items-center justify-center gap-6 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-gray-400" aria-hidden />
                  <span>Stal standardowa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)]" aria-hidden />
                  <span>Hardox HB500</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Stal standardowa</span>
                    <div className="flex items-center gap-2 text-gray-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-lg font-bold">800h</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200/80 rounded-full h-5 border border-gray-200">
                    <div className="bg-gray-400 h-5 rounded-full shadow-inner transition-all duration-700 ease-out" style={{ width: "33%" }} role="meter" aria-valuemin={0} aria-valuemax={2400} aria-valuenow={800} aria-label="Żywotność stali standardowej (800h)" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--color-brand-orange)]">Hardox HB500</span>
                    <div className="flex items-center gap-2 text-[var(--color-brand-red)]">
                      <Clock className="w-4 h-4" />
                      <span className="text-lg font-bold">2400h</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200/80 rounded-full h-5 border border-gray-200">
                    <div className="bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] h-5 rounded-full shadow-inner transition-all duration-700 ease-out" style={{ width: "100%" }} role="meter" aria-valuemin={0} aria-valuemax={2400} aria-valuenow={2400} aria-label="Żywotność Hardox HB500 (2400h)" />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)]">3× DŁUŻEJ</p>
                    <p className="text-xs text-gray-600 mt-1">Mniej wymian, mniej przestojów</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-800">Oszczędność: <span className="font-bold text-[var(--color-brand-red)]">1600 zł rocznie</span></p>
                    <p className="text-xs text-gray-600 mt-1">Szacunkowo dla maszyn 2–3 t</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="space-y-4">
            <Card className="hover:shadow-md transition border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-3">
                <Shield className="w-6 h-6 text-[var(--color-brand-orange)] mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">3× dłużej</h4>
                  <p className="text-gray-600">Stal Hardox HB500 wytrzymuje 2400 godzin intensywnej pracy, podczas gdy standardowa stal tylko 800 godzin.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-[var(--color-brand-red)] mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Mniej wymian</h4>
                  <p className="text-gray-600">Rzadziej wymieniasz łyżkę = mniej przestojów w pracy = większy zysk.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-3">
                <Clock className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Więcej pracy</h4>
                  <p className="text-gray-600">Twoja koparka pracuje dłużej bez przerw na serwis i wymianę części.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyHardox;

