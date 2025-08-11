"use client";

import React, { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FAQ = () => {
  const [q, setQ] = useState("");
  const items = useMemo(
    () => [
      {
        k: "q1",
        q: "Jak dobrać łyżkę do maszyn 2–3 t?",
        a: "Wybierz kategorię „Łyżki kopiące” → zakres 2.3–3 t → preferowany rozmiar.",
        tags: ["dobór", "łyżki", "2–3 t"],
      },
      {
        k: "q2",
        q: "Jaki jest czas realizacji zamówienia?",
        a: "Standardowo 48 h od potwierdzenia płatności.",
        tags: ["dostawa", "termin"],
      },
      {
        k: "q3",
        q: "Czy oferujecie montaż zębów?",
        a: "Tak, koszt +120–270 zł w zależności od modelu.",
        tags: ["zęby", "montaż"],
      },
    ],
    []
  );
  const filtered = items.filter((i) => (q ? (i.q + i.a + i.tags.join(" ")).toLowerCase().includes(q.toLowerCase()) : true));

  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6">
          <Badge className="bg-[var(--color-brand-orange)]">FAQ</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3">Najczęściej zadawane pytania</h2>
          <p className="text-gray-600">Masz inne pytanie? Skorzystaj z chatu AI lub skontaktuj się z nami.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Wyszukaj odpowiedź</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input placeholder="np. łyżka 60 cm ms03" value={q} onChange={(e) => setQ(e.target.value)} />
                  <Button variant="secondary" onClick={() => setQ("")}>Wyczyść</Button>
                </div>
                <div className="mt-4">
                  <Accordion type="single" collapsible>
                    {filtered.map((item) => (
                      <AccordionItem key={item.k} value={item.k}>
                        <AccordionTrigger>{item.q}</AccordionTrigger>
                        <AccordionContent>{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Nie znalazłeś odpowiedzi?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  Zapytaj naszego <Link href="#chat" className="text-[var(--color-brand-orange)] hover:underline">AI‑asystenta</Link> lub skontaktuj się bezpośrednio – odpowiemy w 24 h.
                </p>
                <div>
                  <p><strong>Telefon:</strong> <a href="tel:+48570037128" className="hover:underline">570-037-128</a></p>
                  <p><strong>Email:</strong> <a href="mailto:teodorczykpt@gmail.com" className="hover:underline">teodorczykpt@gmail.com</a></p>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
                  <Link href="/kontakt">Wyślij zapytanie</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

