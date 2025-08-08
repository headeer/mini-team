import React from "react";
import Title from "@/components/Title";

const WhyHardox = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Dlaczego Hardox HB500?
          </Title>
          <p className="text-lg text-gray-600">
            Zobacz różnicę w żywotności między standardową stalą a Hardox HB500
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-center mb-8 text-gray-900">
              Porównanie żywotności (godziny pracy)
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Stal standardowa</span>
                  <span className="text-lg font-bold text-gray-800">800h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gray-400 h-4 rounded-full" style={{ width: "33%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[var(--color-brand-orange)]">Hardox HB500</span>
                  <span className="text-lg font-bold text-[var(--color-brand-red)]">2400h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] h-4 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800 mb-1">3× DŁUŻEJ</p>
                <p className="text-sm text-green-700">Oszczędność: 1600 zł rocznie</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-[var(--color-brand-orange)]">
              <h4 className="text-lg font-bold text-gray-900 mb-2">3× dłużej</h4>
              <p className="text-gray-600">
                Stal Hardox HB500 wytrzymuje 2400 godzin intensywnej pracy, podczas gdy standardowa stal tylko 800 godzin.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-[var(--color-brand-red)]">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Mniej wymian</h4>
              <p className="text-gray-600">Rzadziej wymieniasz łyżkę = mniej przestojów w pracy = większy zysk.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-600">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Więcej pracy</h4>
              <p className="text-gray-600">Twoja koparka pracuje dłużej bez przerw na serwis i wymianę części.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyHardox;

