"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, MapPin, Quote, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import imgA from "@/images/realizacje/A_striking_visualization_of_a_CAT_excavator_with_n-1756554699890.png";
import imgB from "@/images/realizacje/A_vibrant_construction_scene_featuring_a_JCB_machi-1756554695168.png";
import imgC from "@/images/realizacje/A_vibrant_construction_scene_featuring_a_JCB_machi-1756554705545.png";
import imgD from "@/images/main/industrial-backhoe-excavator-loader-2024-09-12-10-51-04-utc.webp";
import imgE from "@/images/main/yellow-earth-mover-at-a-construction-site-2025-01-07-23-59-23-utc.webp";
import imgF from "@/images/main/repairman-fixing-excavator-2024-10-18-06-55-12-utc.webp";

type Project = {
  title: string;
  location: string;
  image: string;
  videoUrl?: string;
  operator?: { name: string; role?: string };
  quote?: string;
  tags?: string[];
};

const projects: Project[] = [
  {
    title: "Korytowanie pod zjazd – łyżka skarpowa 120 cm",
    location: "Wrocław",
    image: imgA.src,
    videoUrl: "https://www.youtube-nocookie.com/embed/bm1oOOgKh7c?autoplay=1&mute=1&controls=1&rel=0",
    operator: { name: "Marek", role: "Operator minikoparki" },
    quote: "Wybrałem skarpówkę HB500 – równa krawędź i zero odkształceń po całym dniu.",
    tags: ["Łyżka skarpowa 120 cm", "MS03", "HB500"],
  },
  {
    title: "Wykop pod przyłącze – łyżka 30 cm z zębami",
    location: "Poznań",
    image: imgB.src,
    operator: { name: "Daniel", role: "Wykonawca przyłączy" },
    quote: "Zęby trzymają, a materiał się nie klinuje. Robota idzie szybciej.",
    tags: ["Łyżka kopiąca 30 cm", "MS03"],
  },
  {
    title: "Profilowanie skarp – łyżka skandynawska",
    location: "Katowice",
    image: imgC.src,
    operator: { name: "Sławek", role: "Brygadzista" },
    quote: "Większa pojemność to mniej przebiegów i oszczędność czasu.",
    tags: ["Łyżka skandynawska", "S40"],
  },
  {
    title: "Porządkowanie terenu – grabie 140 cm",
    location: "Łódź",
    image: imgD.src,
    operator: { name: "Tomek" },
    quote: "Twarde zęby + szerokość 140 cm = szybkie czesanie bez zatorów.",
    tags: ["Grabie 140 cm", "Hardox"],
  },
  {
    title: "Zagęszczanie podsypki – łyżka 60 cm",
    location: "Gdańsk",
    image: imgE.src,
    tags: ["Łyżka 60 cm", "JCB 8018"],
  },
  {
    title: "Prace brukarskie – szybkozłącze MS03",
    location: "Opole",
    image: imgF.src,
    tags: ["Szybkozłącze MS03", "HB500"],
  },
];

const ProjectsInAction = () => {
  const [open, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid of projects */}
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, idx) => (
            <Card key={`${p.title}-${idx}`} className="group overflow-hidden border-gray-200 hover:shadow-lg transition">
              <div className="relative">
                <Image src={p.image} alt={p.title} width={1200} height={600} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
                {p.videoUrl && (
                  <button
                    aria-label="Odtwórz video realizacji"
                    onClick={() => {
                      setActiveVideo(p.videoUrl || null);
                      setOpen(true);
                    }}
                    className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow group-hover:scale-105 transition"
                  >
                    <Play className="h-5 w-5" />
                  </button>
                )}
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <div className="flex items-center gap-2 text-xs opacity-90">
                    <MapPin className="h-4 w-4" />
                    <span>{p.location}</span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold leading-tight">{p.title}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                {p.operator || p.quote ? (
                  <div className="mb-3 text-gray-800">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-gray-600" />
                      <span>{p.operator?.name}{p.operator?.role ? ` – ${p.operator.role}` : ""}</span>
                    </div>
                    {p.quote && (
                      <div className="mt-1 flex items-start gap-2 text-sm text-gray-700">
                        <Quote className="h-4 w-4 text-[var(--color-brand-orange)] mt-0.5" />
                        <p className="italic">{p.quote}</p>
                      </div>
                    )}
                  </div>
                ) : null}
                {p.tags && (
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Badge key={t} className="bg-gray-100 text-gray-800 border">{t}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-700">Zobacz więcej historii na stronie realizacji lub wyślij zdjęcie swojej maszyny – potwierdzimy dopasowanie w 24h.</p>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="border-gray-300">
              <Link href="/realizacje">Zobacz więcej realizacji</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
              <a href="#fit-check">Sprawdź dopasowanie</a>
            </Button>
          </div>
        </div>

        {/* Video dialog */}
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setActiveVideo(null); }}>
          <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle>Realizacja – video</DialogTitle>
            </DialogHeader>
            {activeVideo && (
              <div className="w-full aspect-video">
                <iframe
                  className="w-full h-full"
                  src={activeVideo}
                  title="Realizacja wideo"
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ProjectsInAction;


