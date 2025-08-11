import Container from "@/components/Container";
import AppHeading from "@/components/ui/AppHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Hammer, Cog, Filter, Layers, Ruler, Phone, ChevronRight } from "lucide-react";

type Device = {
  title: string;
  desc: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  accentFrom: string;
  accentTo: string;
};

const devices: Device[] = [
  {
    title: "Grabie",
    desc: "Do porządkowania i profilowania terenu, wysoka odporność na zużycie.",
    href: "/shop?q=grabie",
    Icon: Hammer,
    accentFrom: "from-orange-400",
    accentTo: "to-red-500",
  },
  {
    title: "Wiertnice",
    desc: "Wiercenie otworów pod słupy, zbrojenia i nasadzenia – różne średnice.",
    href: "/shop?q=wiertnica",
    Icon: Cog,
    accentFrom: "from-amber-400",
    accentTo: "to-orange-500",
  },
  {
    title: "Łyżki przesiewowe",
    desc: "Do segregacji materiału sypkiego i ziemi – szybsza praca na budowie.",
    href: "/shop?q=przesiewowe",
    Icon: Filter,
    accentFrom: "from-pink-400",
    accentTo: "to-orange-500",
  },
  {
    title: "Łyżki skandynawskie",
    desc: "Szybka ewakuacja materiału, większa pojemność robocza i wydajność.",
    href: "/shop?q=skandynawsk",
    Icon: Layers,
    accentFrom: "from-red-400",
    accentTo: "to-orange-500",
  },
  {
    title: "Niwelatory",
    desc: "Precyzyjne wyznaczanie poziomów – idealne do prac drogowych i kubaturowych.",
    href: "/shop?q=niwelator",
    Icon: Ruler,
    accentFrom: "from-orange-500",
    accentTo: "to-red-600",
  },
];

export const metadata = {
  title: "Urządzenia i osprzęt – MiniTeamProject",
  description: "Dodatkowy osprzęt do koparek: grabie, wiertnice, łyżki przesiewowe, łyżki skandynawskie, niwelatory. Hardox HB500, szybka dostawa 48 h.",
};

export default function UrzadzeniaPage() {
  return (
    <div className="relative bg-white">
      {/* Decorative background */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute -top-24 right-0 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 blur-3xl" />
      </div>

      <Container className="relative py-10 space-y-8">
        {/* Header with quick actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="max-w-3xl">
            <AppHeading title="Urządzenia i osprzęt" subtitle="Przeglądaj dodatkowy osprzęt do koparek" />
            <div className="mt-3 flex flex-wrap gap-2">
              {["grabie", "wiertnice", "przesiewowe", "skandynawsk", "niwelator"].map((tag) => (
                <Link
                  key={tag}
                  href={`/shop?q=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border bg-white hover:bg-gray-50 text-gray-700"
                >
                  <span>#</span>
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
              <Link href="/shop">Zobacz cały sklep</Link>
            </Button>
            <Button variant="outline" asChild className="border-gray-300">
              <a href="tel:+48782851962" aria-label="Zadzwoń do nas">
                <Phone className="h-4 w-4 mr-2" /> 782-851-962
              </a>
            </Button>
          </div>
        </div>

        {/* Feature strip */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Hardox HB500", desc: "Trwałość i odporność" },
            { label: "Dostawa 48 h", desc: "Na terenie Polski" },
            { label: "Dopasowanie", desc: "Kompatybilne mocowania" },
          ].map((f) => (
            <div key={f.label} className="rounded-lg border bg-white p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{f.label}</p>
                <p className="text-xs text-gray-600">{f.desc}</p>
              </div>
              <Badge className="bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)]">PRO</Badge>
            </div>
          ))}
        </div>

        {/* Devices grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {devices.map(({ title, desc, href, Icon, accentFrom, accentTo }) => (
            <Card key={title} className="group overflow-hidden border-gray-200 hover:shadow-lg transition">
              <div className={`h-1 w-full bg-gradient-to-r ${accentFrom} ${accentTo}`} />
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentFrom} ${accentTo} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h3>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">{desc}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <Button asChild size="sm" className="h-8 px-3 bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
                        <Link href={href}>
                          Zobacz w sklepie
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="h-8 px-3 border-gray-300">
                        <a href="tel:+48782851962">Zadzwoń</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {/* Help/CTA card */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Nie wiesz, co wybrać?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">Doradzimy dobór osprzętu do Twojej maszyny i zastosowania.</p>
              <div className="mt-3 flex gap-3">
                <Button asChild size="sm" className="h-8 px-3 bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
                  <Link href="/kontakt">Skontaktuj się</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-8 px-3 border-gray-300">
                  <a href="tel:+48782851962"><Phone className="h-4 w-4 mr-1" /> 782-851-962</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}


