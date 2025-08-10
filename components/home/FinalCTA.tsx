import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Gotowy na bezawaryjną pracę? Skontaktuj się z nami!</h2>
        <p className="text-gray-700 mb-6">Masz pytanie dotyczące kompatybilności narzędzi lub cen? Wypełnij formularz, a nasz zespół skontaktuje się w ciągu 24 godzin. Jeśli zależy Ci na pilnej odpowiedzi — zadzwoń lub skorzystaj z chatu AI.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
            <Link href="/kontakt">Wyślij zapytanie</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#chat">Rozpocznij rozmowę (AI)</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

