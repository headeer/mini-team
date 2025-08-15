import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, CheckCircle2 } from "lucide-react";

const ShopHero = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hook */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
            Ekskluzywnie w Polsce
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            "Nie wiem, czy to łyżka czy czarna magia..."
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            <strong>Daniel z Poznania</strong> kupił pierwszą łyżkę HB500 z sceptycyzmem. 
            Po 18 miesiącach nadal używa tej samej — bez jednej wymiany.
          </p>
        </div>

        {/* Social Proof + Problem */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">2,847</div>
              <div className="text-sm text-gray-300">Polskich firm już przeszło na HB500</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">78%</div>
              <div className="text-sm text-gray-300">Redukcja kosztów wymian w pierwszym roku</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">24 msc</div>
              <div className="text-sm text-gray-300">Średni czas pracy bez wymiany</div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Statement */}
        <div className="bg-white/5 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Czy to brzmi znajomo?</h2>
            <p className="text-gray-300">
              „Każdy miesiąc to ta sama historia. Łyżka pęka, maszyna stoi, klient czeka..."
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-red-400">Problem:</h3>
              <div className="space-y-3">
                {[
                  "Łyżki pękają co 2-4 tygodnie",
                  "Przestoje kosztują 800-1500zł/dzień", 
                  "Klienci tracą cierpliwość",
                  "Konkurencja przejmuje zlecenia"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-400">Rozwiązanie:</h3>
              <div className="space-y-3">
                {[
                  "Łyżki HB500 pracują 12-24 miesiące",
                  "Zero nieplanowanych przestojów",
                  "Pewność terminów realizacji", 
                  "Przewaga nad konkurencją"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dead Ends */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            „Próbowałem wszystkiego..."
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Co już testowałeś?</h3>
              <div className="space-y-2">
                {[
                  "Tańsze łyżki z Chin → pękły po tygodniu",
                  "Lokalne spawanie → znowu pękło w tym samym miejscu", 
                  "Grubsze blachy → za ciężkie, większe spalanie",
                  "Drogie marki niemieckie → lepsze, ale nadal za słabe"
                ].map((item, idx) => (
                  <div key={idx} className="text-gray-300 text-sm">
                    ❌ {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/20 rounded-lg p-6">
              <div className="italic text-gray-300 mb-4">
                „Myślałem, że to normalne w tej branży. Że każdy ma te problemy. 
                Aż spotkałem kolegę, który od 2 lat nie wymienił ani jednej łyżki..."
              </div>
              <div className="text-sm text-gray-400">
                — Prawdziwa historia naszego klienta
              </div>
            </div>
          </div>
        </div>

        {/* Moment przełomu + CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
            TWOJA KOLEJ
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Znajdź swoją łyżkę HB500
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Wybierz rozmiar, sprawdź kompatybilność i zamów — tak proste jak to
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>2 lata gwarancji</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Dostawa 48h</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Bezpłatne dopasowanie</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopHero;
