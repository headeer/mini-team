import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

// Use public paths to avoid bundling very large assets
import imgA from "@/images/main/close-up-of-excavator-at-construction-site-backho-2025-01-29-04-41-18-utc.webp";
import imgB from "@/images/main/excavator-2025-03-15-06-31-29-utc.webp";
import imgC from "@/images/main/excavator-2025-04-02-09-43-54-utc.webp";
import imgD from "@/images/main/industrial-backhoe-excavator-loader-2024-09-12-10-51-04-utc.webp";

const tiles = [
  {
    image: imgA,
    label: "Łyżki skarpowe i kopiące",
    href: "/shop",
  },
  {
    image: imgB,
    label: "Prace ziemne bez kompromisów",
    href: "/shop",
  },
  {
    image: imgC,
    label: "Serwis i dopasowanie osprzętu",
    href: "/kontakt",
  },
  {
    image: imgD,
    label: "Mocny sprzęt do ciężkiej pracy",
    href: "/realizacje",
  },
];

const HomeShowcase = () => {
  return (
    <section className="space-y-6 py-4">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]">Zobacz w akcji</Badge>
        <h2 className="text-3xl font-bold text-gray-900">Prawdziwe zdjęcia z placu budowy</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">Realny osprzęt, realne efekty – zdjęcia z naszych realizacji i testów</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
        {tiles.map((tile) => (
          <Card key={tile.label} className="relative border-0 overflow-hidden group shadow-md hover:shadow-xl transition-shadow gap-0 py-0 h-full">
            <div className="relative aspect-[16/10]"> 
              <Image
                src={tile.image}
                alt={tile.label}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                priority={false}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="text-white font-semibold drop-shadow-md">{tile.label}</div>
                <Link href={tile.href} className="text-sm px-3 py-1.5 rounded-md bg-white/85 text-gray-900 hover:bg-white font-medium">
                  Zobacz
                </Link>
              </div>
            </div>
            <CardContent className="hidden" />
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HomeShowcase;

